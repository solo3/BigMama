import { HDate } from '@hebcal/core';
import { getHolidaysOnDate } from '@hebcal/core/dist/esm/holidays';
import type { Event as HebcalEvent } from '@hebcal/core';

/**
 * Converts a number to Hebrew numerals (e.g., 15 -> "ט"ו")
 */
function numberToHebrewNumerals(num: number): string {
    const hebrewNumerals: Record<number, string> = {
        1: 'א',
        2: 'ב',
        3: 'ג',
        4: 'ד',
        5: 'ה',
        6: 'ו',
        7: 'ז',
        8: 'ח',
        9: 'ט',
        10: 'י',
        20: 'כ',
        30: 'ל',
        40: 'מ',
        50: 'נ',
        60: 'ס',
        70: 'ע',
        80: 'פ',
        90: 'צ',
        100: 'ק',
        200: 'ר',
        300: 'ש',
        400: 'ת',
    };

    if (num === 0) return '';
    if (num >= 500) {
        // Handle larger numbers by combining ת (400) with remainder
        const hundreds = Math.floor(num / 400);
        const remainder = num % 400;
        return hebrewNumerals[400].repeat(hundreds) + numberToHebrewNumerals(remainder);
    }

    // Special cases for 15 and 16 (written as ט"ו and ט"ז to avoid religious implications)
    if (num === 15) return 'ט"ו';
    if (num === 16) return 'ט"ז';

    let result = '';
    let remaining = num;

    // Handle hundreds
    if (remaining >= 100) {
        const hundreds = Math.floor(remaining / 100) * 100;
        result += hebrewNumerals[hundreds];
        remaining -= hundreds;
    }

    // Handle tens
    if (remaining >= 10) {
        const tens = Math.floor(remaining / 10) * 10;
        result += hebrewNumerals[tens];
        remaining -= tens;
    }

    // Handle units
    if (remaining > 0) {
        result += hebrewNumerals[remaining];
    }

    return result;
}

/**
 * Get Hebrew date numerals for a Gregorian date (e.g., "י"ב", "כ"ג")
 */
export function getHebrewDateNumerals(date: Date): string {
    try {
        const hdate = new HDate(date);
        const day = hdate.getDate();
        return numberToHebrewNumerals(day);
    } catch (error) {
        console.warn('Failed to convert to Hebrew date numerals:', error);
        return '';
    }
}

/**
 * Get Hebrew month and year for a Gregorian date
 */
export function getHebrewMonthYear(date: Date): { month: string; year: string } {
    try {
        const hdate = new HDate(date);
        const monthNames: Record<number, string> = {
            1: 'תשרי',
            2: 'חשון',
            3: 'כסלו',
            4: 'טבת',
            5: 'שבט',
            6: 'אדר',
            7: 'ניסן',
            8: 'אייר',
            9: 'סיון',
            10: 'תמוז',
            11: 'אב',
            12: 'אלול',
        };

        // Handle leap year (Adar I and Adar II)
        const month = hdate.getMonth();
        const monthName = monthNames[month] || '';
        const year = hdate.getFullYear();

        return {
            month: monthName,
            year: numberToHebrewNumerals(year),
        };
    } catch (error) {
        console.warn('Failed to get Hebrew month/year:', error);
        return { month: '', year: '' };
    }
}

/**
 * Check if a date is Shabbat (Saturday)
 */
export function isShabbat(date: Date): boolean {
    return date.getDay() === 6; // Saturday is 6 (0 = Sunday in JS)
}

/**
 * Get Hebrew holidays for a specific date
 */
export function getHolidays(date: Date): string[] {
    try {
        const hdate = new HDate(date);
        const events = getHolidaysOnDate(hdate, true) || [];
        return events.map((event: HebcalEvent) => event.render('he'));
    } catch (error) {
        console.warn('Failed to get Hebrew holidays:', error);
        return [];
    }
}

/**
 * Check if a date has any Hebrew holidays
 */
export function isHoliday(date: Date): boolean {
    return getHolidays(date).length > 0;
}

/**
 * Get full Hebrew date string for storage (e.g., "כ׳ שבט תשפ"ו")
 */
export function getHebrewDate(date: Date): string {
    try {
        const hdate = new HDate(date);
        return hdate.toString(); // Returns Hebrew format
    } catch (error) {
        console.warn('Failed to get Hebrew date:', error);
        return '';
    }
}
