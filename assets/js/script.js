var searchFormEl = document.querySelector('#search-form');
var previousSearchesEl = document.querySelector('#city-buttons');
var cityInputEl = document.querySelector('#city-input');
var resultsContainerEl = document.querySelector('#results');

// function where if a search has been done in this browser 
var loadCities = function () {
    var lastSearch = localStorage.getItem('last-search');
    if (lastSearch) {
        var citiesArray = localStorage.getItem('citiesArray');
        if (citiesArray) {
            citiesArray = JSON.parse(citiesArray);
            var existingButton;
            for (var i = 0; i < citiesArray.length; i++) {
                if (citiesArray[i] === lastSearch) {
                    existingButton = citiesArray[i];
                    break;
                }
            }
            if (!existingButton) {
                citiesArray.push(lastSearch)
            }
            // if it doesnt exist in local storage create array
        } else {
            citiesArray = [];
            citiesArray.push(lastSearch)
        }
        localStorage.setItem('citiesArray', JSON.stringify(citiesArray));
        // clear previous search buttons 
        previousSearchesEl.textContent = '';
        // add buttons based on array
        for (var i = 0; i < citiesArray.length; i++) {
            var cityBtn = document.createElement('button');
            cityBtn.textContent = citiesArray [i];
            cityBtn.classList = 'btn previous-search';

            previousSearchesEl.appendChild(cityBtn);
        }
    }
}
// then pull city from city array 

// and display it into buttons based on array

// if last search is not an existing button then add it to array 

// when search button is clicked - it finds input for that location
var formSubmitHandler = function(event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    if (city) {
        getLatLon(city);
        cityInputEl.value = '';
    }
    else {
        alert('Please enter the name of a city');
    }
};

// add function when an old search button is clicked

var buttonClickHandler = function(event) {
    if (event.target.type === 'submit') {
        var city = event.target.textContent;
        getLatLon(city);
        cityInputEl.textContent = '';
    }
}


// get latitude and longitude of the city and pass it into the argument for getWeather() 
var getLatLon = function(city) {
    // apikey from weather site
    var apiKey = "ff8f64c1c4ae73a70e4b2c346addc528";
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=' + apiKey;
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    localStorage.setItem('last-search', data.name)
                    loadCities();
                    var city = data.name;
                    var lat = data.coord.lat;
                    var lon = data.coord.lon;
                    getWeather (lat, lon, city);
                });
            } else {
                alert('Error: No city Found');
            }
        })
        .catch(function(error) {
            alert('Unable to Connect')
        });
};

// get weather from the current day and 5 day forecast 
var getWeather = function(lat, lon, city) {
    var apiKey = 'ff8f64c1c4ae73a70e4b2c346addc528';
    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly,alerts&units=imperial&appid=' + apiKey;
    fetch(apiUrl)
        .then(function(response) {
            response.json().then(function(data){
                var current = data.current;
                var daily = data.daily;
                displayCurrentWeather(current,city)
                displayForecast(daily);
            });
        });
};

var displayCurrentWeather = function(data, city) {
    console.log(data);
    // clear results
    resultsContainerEl.textContent = '';

    // add container for new weather
    var currentWeatherEl = document.createElement('article');
    currentWeatherEl.id = 'current';
    currentWeatherEl.classList = "p-10";

    // create h2 with name and date
    var h2El = document.createElement('h2');
    h2El.id = 'city-name';
    var today = new Date();
    // function to create the date (+1 becasue get month pulls from array)
    var date = (today.getMonth() + 1) + '/' + 
        today.getDate() + '/' + 
        today.getFullYear();
    h2El.textContent = city + ' (' + date + ')  ';

    // Create weather icon to the right of h2
    var icon = data.weather[0].icon;
    var imgEl = document.createElement('img')
    imgEl.classList = 'absolute-position';
    imgEl.setAttribute('src', 'http://openweathermap.org/img/w/' + icon + '.png')


    // create paragraphs for temp wind and humidity 
    var tempEl = document.createElement('p')
    tempEl.innerHTML = 'Temp: ' + data.temp + '<span>&#176;</span>F';
    tempEl.classList = 'p-20-0-10-0';

    var windEl = document.createElement('p')
    windEl.textContent = 'Wind: ' + data.wind_speed + ' MPH';
    windEl.classList = 'p-10-0';

    var humidityEl = document.createElement('p')
    humidityEl.textContent = 'Humidity: ' + data.humidity + '%'; 
    humidityEl.classList = 'P-10-0';
    
    var uvIndexEl = document.createElement('p')
    uvIndexEl.innerHTML = "UV Index: <span id='uvi'>" + data.uvi + '</span';
    uvIndexEl.classList = 'p-10-0';

    // append these to current weather scetion
    currentWeatherEl.appendChild(h2El);
    currentWeatherEl.appendChild(imgEl);
    currentWeatherEl.appendChild(tempEl);
    currentWeatherEl.appendChild(windEl);
    currentWeatherEl.appendChild(humidityEl);
    currentWeatherEl.appendChild(uvIndexEl);

    // append current weather section to results 
    resultsContainerEl.appendChild(currentWeatherEl);
}

// displat forecast function 
var displayForecast = function(data) {
    console.log(data);
    // will create container for forecast
    var forecastEl = document.createElement('div');

    var h3El = document.createElement('h3');
    h3El.textContent = '5-Day Forecast';
    h3El.classList = 'p-20-0-10-0';
    
    var daysContainerEl = document.createElement('div');
    daysContainerEl.classList = 'row space-between'

    for (var i = 1; i < 6; i++) {
        var singleDayEl = document.createElement('article');
        singleDayEl.classList = 'col-5 col-xl-2 p-10 dark-bg mb-20';

    //function to add current date
    var date = new Date(data[i].dt * 1000);
    var fullDate = (date.getMonth() + 1) + '/' +
        date.getDate() + '/' +
        date.getFullYear();
    var h4El = document.createElement('h4');
    h4El.textContent = fullDate;
    h4El.classList = 'white-font';
    
    var icon = data[i].weather[0].icon;
    var imgEl = document.createElement('img');
    imgEl.setAttribute('src', 'http://openweathermap.org/img/w/' + icon + '.png');
    
    // create paragraph for temp wind humidiy and uvi
    var tempEl = document.createElement('p');
    tempEl.innerHTML = 'Temp: ' + data[i].temp.day + ' <span>&#176;</span>F';
    tempEl.classList = 'p-10-0 white-font lg-font-size';

    var windEl = document.createElement('p')
    windEl.textContent = 'Wind: ' + data[i].wind_speed + ' MPH';
    windEl.classList = 'p-10-0 white-font lg-font-size'

    var humidityEl = document.createElement('p')
    humidityEl.textContent = 'Humidity: ' + data[i].humidity + ' %';
    humidityEl.classList = 'P-10-0 white-font lg-font-size';

    singleDayEl.appendChild(h4El);
    singleDayEl.appendChild(imgEl);
    singleDayEl.appendChild(tempEl);
    singleDayEl.appendChild(windEl);
    singleDayEl.appendChild(humidityEl);

    daysContainerEl.appendChild(singleDayEl);
    }

// add all the elements to current weather section
forecastEl.appendChild(h3El);
forecastEl.appendChild(daysContainerEl);
//add curent weather section to results
resultsContainerEl.appendChild(forecastEl);
}

//load info from previous search history when page starst

loadCities();
searchFormEl.addEventListener('submit', formSubmitHandler);
previousSearchesEl.addEventListener('click',buttonClickHandler);