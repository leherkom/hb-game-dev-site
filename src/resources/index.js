/**
 * Gets the current locale. Currently, there are only two languages that are distinguished by their HTML file name,
 * so the function looks at the window location for determining this.
 *
 * @returns {Intl.DateTimeFormat} The DateTimeFormat representation of the current locale
 */
function getCurrentLocale() {
  const pageName = window.location.pathname
    .split("/")
    .pop()
    .replace(".html", "");
  const localeOpts = {
    dateStyle: "long",
  };
  switch (pageName) {
    case "de":
      return new Intl.DateTimeFormat("de-DE", localeOpts);
    default:
      return new Intl.DateTimeFormat("en-GB", localeOpts);
  }
}

/**
 * Finds the nth given workday of the provided month and year.
 */
function findNthWorkday(year, month, n, workday) {
  const result = new Date(year, month, 1);
  let encounteredWorkdays = 0;
  while (encounteredWorkdays < n) {
    if (result.getDay() === workday) {
      encounteredWorkdays++;
      if (encounteredWorkdays === n) {
        return result;
      }
    }
    result.setDate(result.getDate() + 1);
  }
}

/**
 * Finds the next meeting time and returns the corresponding Date.
 *
 * @returns {Date} The Date representation of the next month's first Friday
 */
function findNextMeetingDate() {
  const now = new Date();
  const meetingWorkday = 5; // Friday

  // exceptional case due to skipped meeting
  if (
    now.getFullYear() === 2025 &&
    now.getMonth() === 7 &&
    now.getDate() < 22
  ) {
    return new Date(2025, 7, 22);
  }

  // if this month's second Friday is still upcoming, return it
  const secondFridayThisMonth = findNthWorkday(
    now.getFullYear(),
    now.getMonth(),
    2,
    meetingWorkday,
  );
  if (secondFridayThisMonth.getDate() >= now.getDate()) {
    return secondFridayThisMonth;
  }

  // if this month's fourth Friday is still upcoming, return it
  const fourthFridayThisMonth = findNthWorkday(
    now.getFullYear(),
    now.getMonth(),
    4,
    meetingWorkday,
  );
  if (fourthFridayThisMonth.getDate() >= now.getDate()) {
    return fourthFridayThisMonth;
  }

  // if both of this month's meeting have passed, return the first
  // meeting next month
  now.setMonth(now.getMonth() + 1);
  return findNthWorkday(now.getFullYear(), now.getMonth(), 2, meetingWorkday);
}

/**
 * Searches for an element with id "next-meeting" on the page and inserts the formatted date of next month's first
 * Friday.
 */
function insertNextMeetingDate() {
  const dateNode = document.getElementById("next-meeting");
  const nextMeetingDate = findNextMeetingDate();
  dateNode.textContent = getCurrentLocale().format(nextMeetingDate);
}

document.addEventListener("DOMContentLoaded", insertNextMeetingDate);
