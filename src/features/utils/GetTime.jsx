import React from 'react';

const GetTime = ({ time }) => {
  const formatTime = (isoString) => {
    const inputDate = new Date(isoString);
    const now = new Date();

    if (isNaN(inputDate)) {
      return ''; // If the inputDate is invalid, return an empty string
    }

    // Function to format the time part (hour:minute)
    const formatTimeOnly = (date) => {
      const options = { hour: '2-digit', minute: '2-digit', hour12: false };
      return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    // Function to check if two dates are on the same day
    const isSameDay = (date1, date2) =>
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();

    inputDate.setSeconds(0, 0); // Set seconds and milliseconds to 0
    now.setSeconds(0, 0);

    // If the input date is exactly the same as the current date
    if (+inputDate === +now) {
      return 'Just now';
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    // If the input date was yesterday
    if (isSameDay(inputDate, yesterday)) {
      return `Yesterday, ${formatTimeOnly(inputDate)}`;
    }

    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // If the input date was within the past week but not yesterday
    if (inputDate > oneWeekAgo && inputDate < yesterday) {
      return 'Last week';
    }

    // If the input date is from today
    if (isSameDay(inputDate, now)) {
      return formatTimeOnly(inputDate);
    }

    // Default formatting for other dates
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    return new Intl.DateTimeFormat('en-US', options).format(inputDate);
  };

  return <span>{formatTime(time)}</span>;
};

export default GetTime;
