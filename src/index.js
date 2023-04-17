import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import getRefs from './js/get-refs';

const DEBOUNCE_DELAY = 300;

const refs = getRefs();

refs.searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
  evt.preventDefault();

  const inputValue = evt.target.value.trim();

  if (inputValue === '') {
    cleanMarkUp();
    return;
  }

  fetchCountries(inputValue)
    .then(countries => {
      cleanMarkUp();

      if (countries.length > 10) {
        onNotice();
      } else if (countries.length <= 10 && countries.length >= 2) {
        const markupListCountries = countries.reduce(
          (list, country) => list + createMarkupCountryList(country),
          ''
        );

        updateList(markupListCountries);

        /**
         * добавление разметки в html методом insertAdjacentHTML.
         *
         * countryList.insertAdjacentHTML('beforeend', createMarkupCountryList(countries));
         */
      } else {
        const markupCardCountry = countries.reduce(
          (list, country) => list + createMarkupCountryCard(country),
          ''
        );

        updateCard(markupCardCountry);

        /**
         * добавление разметки в html методом insertAdjacentHTML.
         *
         * countryInfo.insertAdjacentHTML('beforeend', createMarkupCountryCard(countries));
         */
      }
    })
    .catch(error => {
      if (error.message === '404') {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        cleanMarkUp();
        resetInpyt();
      }
      console.log(error);
    });

  // onError());
}

function createMarkupCountryList({ name, flags }) {
  return `
        <li class="country-list__item">
            <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 25px height = 25px>
            <h2 class="country-list__name">${name.official}</h2>
        </li>
        `;
}

function createMarkupCountryCard({
  name,
  capital,
  population,
  flags,
  languages,
}) {
  return `
            <h1 class="country-info-title">${name.official}</h1>            
        <ul class="country-info-list">
        <li class="country-info-item"><img class="country-info-flag"src="${
          flags.png
        }" alt="${name.official}" width="200" height="100"></li>
            <li class="country-info-item"><span class="country-info-text">Capital:</span> ${capital}</li>
            <li class="country-info-item"><span class="country-info-text">Population:</span> ${population}</li>
            <li class="country-info-item"><span class="country-info-text">Languages:</span> ${Object.values(
              languages
            )}</li>
        </ul>
        `;
}

function updateList(markupListCountries) {
  refs.countryList.innerHTML = markupListCountries;
}

function updateCard(markupCardCountry) {
  refs.countryInfo.innerHTML = markupCardCountry;
}

/**
     ** перебор результата запроса через map\join и создание разметки
    
    function createMarkupCountryList(countries) {
    const listMarkup = countries
        .map(({ name, flags }) => {
            return `
        <li class="country-list__item">
            <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 25px height = 25px>
            <h2 class="country-list__name">${name.official}</h2>
        </li>
        `
        })
        .join('');
    return listMarkup;
}

function createMarkupCountryCard(countries) {
    const infoMarkup = countries
        .map(({ name, capital, population, flags, languages }) => {
            return `
            <h1>${name.official}</h1>            
        <ul class="country-info__list">
        <li class="country-info__item"><img src="${flags.png}" alt="${name.official}" width="200" height="100"></li>
            <li class="country-info__item"><span class="country-info__item--weight">Capital:</span> ${capital}</li>
            <li class="country-info__item"><span class="country-info__item--weight">Population:</span> ${population}</li>
            <li class="country-info__item"><span class="country-info__item--weight">Languages:</span> ${Object.values(languages)}</li>
        </ul>
        `
        })
        .join('');
    return infoMarkup;
}
     */

function cleanMarkUp() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function resetInpyt() {
  refs.searchInput.value = '';
}

// function onError() {
//   Notiflix.Notify.failure('Oops, there is no country with that name');
// }

function onNotice() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}
