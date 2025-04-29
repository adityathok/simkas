// utils/formatDate.ts
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export function formatDate(value: string, format: string = 'YYYY-MM-DD HH:mm:ss') {
    
    return value?dayjs(value).utc().local().format(format):''

}