import React from 'react';

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

const convMeal = (meal) => {
  
} 

export function parseMeals(m) {
  return m.map((meal) => (
    meal
    // timeDiff(meal.start_date, meal.end_date)
    // + ' ' +
    // meal.title
  ));
}

export function jsony(m) {
  return (m[0].title);
}
