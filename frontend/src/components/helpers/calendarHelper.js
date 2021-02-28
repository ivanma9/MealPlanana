import moment from 'moment';


const daysOfWeek = (dow) => {
  for (let i = 0; i < 7; i++) {
    dow = i;
  }
};

const timeDiff = (d1, d2) => {
  let diff = new Date(d2) - new Date(d1);
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
  let rruleArray = {};
  console.log(meal.freqType);
  rruleArray.freq = "daily"; //meal.freqType
  rruleArray.interval = meal.interval;
  //rruleArray.byweekday = "";
  rruleArray.dtstart = meal.start_date;
  rruleArray.until = meal.end_date;
  // mealDict.startTime = new Date(meal.start_date);
  // mealDict.endTime = moment(meal.start_date).add(meal.duration, 'm').toDate();


  return rruleArray;
};

const convMeal = (meal) => {
  let mealDict = {};
  mealDict.title = meal.title;
  mealDict.rrule = rrule(meal);
  
  return mealDict;
};

export function parseMeals(m) {
  let mealsArray = m.map(convMeal);
  return mealsArray;
    // timeDiff(meal.start_date, meal.end_date)
    // + ' ' +
    // meal.title
}

export function jsony(m) {
  return m[0]["start_date"];
}
