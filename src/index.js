import './index.css';

// Date format desired: Wed Aug 3rd, 2025

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
          celcius: day.temp,
          fahrenheit: day.temp * 1.8 + 32,
        },
        description: day.description,
        icon: day.icon,
      };
    });
};

// Controller
const controller = async function () {
  try {
    // 1. Render spinner
    view.renderSpinner();

    // 2. Get data from API
    const data = await getData('London');

    // 3. Display data in view
    view.displayData(data);
  } catch (error) {
    console.error(error);
    // throw error;
  }
};

// View
const view = (function () {
  const renderSpinner = function () {};

  const displayError = function () {};

  const displayData = function (data) {
    console.log(data);
  };

  // Handle form submition

  return { renderSpinner, displayData, displayError };
})();
