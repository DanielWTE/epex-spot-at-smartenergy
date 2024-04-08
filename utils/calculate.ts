import { toISOStringInTimeZone } from "./format";

interface DataPoint {
    date: string;
    value: number;
}

interface ZoneRecommendation {
    low: { time: string, value: number }[],
    mid: { time: string, value: number }[],
    high: { time: string, value: number }[]
}

export function calculateBestTimes(data: DataPoint[]): ZoneRecommendation {
    const hourlyAverages: { [hour: string]: { total: number, count: number } } = {};
    data.forEach(point => {
        const date = new Date(point.date);
        const hour = toISOStringInTimeZone(date, 2);
        if (!hourlyAverages[hour]) {
            hourlyAverages[hour] = { total: 0, count: 0 };
        }
        hourlyAverages[hour].total += point.value;
        hourlyAverages[hour].count++;
    });

    const hourlyResults: { [hour: string]: number } = {};
    Object.keys(hourlyAverages).forEach(hour => {
        hourlyResults[hour] = hourlyAverages[hour].total / hourlyAverages[hour].count;
    });

    const sortedHours = Object.keys(hourlyResults).sort((a, b) => hourlyResults[a] - hourlyResults[b]);
    const zoneSize = Math.floor(sortedHours.length / 3);
    const recommendations: ZoneRecommendation = {
        low: sortedHours.slice(0, zoneSize).map(hour => ({ time: hour, value: hourlyResults[hour] })),
        mid: sortedHours.slice(zoneSize, 2 * zoneSize).map(hour => ({ time: hour, value: hourlyResults[hour] })),
        high: sortedHours.slice(-zoneSize).map(hour => ({ time: hour, value: hourlyResults[hour] }))
    };
    
    return recommendations;
}

export function calculateStartDate(timeframeValue: string) {
    const now = new Date();
    switch (timeframeValue) {
        case 'tomorrow':
            const tomorrow = new Date(now.setDate(now.getDate() + 1));
            return new Date(tomorrow.setHours(0, 0, 0, 0));
        case 'today':
            return new Date(now.setHours(0, 0, 0, 0));
        case 'yesterday':
            const yesterday = new Date(now.setDate(now.getDate() - 1));
            return new Date(yesterday.setHours(0, 0, 0, 0));
        case 'this_week':
            const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
            return new Date(weekStart.setHours(0, 0, 0, 0));
        case 'this_month':
            return new Date(now.getFullYear(), now.getMonth(), 1);
        case 'this_year':
            return new Date(now.getFullYear(), 0, 1);
        case 'all_time':
            return null;
        default:
            return new Date();
    }
}

export function calculateEndDate(startDate: any, duration: any, unit: any) {
    if (!startDate) return null;
    const endDate = new Date(startDate);
    switch (unit) {
        case 'days':
            endDate.setDate(startDate.getDate() + duration);
            break;
        case 'months':
            endDate.setMonth(startDate.getMonth() + duration);
            break;
        case 'years':
            endDate.setFullYear(startDate.getFullYear() + duration);
            break;
        default:
            break;
    }
    return endDate;
}