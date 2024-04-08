import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-moment';
import 'chartjs-plugin-annotation';

interface DataPoint {
  date: string;
  value: number;
}

interface Clarification {
    date: string;
}

interface DataClarification {
    high: Clarification[];
    mid: Clarification[];
    low: Clarification[];
}

interface Props {
    energyData: DataPoint[];
    dataClarification: DataClarification;
}

export const ZoneChart: React.FC<Props> = ({ dataClarification }) => {
    if (dataClarification.high.length === 0 && dataClarification.mid.length === 0 && dataClarification.low.length === 0) {
        return <div className="text-center text-gray-500">No data available</div>;
    }

    const highAnnotations = dataClarification.high.map((clarification, index) => {
        return {
            type: 'line',
            mode: 'vertical',
            scaleID: 'x',
            value: clarification.date,
            borderColor: 'red',
            borderWidth: 2,
            label: {
                content: 'High',
                enabled: true,
                position: 'top'
            }
        };
    });

    const midAnnotations = dataClarification.mid.map((clarification, index) => {
        return {
            type: 'line',
            mode: 'vertical',
            scaleID: 'x',
            value: clarification.date,
            borderColor: 'orange',
            borderWidth: 2,
            label: {
                content: 'Mid',
                enabled: true,
                position: 'top'
            }
        };
    });

    const lowAnnotations = dataClarification.low.map((clarification, index) => {
        return {
            type: 'line',
            mode: 'vertical',
            scaleID: 'x',
            value: clarification.date,
            borderColor: 'green',
            borderWidth: 2,
            label: {
                content: 'Low',
                enabled: true,
                position: 'top'
            }
        };
    });

    const annotations = [...highAnnotations, ...midAnnotations, ...lowAnnotations];

    const chartData = {
        labels: [],
        datasets: []
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'time',
                time: {
                    parser: 'YYYY-MM-DDTHH:mm:ssZ',
                    unit: 'hour',
                    displayFormats: {
                        hour: 'HH:mm'
                    },
                    tooltipFormat: 'MMM DD, HH:mm'
                },
                title: {
                    display: true,
                    text: 'Time'
                },
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Price (ct/kWh)'
                },
                grid: {
                    drawBorder: false,
                    display: false
                }
            }
        },
        plugins: {
            annotation: {
                annotations: annotations
            }
        }
    } as any;

    return (
        <div className="h-72">
            <Line data={chartData} options={options} />
        </div>
    );
}



export const ZoneChartSkeleton: React.FC = () => {
    return <div className="h-72 bg-gray-100 rounded-lg" />;
}