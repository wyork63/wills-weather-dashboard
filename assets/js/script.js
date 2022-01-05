var searchFormEl = document.querySelector('#search-form');
var previousSearchesEl = document.querySelector('#city-buttons');
var cityInputEl = document.querySelector('#city-input');
var resultsContainerEl = document.querySelector('#results');

// function where if a search has been done in this browser 

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
}