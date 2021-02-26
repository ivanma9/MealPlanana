import React, { Component, useState } from 'react';

const daysOfWeek = (dow) => {
  for (let i = 0; i < 7; i++) {

  }
};

export function parseMeals(m) {
  return m.map((meal) => (
    <li key={meal.interval}>
      {' '}
      {meal.start_date}
      {' '}
      {meal.title}
    </li>
  ));
}
