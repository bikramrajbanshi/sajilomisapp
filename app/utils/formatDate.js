import { format, parseISO, formatDistanceToNow } from 'date-fns';

const formatDate = (isoString) => {
    const date = parseISO(isoString);
    const formattedDate = format(date, "MMMM d, yyyy h:mm a");
    const relativeTime = formatDistanceToNow(date, { addSuffix: true });

    return `${formattedDate} (${relativeTime})`;
};

export const formatSingleDate = (timestamp, formatType = 'full') => {
    // Extract date part from the timestamp
    const datePart = timestamp.split("T")[0];

    // Create a new Date object
    const date = new Date(datePart);

    // Extract day, month, and year
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    if (formatType === 'full') {
        // Return the full formatted date
        return `${day} ${month} ${year}`;
    } else if (formatType === 'separate') {
        // Return an object with separate day, month, and year
        return { day, month, year };
    }
};

export const formatDateRange = (timestamp1, timestamp2) => {
    // Format both dates separately
    const date1 = formatSingleDate(timestamp1, 'separate');
    const date2 = formatSingleDate(timestamp2, 'separate');

    // Check if the year is the same for both dates
    if (date1.year === date2.year) {
        return `${date1.day} ${date1.month} - ${date2.day} ${date2.month} ${date1.year}`;
    } else {
        return `${date1.day} ${date1.month} ${date1.year} - ${date2.day} ${date2.month} ${date2.year}`;
    }
};

export default formatDate;
