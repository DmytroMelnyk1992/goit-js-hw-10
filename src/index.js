import './css/styles.css';

import Notiflix from 'notiflix';
var debounce = require('lodash.debounce');
import { fetchCountries } from './js/fetchCountries';
const DEBOUNCE_DELAY = 300;

// writing refs

const refs = {
  input: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

// cleaning <div> and <ul> fields (sanation)
const clearElement = element => (element.innerHTML = ' ');

const countryName = () => {
  const inputValue = refs.input.value.trim();
  if (!inputValue) {
    clearElement(refs.countryInfo);
    clearElement(refs.countryList);
    return;
  }
  //  processing and logging Promise result

  fetchCountries(inputValue).then(answerThen).catch(answerCatch);
  console.log(fetchCountries(inputValue));
};

//  response in case if country/ies exist/s
const answerThen = data => {
  console.log(data);
  if (data.length === 1) {
    //  logging country info
    clearElement(refs.countryInfo);
    clearElement(refs.countryList);
    refs.countryInfo.insertAdjacentHTML('afterbegin', infoCountry(data));
  } else if (data.length < 10) {
    //  resume all countries

    clearElement(refs.countryInfo);
    clearElement(refs.countryList);
    refs.countryList.insertAdjacentHTML('afterbegin', createCountries(data));
  } else {
    //  alert if more than 10 countries

    clearElement(refs.countryInfo);
    clearElement(refs.countryList);
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }
};

//  response if doesnt exist or incorrect input
const answerCatch = () => {
  clearElement(refs.countryInfo);
  clearElement(refs.countryList);
  Notiflix.Notify.failure('Oops, there is no country with that name');
};
//  country shortlist
const createCountries = data => {
  const lists = data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}"><h2>${name.official}</h2></li>`
    )
    .join(' ');
  return lists;
};

//  detailed country information foo
const infoCountry = data => {
  const info = data.map(
    ({ name, capital, population, flags, languages }) =>
      `<img src="${flags.png}" ${name.official}><h1>${name.official}</h1>
        <p> capital: ${capital} </p>
        <p> population: ${population} </p>
        <p> languages: ${Object.values(languages)} </p>`
  );
  return info;
};
//  evt listener input
refs.input.addEventListener('input', debounce(countryName, DEBOUNCE_DELAY));
