import './index.css';

// Date format desired: Wed Aug 3rd, 2025

// Tailwind utility classes for moods
const day_clear_sunny = 'bg-linear-to-br from-blue-400 to-orange-300';
const rainy_stormy = 'bg-linear-to-br from-slate-700 to-blue-900';
const cloudy_overcast = 'bg-linear-to-br from-indigo-400 to-gray-400';
const night = 'bg-linear-to-br from-[#2C3E50] to-[#000000]';

// Random data
const condition =
  'Max 2 lines of text, using text-xs for the long descriptions.';

// Model
const apiKey = 'ARAR7KY7GJXREMTTPBJA9KR54';
const baseUrl =
  'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';

const getData = async function (query) {
  try {
    const url = `${baseUrl}${query}?key=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) throw new Error('Bad request! Location not found.');

    const data = await response.json();

    // Return processed data
    return processData(data.days);
  } catch (error) {
    throw error;
  }
};

const processData = function (days) {
  return days
    .filter((_, idx) => idx < 10)
    .map(day => {
      return {
        date: day.datetime,
        temp: {
          celcius: Math.round(day.temp),
          fahrenheit: Math.round(day.temp * 1.8 + 32),
        },
        description: day.description,
        icon: day.icon,
      };
    });
};

// Controller
const controller = async function (query) {
  try {
    // 1. Render spinner
    view.renderSpinner();

    // 2. Get data from API
    const data = await getData(query);

    // 3. Display data in view
    view.displayData(data);
  } catch (error) {
    console.error(error);
    // throw error;
  }
};

// View
const view = (function () {
  const formEl = document.querySelector('#search-form');
  const inputEl = document.querySelector('#city-input');

  const renderSpinner = function () {};

  const displayError = function () {};

  const displayData = function (data) {
    console.log(data);
  };

  // Handle form submition
  formEl.addEventListener('click', function (e) {
    e.preventDefault();

    const query = inputEl.value.trim();
    if (!query) return;

    // 1. Blur the input to hide mobile keyboard
    inputEl.blur();

    // 2. Call search logic
  });

  return { renderSpinner, displayData, displayError };
})();
