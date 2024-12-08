import React from 'react';

const GetTime = ({ time }) => {
  const formatTime = (isoString) => {
    const inputDate = new Date(isoString);
    const now = new Date();

    if (isNaN(inputDate)) {
      return ''; // If the inputDate is invalid, return an empty string
    }

    // Function to format day with superscript (e.g., 1st, 2nd, 3rd)
    const formatDayWithSuffix = (day) => {
      const suffix = ['th', 'st', 'nd', 'rd'];
      const mod100 = day % 100;
      return day + (suffix[(mod100 - 20) % 10] || suffix[mod100] || suffix[0]);
    };

    // Function to format time (hour:minute)
    const formatTimeOnly = (date) => {
      const options = { hour: '2-digit', minute: '2-digit', hour12: false };
      return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    // Function to check if two dates are on the same day
    const isSameDay = (date1, date2) =>
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();

    // Get the start of the current week (Sunday)
    const getStartOfWeek = (date) => {
      const startOfWeek = new Date(date);
      const day = startOfWeek.getDay(); // Sunday = 0
      startOfWeek.setDate(startOfWeek.getDate() - day); // Move to Sunday
      startOfWeek.setHours(0, 0, 0, 0);
      return startOfWeek;
    };

    // Get the start of last week (the Sunday before the current week's start)
    const getStartOfLastWeek = (date) => {
      const startOfLastWeek = getStartOfWeek(date);
      startOfLastWeek.setDate(startOfLastWeek.getDate() - 7); // Move back 7 days to the start of last week
      return startOfLastWeek;
    };

    const dayOfWeek = inputDate.toLocaleDateString('en-US', {
      weekday: 'long',
    });

    const monthName = inputDate.toLocaleDateString('en-US', {
      month: 'long',
    });

    const day = formatDayWithSuffix(inputDate.getDate());

    const startOfCurrentWeek = getStartOfWeek(now);
    const startOfLastWeek = getStartOfLastWeek(now);

    // If the input date is exactly today (no "Just now", return only hh:mm)
    if (isSameDay(inputDate, now)) {
      return formatTimeOnly(inputDate); // Return the time part only (hh:mm)
    }

    // If the input date is yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (isSameDay(inputDate, yesterday)) {
      return `Yesterday, ${formatTimeOnly(inputDate)}`;
    }

    // If the input date is within the current week (including today)
    if (
      inputDate >= startOfCurrentWeek &&
      inputDate <
        new Date(startOfCurrentWeek).setDate(startOfCurrentWeek.getDate() + 7)
    ) {
      return dayOfWeek; // Return the day of the week
    }

    // If the input date is within last week
    if (inputDate >= startOfLastWeek && inputDate < startOfCurrentWeek) {
      return `Last week, ${day}`;
    }

    // Default formatting for other dates (including this month's dates)
    return `${monthName} ${day}`;
  };

  return <span>{formatTime(time)}</span>;
};

export default GetTime;
