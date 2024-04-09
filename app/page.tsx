"use client";

import { useEffect, useState } from "react";
import { timeframes } from "@/config/timeframes";
import { useGetData } from "@/hooks/data/getData";
import TimeframeSelection from "@/components/timeframe";
import { EnergyPriceChart, EnergyPriceChartSkeleton } from "@/components/charts/energyPriceChart";
import { ZoneVisual, ZoneVisualSkeleton } from "@/components/zoneVisualization";

export default function Main() {
  const [timeframe, setTimeframe] = useState(timeframes[1].value);
  const { getDataResult, getDataError, getDataLoading } = useGetData({
    queryParams: {
      timeframe,
    },
  });

  const [energyData, setEnergyData] = useState([]);
  const [clarifications, setClarifications] = useState([]);

  useEffect(() => {
    if (getDataResult) {
      setEnergyData(getDataResult.data.energyData);
      setClarifications(getDataResult.data.clarifications);
    }
  }, [getDataResult]);

  return (
    <>
      <div className="min-h-full">
        <div className="py-6">
          <header>
            <div className="mx-auto max-w-7xl px-4 sm:px-4 lg:px-6">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                Overview
              </h1>
            </div>
          </header>
          <hr className="mx-auto max-w-7xl px-4 sm:px-4 lg:px-6 mt-4" />
          <main className="mx-auto max-w-7xl px-4 sm:px-4 lg:px-6 mt-4">
            <div className="mt-2">
              <h2 className="text-md font-semibold text-gray-900 mb-1">Timeframe</h2>
              <TimeframeSelection selected={timeframe} setSelected={setTimeframe} />
            </div>
            <hr className="mt-4" />
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-4 mt-4">
                <div className="bg-white overflow-hidden shadow rounded-lg p-4">
                  <h1 className="text-xl font-bold text-center p-4">Energy Prices Over Time</h1>
                  {getDataLoading && energyData.length === 0 ? (
                    <EnergyPriceChartSkeleton />
                  ) : (
                    <EnergyPriceChart data={energyData} />
                  )}
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg p-4">
                  <h1 className="text-xl font-bold text-center p-4">Zone Clarifications</h1>
                  {getDataLoading && clarifications.length === 0 ? (
                    <ZoneVisualSkeleton />
                  ) : (
                    <ZoneVisual dataClarification={clarifications} timeFrame={timeframe} />
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}