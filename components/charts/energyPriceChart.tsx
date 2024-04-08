import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-moment';

interface DataPoint {
  date: string;
  value: number;
}

interface Props {
  data: DataPoint[];
}

export const EnergyPriceChart: React.FC<Props> = ({ data }) => {
    if (data.length === 0) {
        return <div className="text-center text-gray-500">No data available</div>;
    }

    const gradientFill = (chart: any) => {
        const ctx = chart.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(75, 192, 192, 0.6)');
        gradient.addColorStop(1, 'rgba(75, 192, 192, 0.1)');
        return gradient;
    };

    const chartData = {
        labels: data.map(d => new Date(d.date)),
        datasets: [
        {
            label: 'Energy Price (ct/kWh)',
            data: data.map(d => d.value),
            fill: true,
            backgroundColor: (context: any) => gradientFill(context),
            borderColor: 'rgba(75, 192, 192, 0.2)',
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.4
        },
        ],
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
            color: "rgba(200, 200, 200, 0.1)"
            }
        }
        },
        plugins: {
        legend: {
            display: true,
            position: 'top',
            labels: {
            boxWidth: 12,
            padding: 20,
            font: {
                size: 14
            },
            color: 'gray'
            }
        },
        tooltip: {
            usePointStyle: true,
        }
        },
        elements: {
        line: {
            borderWidth: 3
        },
        point: {
            radius: 5,
            borderWidth: 2,
            hoverRadius: 7,
            hoverBorderWidth: 3
        }
        }
    } as any;

    return (
        <div className="relative h-72">
        <Line data={chartData} options={options} />
        </div>
    );
};

export const EnergyPriceChartSkeleton: React.FC = () => {
    return (
        <div className="animate-pulse">
            <div className="w-full h-72 bg-gray-200 rounded-lg"></div>
        </div>
    );
};