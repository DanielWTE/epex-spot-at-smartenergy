export interface DataPoint {
    date: string;
    value: number;
}

export function formatFetchedData(data: DataPoint[]): DataPoint[] {
    const formattedData: DataPoint[] = [];
    let currentHour = data[0].date.substring(0, 13);
    let lastValue = data[0].value;

    formattedData.push(data[0]);

    data.forEach((point, index) => {
        const hour = point.date.substring(0, 13);
        if (hour !== currentHour) {
            formattedData.push({
                date: point.date,
                value: point.value
            });
            currentHour = hour;
            lastValue = point.value;
        } else if (point.value !== lastValue) {
            formattedData.push({
                date: point.date,
                value: point.value
            });
            lastValue = point.value;
        }
    });

    return formattedData;
}

export function toISOStringInTimeZone(date: Date, timeZoneOffset: number): string {
    var newDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000) + (timeZoneOffset * 3600000));
    return newDate.toISOString();
}

export function convertUTCtoGMT2(utcDateString: string): string {
    const date = new Date(utcDateString);
    date.setHours(date.getHours() + 2);
    return date.toISOString().split('T')[0];
}

export function toLocalTimeISOString(utcDate: string): string {
    const date = new Date(utcDate);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset() + 120);
    return date.toISOString();
}