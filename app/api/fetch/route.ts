import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/database/connect';
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from '@vercel/kv';
import data from '@/database/models/data';
import { timeframes } from '@/config/timeframes';
import { calculateEndDate, calculateStartDate } from '@/utils/calculate';

interface Zone {
  entries: { time: string, value: number }[];
}

interface Clarifications {
  low: Zone;
  mid: Zone;
  high: Zone;
}

interface CombinedData {
  energyData: any[];
  clarifications: Clarifications;
}

export async function GET(req: NextRequest) {
  const timeframe = req.nextUrl.searchParams.get('timeframe');
  if (!timeframe) {
    return NextResponse.json({ message: 'Please provide a timeframe' }, { status: 400 });
  }

  const selectedTimeframe = timeframes.find((tf) => tf.value === timeframe);
  if (!selectedTimeframe) {
    return NextResponse.json({ message: 'Invalid timeframe' }, { status: 400 });
  }

  const rateLimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
  })

  const { success } = await rateLimit.limit(req.headers.get('x-real-ip') as string || req.headers.get('x-forwarded-for') as string || 'guest');

  if (!success) {
    return NextResponse.json({ message: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    await connectDB();

    const startDate = calculateStartDate(selectedTimeframe.value);
    const endDate = calculateEndDate(startDate, selectedTimeframe.duration, selectedTimeframe.unit);
    const query = startDate ? { energy_date: { $gte: startDate, $lte: endDate } } : {};

    const fetchedData = await data.find(query);

    const combinedData: CombinedData = {
      energyData: [],
      clarifications: {
        low: { entries: [] },
        mid: { entries: [] },
        high: { entries: [] },
      }
    };

    fetchedData.forEach(doc => {
      combinedData.energyData.push(...doc.data);
  
      if (doc.data_clarification && doc.data_clarification.length > 0) {
          const clarifications = doc.data_clarification[0];
          const zones = ['low', 'mid', 'high'] as const;
          zones.forEach(zone => {
              combinedData.clarifications[zone].entries = clarifications[zone].map((item: any) => ({
                  time: item.time,
                  value: item.value
              }));
          });
      }
    });

    return NextResponse.json({ message: 'Data fetched successfully', data: combinedData }, { status: 200 });

  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: 'An error occurred', error: err }, { status: 500 });
  }
}