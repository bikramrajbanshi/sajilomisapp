// src/utils/dateUtils.js
import moment from 'moment-timezone';
import {convertADtoBS,convertBStoAD} from 'react-native-nepali-calendar/calendarFunction';

const TIMEZONE = 'Asia/Kathmandu';

/**
 * Returns today's date in ISO string format adjusted to Kathmandu timezone.
 * @returns {string} ISO string representation of today's date in Kathmandu timezone.
 */
export const getTodayISOString = () => {
    return moment().tz(TIMEZONE).format();
};

export const getTodayFullDate = () => {
    return moment().tz(TIMEZONE).format('YYYY-MM-DD');
};

export const getCurrentTime = () => {
    return moment().tz(TIMEZONE).format('HH:mm:ss');
};

export const geFullDate = (date, useNepaliDate = false) => {

    if(useNepaliDate == true)
    {
        const dateObject = new Date(date); 
        const adYear = dateObject.getFullYear();
        const adMonth = dateObject.getMonth() + 1;
        const adDay = dateObject.getDate();
        const bsDate = convertADtoBS(adYear, adMonth, adDay);
        return `${bsDate.bsYear}-${String(bsDate.bsMonth).padStart(2, '0')}-${String(bsDate.bsDate).padStart(2, '0')}`;
        
    }
    else
    {
        const momentDate = moment.isMoment(date) ? date : moment(date);
        return momentDate.tz(TIMEZONE).format('YYYY-MM-DD');
    }
    

};

/**
 * Converts a given date to Kathmandu timezone and returns the ISO string.
 * @param {Date | string} date - The date to convert.
 * @returns {string} ISO string representation of the date in Kathmandu timezone.
 */
export const convertToKathmanduTime = (date) => {
    return moment(date).tz(TIMEZONE).format();
};

/**
 * Converts a given date in Kathmandu timezone to UTC and returns the ISO string.
 * @param {Date | string} date - The date to convert.
 * @returns {string} ISO string representation of the date in UTC.
 */
export const convertToUTCFromKathmandu = (date) => {
    return moment(date).tz(TIMEZONE).utc().format();
};

