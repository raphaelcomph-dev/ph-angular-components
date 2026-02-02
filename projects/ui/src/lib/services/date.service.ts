import { Injectable } from '@angular/core';
import dayjs from 'dayjs';
import { Age, type AgeData } from '../models/age';

@Injectable({
    providedIn: 'root',
})
export class DateService {
    ageToString(
        date: Date,
        onDate: Date = new Date(),
        short: boolean = false,
        includeRelativePrefix?: boolean,
        includeWeeks?: boolean,
    ): string {
        try {
            date = dayjs(date).toDate();
            const ageData = this.calculateAge(date, onDate, includeWeeks);
            const age = new Age(ageData);

            // Early return for zero age
            if (age.isZero()) {
                return 'hoje';
            }

            return age.toString(short, includeRelativePrefix, date, onDate);
        } catch (error) {
            console.error(error);
            return '';
        }
    }

    calculateAge(date: Date, onDate: Date = new Date(), includeWeeks: boolean = false): AgeData {
        date = dayjs(date).toDate();
        onDate = dayjs(onDate).toDate();
        const afterDate = date.getTime() > onDate.getTime() ? date : onDate;
        const beforeDate = date.getTime() < onDate.getTime() ? date : onDate;

        let years = afterDate.getFullYear() - beforeDate.getFullYear();
        let months = afterDate.getMonth() - beforeDate.getMonth();
        let days = 0;

        if (months < 0 || (months === 0 && afterDate.getDate() < beforeDate.getDate())) {
            years--;
            months += 12;
        }

        if (afterDate.getDate() > beforeDate.getDate()) {
            days = afterDate.getDate() - beforeDate.getDate();
        } else if (afterDate.getDate() < beforeDate.getDate()) {
            days = dayjs(beforeDate).daysInMonth() - beforeDate.getDate() + afterDate.getDate();
            months--;
        }

        if (includeWeeks) {
            const weeks = Math.floor(days / 7);
            days -= weeks * 7;
            return { years, months, weeks, days };
        }

        const hours = afterDate.getHours() - beforeDate.getHours();
        const minutes = afterDate.getMinutes() - beforeDate.getMinutes();
        const seconds = afterDate.getSeconds() - beforeDate.getSeconds();

        return { years, months, days, hours, minutes, seconds };
    }
}
