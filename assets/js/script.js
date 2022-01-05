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
                    break
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
    event.preventdefault();
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
    resultsContainerEl.textContent = "";

    // add container for new weather
    var currentWeatherEl = document.createElement('article');
    currentWeatherEl.id = 'current';
    currentWeatherEl.classList = "p-10";

    // create h2 with name and date

    // create paragraphs for temp wind and humidity 
    var tempEl = document.createElement('p')
    tempEl.innterHTML = 'Temp: ' + data.tempp + '<span>&#176;</span>F'

    var windEl = document.createElement('p')
    windEl.textContent = 'Wind: ' + data.wind_speed + ' MPH';
    windEl.classList = 'p-20-0-10-0';

    var humidityEl = document.createElement('p')
    humidityEl.textContent = 'Humidity: ' +data.humidity + '%'; 
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

// will create container for forecast

//function to add current date

//add weather icon

// create paragraph for temp wind humidiy and uvi


// add all the elements to current weather section

//add curent weather section to results

//load info from previous search history when page starst

loadCities();
searchFormEl.addEventListener('submit', formSubmitHandler);
previousSearchesEl.addEventListener('click',buttonClickHandler);