import './index.css';

// Date format desired: Wed Aug 3rd, 2025

// Tailwind utility classes for moods
const day_clear_sunny = 'bg-linear-to-br from-blue-400 to-orange-300';
const rainy_stormy = 'bg-linear-to-br from-slate-700 to-blue-900';
const cloudy_overcast = 'bg-linear-to-br from-indigo-400 to-gray-400';
const night = 'bg-linear-to-br from-[#2C3E50] to-[#000000]';

// Configuration ‼️
const apiKey = 'ARAR7KY7GJXREMTTPBJA9KR54';
const baseUrl =
  'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';

// Model ‼️
let state;

const getData = async function (query) {
  try {
    const url = `${baseUrl}${query}?key=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) throw new Error('Location not found');

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
        date: new Date(day.datetime),
        temp: {
          celsius: Math.round(day.temp),
          fahrenheit: Math.round(day.temp * 1.8 + 32),
        },
        description: day.description,
        icon: day.icon,
        id: crypto.randomUUID(),
      };
    });
};

const getWeatherCardObj = function (weatherCardId) {
  // Find card from state
  const weatherCardObj = state.find(card => card.id === weatherCardId);

  // Return card object
  return weatherCardObj;
};

// Controller ‼️
const controlSearch = async function (query) {
  try {
    // 1. Render spinner
    view.renderSpinner();

    // 2. Get data from API
    const data = await getData(query);

    // 3. Update state
    state = data;

    // 4. Display data in view
    view.displayData(state);
  } catch (error) {
    view.displayError(error.message);
  }
};

const controlToggTemDeg = function (weatherCardId) {
  // 1. Get weather card object from state
  const cardObj = getWeatherCardObj(weatherCardId);

  // 2. Return the weather card object
  return cardObj;
};

// View ‼️
const view = (function () {
  const formEl = document.querySelector('#search-form');
  const inputEl = document.querySelector('#city-input');
  const parentEl = document.querySelector('.weather-gallery');
  const mainEl = document.querySelector('.main');

  // Dynamically style the UI base on user's current time (day/night)
  const init = function () {
    const timeNow = new Date().getHours();

    // Style the UI background to day time
    const styleDayTime = function () {
      mainEl.classList.add('bg-linear-to-br', 'from-blue-400', 'to-orange-300');
    };

    const styleNightTime = function () {
      mainEl.classList.add('bg-linear-to-br', 'from-[#2C3E50]', 'to-[#000000]');
    };

    if (timeNow < 19 && timeNow > 6) {
      styleDayTime();
    } else {
      styleNightTime();
    }
  };
  init();

  const renderSpinner = function () {
    const markup = `
      <div class="flex flex-col items-center justify-center space-y-4">
        <div class="relative h-20 w-20">
          <div
            class="absolute inset-4 animate-pulse rounded-full bg-linear-to-tr from-yellow-400 to-orange-500 shadow-[0_0_20px_rgba(250,204,21,0.6)]"
          ></div>
          <div
            class="animate-spin-slow absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-300 border-b-yellow-300"
          ></div>
          <div
            class="animate-spin-reverse absolute inset-2 rounded-full border-4 border-transparent border-r-orange-400 border-l-orange-400"
          ></div>
        </div>
        <p
          class="animate-pulse text-xs font-medium tracking-widest text-white uppercase"
        >
          Retrieving Skies...
        </p>
      </div>
    `;

    clear();
    parentEl.classList.add('justify-center');
    parentEl.insertAdjacentHTML('afterbegin', markup);
  };

  const clear = function () {
    parentEl.innerHTML = '';
  };

  const displayError = function (errMessage) {
    const markup = `
      <p>${errMessage}.</p>
    `;

    clear();
    parentEl.insertAdjacentHTML('afterbegin', markup);
  };

  const generateMarkup = function (data) {
    return data
      .map(datum => {
        return `
        <div
          class="weather-card group relative flex h-[450px] w-[280px] shrink-0 snap-center flex-col items-center justify-between overflow-hidden rounded-4xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl"
          data-id="${datum.id}"
        >
          <div
            class="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-3xl transition-all duration-500 group-hover:bg-white/20"
          ></div>
          <div class="text-center">
            <h3 class="text-xl font-bold tracking-tight text-white/90">
              ${helpers.dateFormatter.getDay(datum.date)}
            </h3>
            <p class="text-sm font-medium text-white/60">${helpers.dateFormatter.getMonth(datum.date)} ${datum.date.getDate()}, ${datum.date.getFullYear()}</p>
          </div>
          <div class="w-full text-center">
            <div class="flex items-start justify-center">
              <span class="temp-value text-7xl font-black tracking-tighter text-white"
                >${datum.temp.celsius}</span
              >
              <span class="temp-unit mt-2 text-3xl font-light text-white">°C</span>
            </div>
            <div
              class="mt-4 rounded-2xl border border-white/5 bg-black/10 px-4 py-2"
            >
              <p class="text-xs leading-relaxed font-medium text-white/90">
               ${datum.description}
              </p>
            </div>
          </div>
          <button
            class="toggle-temp-btn mt-5 w-full rounded-2xl border border-white/10 bg-white/20 py-4 text-xs font-bold tracking-widest text-white uppercase backdrop-blur-md transition-all hover:bg-white/30 active:scale-95"
          >
            Switch to Fahrenheit
          </button>
        </div>
      `;
      })
      .join('');
  };

  const displayData = function (data) {
    const markup = generateMarkup(data);

    clear();
    parentEl.classList.remove('justify-center');
    parentEl.insertAdjacentHTML('afterbegin', markup);
  };

  // Handle form submition
  formEl.addEventListener('submit', function (e) {
    e.preventDefault();

    const query = inputEl.value.trim();
    if (!query) return;

    // 1. Blur the input to hide mobile keyboard
    inputEl.blur();

    // 2. Call search logic
    controlSearch(query);
  });

  const toggTempDeg = function (weatherCard, weatherCardObj) {
    const tempValueEl = weatherCard.querySelector('.temp-value');
    const tempUnitEl = weatherCard.querySelector('.temp-unit');

    // Toggle Temperature Value
    tempValueEl.textContent =
      +tempValueEl.textContent === weatherCardObj.temp.celsius
        ? weatherCardObj.temp.fahrenheit
        : weatherCardObj.temp.celsius;

    // Toggle Temperature Unit
    tempUnitEl.textContent = tempUnitEl.textContent === '°C' ? '°F' : '°C';
  };

  const addHanlderToggTemDeg = function (handler) {
    parentEl.addEventListener('click', function (e) {
      if (!e.target.classList.contains('toggle-temp-btn')) return;

      const toggTempBtn = e.target;
      const weatherCard = toggTempBtn.closest('.weather-card');

      const weatherCardId = weatherCard.dataset.id;
      const weatherCardObj = handler(weatherCardId);

      // Toggle Temperature Degree in view
      toggTempDeg(weatherCard, weatherCardObj);
    });
  };

  return { renderSpinner, displayData, displayError, addHanlderToggTemDeg };
})();

// Helper Functions ‼️
const helpers = (function () {
  const dateFormatter = (function () {
    const getDay = function (dateObj) {
      switch (dateObj.getDay()) {
        case 0:
          return 'Sunday';

        case 1:
          return 'Monday';

        case 2:
          return 'Tuesday';

        case 3:
          return 'Wednessday';

        case 4:
          return 'Thursday';

        case 5:
          return 'Friday';

        case 6:
          return 'Saturday';
      }
    };

    const getMonth = function (dateObj) {
      switch (dateObj.getMonth()) {
        case 0:
          return 'Jan';
        case 1:
          return 'Feb';
        case 2:
          return 'Mar';
        case 3:
          return 'Apr';
        case 4:
          return 'May';
        case 5:
          return 'Jun';
        case 6:
          return 'Jul';
        case 7:
          return 'Aug';
        case 8:
          return 'Sept';
        case 9:
          return 'Oct';
        case 10:
          return 'Nov';
        case 11:
          return 'Dec';
      }
    };
    return { getDay, getMonth };
  })();

  return { dateFormatter };
})();

// Event Hanlers
const init = function () {
  view.addHanlderToggTemDeg(controlToggTemDeg);
};
init();
