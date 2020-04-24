const formSearch = document.querySelector('.form-search'),
  inputCitiesFrom = document.querySelector('.input__cities-from'),
  dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
  inputCitiesTo = document.querySelector('.input__cities-to'),
  dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
  inputDateDepart = document.querySelector('.input__date-depart'),
  buttonSearch = document.querySelector('.button__search');

const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',
  proxy = 'https://cors-anywhere.herokuapp.com/',
  API_KEY = '6008b241d2bfb45db809e626a2f672e4',
  calendar = `http://min-prices.aviasales.ru/calendar_preload`;

let city = [];

const getData = (url, callback) => {
  const request = new XMLHttpRequest();

  request.open('GET', url);

  request.addEventListener('readystatechange', () => {
    if (request.readyState !== 4) return;

    if (request.status === 200) {
      callback(request.response);
    } else {
      console.error(request.status);
    }
  });

  request.send();
}

const showCity = (input, list) => {
  list.textContent = '';

  if (input.value !== '') {
    const filterCity = city.filter(item => {
      const fixItem = item.name.toLowerCase();
      return fixItem.includes(input.value.toLowerCase());
    });

    filterCity.forEach(item => {
      const li = document.createElement('li');
      li.classList.add('dropdown__city');
      li.textContent = item.name;
      list.append(li);
    });
  }
};

const handlerCity = (event, input, list) => {
  const target = event.target;

  if (target.tagName.toLowerCase() === 'li') {
    input.value = target.textContent;
    list.textContent = '';
  }
}

inputCitiesFrom.addEventListener('input', () => {
  showCity(inputCitiesFrom, dropdownCitiesFrom);
});

inputCitiesTo.addEventListener('input', () => {
  showCity(inputCitiesTo, dropdownCitiesTo);
});

dropdownCitiesFrom.addEventListener('click', event => {
  handlerCity(event, inputCitiesFrom, dropdownCitiesFrom)
});

dropdownCitiesTo.addEventListener('click', event => {
  handlerCity(event, inputCitiesTo, dropdownCitiesTo)
});

getData(proxy + citiesApi, data => city = JSON.parse(data).filter(item => item.name));

const getTickets = event => {
  event.preventDefault();

  const origin = city.find(item => item.name === inputCitiesFrom.value).code,
    destination = city.find(item => item.name === inputCitiesTo.value).code,
    date = inputDateDepart.value,
    url = `${calendar}?origin=${origin}&destination=${destination}&depart_date=${date}&one_way=false&token=${API_KEY}`;

  getData(url, data => console.log(JSON.parse(data).best_prices.find(item => item.depart_date === date)));
}

buttonSearch.addEventListener('click', getTickets);