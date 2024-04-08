import { NextRequest, NextResponse } from 'next/server';
import data from '@/database/models/data';
import connectDB from '@/database/connect';
import crypto from 'crypto';
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from '@vercel/kv';
import { convertUTCtoGMT2, formatFetchedData, toLocalTimeISOString } from '@/utils/format';
import { calculateBestTimes } from '@/utils/calculate';

export async function GET(req: NextRequest) {
  try {

    const rateLimit = new Ratelimit({
        redis: kv,
        limiter: Ratelimit.slidingWindow(10, '1 m'),
    })

    const { success } = await rateLimit.limit(req.headers.get('x-real-ip') as string || req.headers.get('x-forwarded-for') as string || 'guest');

    if (!success) {
      return NextResponse.json({ message: 'Rate limit exceeded' }, { status: 429 });
    }

    const request = await fetch(process.env.SMART_ENERGY_EPEX_SPOT_AT_ENDPOINT_URL as string, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await request.json();

    if (!request.ok) {
      return NextResponse.json({ message: 'An error occurred while fetching data' }, { status: 500 });
    }

    await connectDB();

    const formattedData = formatFetchedData(response.data);

    const splitData = formattedData.reduce((acc: any, curr) => {
      const date = convertUTCtoGMT2(curr.date);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(curr);
      return acc;
    }, {});

    for (const date in splitData) {
      const hash = crypto.createHash('sha256');
      hash.update(JSON.stringify(splitData[date]));
      const hashValue = hash.digest('hex');

      const existingData = await data.findOne
        ({
          hash: hashValue,
        });

      if (!existingData) {
        const calculatedData = calculateBestTimes(splitData[date]);

        const newData = new data({
          hash: hashValue,
          tariff: response.tariff,
          unit: response.unit,
          interval: 60, // because we're formatting the 15 minute records to 1 hour
          data: splitData[date],
          energy_date: new Date(toLocalTimeISOString(date)),
          data_clarification: calculatedData,
        });

        await newData.save();
      }
    }

    return NextResponse.json({ message: 'Data fetched and saved successfully' }, { status: 200 });

  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: 'An error occurred', error: err }, { status: 500 });
  }
}