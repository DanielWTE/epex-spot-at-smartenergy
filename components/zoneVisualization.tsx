import React from 'react';

const ZoneVisual: React.FC<{ dataClarification: any }> = ({ dataClarification }) => {

    const allClarifications = [] as any;

    Object.keys(dataClarification).forEach(zone => {
        allClarifications.push(...dataClarification[zone].entries.map((entry: { time: string; value: number; }) => {
            return {
                zone,
                date: entry.time,
                value: entry.value
            };
        }));
    });

    if (allClarifications.length === 0) {
        return <div className="text-center text-gray-500">No data available</div>;
    }

    allClarifications.sort((a: { date: string; }, b: { date: string; }) => {
        const aHour = a.date.split('T')[1].split('.')[0];
        const bHour = b.date.split('T')[1].split('.')[0];

        if (aHour === '02:00') {
            return 1;
        }

        if (bHour === '02:00') {
            return -1;
        }

        return aHour.localeCompare(bHour);
    });

    const renderBlocks = allClarifications.map((clarification: { zone: string; date: string; value: number; }, index: number) => {
        let gradient = '';
        switch (clarification.zone) {
            case 'high':
                gradient = 'bg-gradient-to-r from-red-500 to-red-600';
                break;
            case 'mid':
                gradient = 'bg-gradient-to-r from-yellow-500 to-yellow-600';
                break;
            case 'low':
                gradient = 'bg-gradient-to-r from-green-500 to-green-600';
                break;
            default:
                gradient = 'bg-gradient-to-r from-gray-300 to-gray-400';
        }

        return (
            <div key={index} className="flex flex-col items-center">
                <div key={index} className={`p-4 ${gradient} text-white text-center mx-1 my-2 shadow-lg rounded-lg border border-gray-200 hover:border-gray-400 transition-all duration-300 ease-in-out cursor-pointer`}
                    title={`Time: ${clarification.date}`}>
                    {(clarification.date.split('T')[1]).split('.')[0]}
                </div>
                <div className="text-center text-sm text-gray-500">{clarification.value.toFixed(2)} ct/kWh</div>
            </div>
        );
    });

    return (
        <div className="flex justify-center items-center flex-wrap">
            {renderBlocks}
        </div>
    );
};

export default ZoneVisual;