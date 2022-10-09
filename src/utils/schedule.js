import React from 'react';
import { dateTimes } from 'constants/DateTimes';

// Takes firebase times and maps them to object with date and priority
const transformFirebaseDateTimes = times => {
  return times.split('').map((priority, index) => ({
    priority: parseInt(priority),
    dateTime: dateTimes[index],
  }));
};

// Finds lowest priority time when both parties are available
export const getAvailableTime = (times1, times2, timezone) => {
  if (!times1 || !times2) {
    return null;
  }

  times1 = transformFirebaseDateTimes(times1);
  times2 = transformFirebaseDateTimes(times2);

  // get times AFTER valentine's day since most dates aren't available 2/14
  const afterValentinesDay = new Date('February 15, 2021 00:01 GMT-0500');
  const maxDate =
    afterValentinesDay < new Date() ? new Date() : afterValentinesDay;

  // Search through all times to find ones where both parties have indicated they are available
  // Finds the best time for both parties by prioritizing 1 and 1, then 1 and 2, finally 2 and 2
  const available = times1.reduce((currTime, newTime, index) => {
    // Checks both people are available and the date has not passed yet
    if (
      newTime.priority !== 0 &&
      times2[index].priority !== 0 &&
      maxDate < new Date(newTime.dateTime)
    ) {
      if (
        !currTime ||
        currTime.priority > newTime.priority + times2[index].priority
      ) {
        // New lower priority time found, update the returned valie
        newTime.priority += times2[index].priority;
        return newTime;
      }
    }
    return currTime;
  }, null);

  // If there is a time both people are available, returns the text to display
  if (available) {
    const date = new Date(available.dateTime);
    const dateString = date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'numeric',
      day: 'numeric',
      timeZone: 'UTC',
    });
    let timeString = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true,
      timeZone: 'UTC',
    });

    if (timeString === '4 PM') {
      timeString = 'morning';
    } else if (timeString === '7 PM') {
      timeString = 'afternoon';
    } else {
      timeString = 'evening';
    }

    return (
      <div>
        You're both free on <b>{dateString}</b> in the <b>{timeString}</b>
      </div>
    );
  } else return null;
};
