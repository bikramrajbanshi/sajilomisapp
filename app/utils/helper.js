export const hasSpecificPermission = (userInfo, name) => {
    return userInfo.userRolePermission.some(permission => permission.moduleName === name);
};

export const getShrawan1stInAD = (adYear) => {
    // Base date: 1st Shrawan 2001 BS corresponds to 17th July 1944 AD
    const baseAd = new Date(1944, 6, 17); // July 17, 1944
    const baseBsYear = 2001;

    // Calculate the difference in years from the base year
    const yearDiff = adYear - baseAd.getFullYear();

    // Calculate corresponding Shrawan 1st date in AD
    const shrawan1stDate = new Date(adYear, 6, 16); // 16th July in the given AD year

    return shrawan1stDate;
    // return shrawan1stDate.toDateString(); // Returns date as a readable string
};

export const findNepaliDate = (dateData,englishDate) => {
    const dateObject = dateData.find(item => item.englishDate === englishDate);
    return dateObject ? dateObject.nepaliDate : '';
};

export const getCurrentNepaliMonthAttendanceId = (attendanceData, isAD)  => {
    const currentDate = new Date();
    // Loop through each attendance year
    for (const year of attendanceData) {
        // Loop through each month within the current year
        for (const month of year.attendanceMonths) {
            // Check if month is in Nepali calendar and contains current date
            if(!isAD){
                if (!month.isAD) {
                    const startDate = new Date(month.monthStartDate);
                    const endDate = new Date(month.monthEndDate);

                    // Check if current date is within this month range
                    if (currentDate >= startDate && currentDate <= endDate) {
                        return month.attendanceYearMonthId;
                    }
                }
            } else {
                if (month.isAD) {
                    const startDate = new Date(month.monthStartDate);
                    const endDate = new Date(month.monthEndDate);

                    // Check if current date is within this month range
                    if (currentDate >= startDate && currentDate <= endDate) {
                        return month.attendanceYearMonthId;
                    }
                }
            }

        }
    }
    return null; // Returns null if no matching month is found
}

export const getCurrentMonthId = (months, isAD)  => {
    const currentDate = new Date();
    // Loop through each attendance year
        for (const month of months) {
                

            // Check if month is in Nepali calendar and contains current date
            if(!isAD){

                if (!month.isAD) {
                    const startDate = new Date(month.monthStartDate);
                    const endDate = new Date(month.monthEndDate);

                    // Check if current date is within this month range
                    if (currentDate >= startDate && currentDate <= endDate) {
                        return month.attendanceYearMonthId;
                    }
                }
            } else {
                if (month.isAD) {
                    const startDate = new Date(month.monthStartDate);
                    const endDate = new Date(month.monthEndDate);

                    // Check if current date is within this month range
                    if (currentDate >= startDate && currentDate <= endDate) {
                        return month.attendanceYearMonthId;
                    }
                }
            }

    }
    return null; // Returns null if no matching month is found
}

// Function to get attendanceYearId for the current date, without considering isAD
export const getCurrentAttendanceYearId = (attendanceYears) => {
    const currentFiscalYear = attendanceYears.find(year => year.isCurrentAttendanceYear);
    const currentFiscalYearId = currentFiscalYear ? currentFiscalYear.attendanceYearId : null;
    return currentFiscalYearId; // Returns null if no matching year is found
}

// Helper to check if location data is valid
export const isValidLocation = (location) => {
    return location && location.latitude && location.longitude;
};
