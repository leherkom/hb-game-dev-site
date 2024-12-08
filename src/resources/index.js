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
 * Finds the first Friday of the specified month
 *
 * @param {number} year
 * @param {number} monthIndex
 * @returns {Date}
 */
function findFirstFriday(year, monthIndex) {
  const targetMonth = new Date(year, monthIndex, 1);
  while (targetMonth.getDay() !== 5) {
    if (isNaN(targetMonth.getDay())) {
      // shouldn't happen; but bail out in case the Date objects becomes malformed
      break;
    }
    targetMonth.setDate(targetMonth.getDate() + 1);
  }
  return targetMonth;
}

/**
 * Finds the next meeting time and returns the corresponding Date.
 *
 * @returns {Date} The Date representation of the next month's first Friday
 */
function findNextMeetingDate() {
  const now = new Date();

  // get this month's meeting time if it hasn't occurred yet
  const thisMonthsMeeting = findFirstFriday(now.getFullYear(), now.getMonth());
  if (thisMonthsMeeting.getDate() >= now.getDate()) {
    return thisMonthsMeeting;
  }

  // else, find next month's meeting
  now.setMonth(now.getMonth() + 1);
  return findFirstFriday(now.getFullYear(), now.getMonth());
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
