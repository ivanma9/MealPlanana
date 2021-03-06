import moment from 'moment';

// one day off so 'tu' actually menas Monday
const daysOfWeekDict = {
  0: 'su', // 'mo',
  1: 'mo', // 'tu',
  2: 'tu', // 'we',
  3: 'we', // 'th',
  4: 'th', // 'fr',
  5: 'fr', // 'sa',
  6: 'sa', // 'su',
};

const daysOfWeek = (dow) => {
  const byweekdayArray = [];
  for (let i = 0; i < 7; i++) {
    if (dow[i]) {
      byweekdayArray.push(daysOfWeekDict[i]);
    }
  }
  return byweekdayArray;
};

const timeDiff = (d1, d2) => {
  const diff = new Date(d2) - new Date(d1);
  if (diff > 60e3) {
    return (
      Math.floor(diff / 60e3)
    );
  }
  return (
    Math.floor(diff / 1e3)
  );
};

const rrule = (meal) => {
  const rruleArray = {};

  rruleArray.freq = meal.freqType;
  rruleArray.interval = meal.interval;
  if (meal.freqType == "WEEKLY") {
    rruleArray.byweekday = daysOfWeek(meal.days);
  }
  rruleArray.dtstart = meal.start_date;
  rruleArray.until = meal.end_date;
  // rruleArray.tzid = "America/Anchorage";

  return rruleArray;
};

const convMeal = (meal) => {
  const mealDict = {};
  mealDict.title = meal.title;
  mealDict.rrule = rrule(meal);
  // mealDict.startTime = new Date(meal.start_date);
  // mealDict.endTime = moment(meal.start_date).add(meal.duration+100, 'm').toDate();
  mealDict.duration = { minutes: meal.duration };
  mealDict.color = meal.color;
  mealDict.recipes = meal.recipes;

  return mealDict;
};

export function parseMeals(m) {
  const mealsArray = m.map(convMeal);
  return mealsArray;
  // timeDiff(meal.start_date, meal.end_date)
  // + ' ' +
  // meal.title
}
