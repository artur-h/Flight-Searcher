const formSearch = document.querySelector('.form-search'),
  inputCitiesFrom = document.querySelector('.input__cities-from'),
  dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
  inputCitiesTo = document.querySelector('.input__cities-to'),
  dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
  inputDateDepart = document.querySelector('.input__date-depart');

const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',
  proxy = 'https://cors-anywhere.herokuapp.com/',
  API_KEY = '6008b241d2bfb45db809e626a2f672e4',
  calendar = 'http://min-prices.aviasales.ru/calendar_preload';

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
    const citiesStartsWith = [];
    const citiesIncludes = [];

    city.forEach(item => {
      const fixItem = item.name.toLowerCase();
      const inputValue = input.value.toLowerCase()

      if (fixItem.startsWith(inputValue)) {
        citiesStartsWith.push(item);
      } else if (fixItem.includes(inputValue)) {
        citiesIncludes.push(item);
      }
    });

    const byAlphabet = (a, b) => a.name > b.name ? 1 : -1;
    citiesStartsWith.sort(byAlphabet);
    citiesIncludes.sort(byAlphabet);

    const filterCity = citiesStartsWith.concat(citiesIncludes);

    filterCity.forEach(item => {
      const li = document.createElement('li');
      li.classList.add('dropdown__city');
      li.textContent = item.name;
      list.append(li);
    });
  }
};

const selectCity = (event, input, list) => {
  const target = event.target;

  if (target.tagName.toLowerCase() === 'li') {
    input.value = target.textContent;
    list.textContent = '';
  }
}

const renderCheapDay = cheapTicket => {

};

const renderCheapYear = cheapTickets => {
  cheapTickets.sort((a, b) => a.value - b.value);
  console.log(cheapTickets);
};

const renderCheap = (data, date) => {
  const cheapTicketYear = JSON.parse(data).best_prices;
  const cheapTicketDay = cheapTicketYear.filter(item => item.depart_date === date)

  renderCheapDay(cheapTicketDay);
  renderCheapYear(cheapTicketYear);
};

inputCitiesFrom.addEventListener('input', () => {
  showCity(inputCitiesFrom, dropdownCitiesFrom);
});

inputCitiesTo.addEventListener('input', () => {
  showCity(inputCitiesTo, dropdownCitiesTo);
});

dropdownCitiesFrom.addEventListener('click', event => {
  selectCity(event, inputCitiesFrom, dropdownCitiesFrom)
});

dropdownCitiesTo.addEventListener('click', event => {
  selectCity(event, inputCitiesTo, dropdownCitiesTo)
});

formSearch.addEventListener('submit', event => {
  event.preventDefault();

  const cityFrom = city.find(item => inputCitiesFrom.value === item.name);
  const cityTo = city.find(item => inputCitiesTo.value === item.name);

  const formData = {
    from: cityFrom.code,
    to: cityTo.code,
    when: inputDateDepart.value
  }

  const requestData = `?depart_date=${formData.when}&origin=${formData.from}&destination=${formData.to}&one_way=true&token=${API_KEY}`;

  getData(proxy + calendar + requestData, response => {
    renderCheap(response, formData.when);
  });
})

getData(proxy + citiesApi, data => city = JSON.parse(data).filter(item => item.name));