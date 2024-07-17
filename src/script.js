document.body.onload = () => {
    getWeather('Delhi');
    loadStoredCities();
};

document.getElementById('search').addEventListener('click', () => {
    const city = document.getElementById('city').value;
    if (city) {
        getWeather(city);
        storeCity(city);
        updateCityDropdown();
    }
});

document.getElementById('selectCities').addEventListener('change', (event) => {
    const selectedCity = event.target.value;
    if (selectedCity) {
        getWeather(selectedCity);
    }
});

document.getElementById('location').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            getWeatherByCoordinates(latitude, longitude);
        }, error => {
            console.error('Error getting location:', error);
            alert('Unable to retrieve your location.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

function loadStoredCities() {
    const storedCities = JSON.parse(sessionStorage.getItem('searchedCities')) || [];
    const selectCities = document.getElementById('selectCities');
    selectCities.innerHTML = '<option value="">Select</option>';
    storedCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.innerText = city;
        selectCities.appendChild(option);
    });
}

function storeCity(city) {
    let storedCities = JSON.parse(sessionStorage.getItem('searchedCities')) || [];
    if (!storedCities.includes(city)) {
        storedCities.push(city);
        sessionStorage.setItem('searchedCities', JSON.stringify(storedCities));
    }
}

function updateCityDropdown() {
    const selectCities = document.getElementById('selectCities');
    const storedCities = JSON.parse(sessionStorage.getItem('searchedCities')) || [];
    selectCities.innerHTML = '<option value="">History</option>';
    storedCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.innerText = city;
        selectCities.appendChild(option);
    });
}

async function getWeather(defaultCity = '') {
    const searchInput = defaultCity || document.getElementById('city').value;
    const cityName = document.getElementById('city-name');
    const rainChance = document.getElementById('condition');
    const temperature = document.getElementById('temp');
    const Weatherlogo = document.getElementById('weather-logo');
    const time = document.getElementById('time');
    const Airtemperature = document.getElementById('tempthird');
    const RainChance = document.getElementById('rainchance');
    const wind = document.getElementById('wind');
    const uvindex = document.getElementById('uv');
    const apiKey = '4be35b56586146529ef173048241307';

    if (!searchInput) {
        alert("Please Enter City Name");
        return;
    }

    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${searchInput}&days=7&aqi=no&alerts=no`);
        const data = await response.json();
        console.log(data);

        if (!data.location) {
            alert("Please Enter Correct City Name");
            return;
        }

        // Update current weather information if elements exist
        if (cityName) cityName.innerText = data.location.name;
        if (rainChance) rainChance.innerHTML = data.current.condition.text;
        if (temperature) temperature.innerText = `${data.current.temp_c}°C`;
        if (Weatherlogo) Weatherlogo.src = `https:${data.current.condition.icon}`;
        if (time) time.innerText = data.location.localtime;
        if (Airtemperature) Airtemperature.innerText = `${data.current.feelslike_c}°C`;
        if (RainChance) RainChance.innerText = `${data.current.precip_mm} mm`;
        if (wind) wind.innerText = `${data.current.wind_kph} km/h`;
        if (uvindex) uvindex.innerText = `${data.current.uv}`;

        // Update hourly forecast
        updateHourlyForecast(data);

        // Update upcoming 7 days forecast
        upcomingForecast(data);

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

async function getWeatherByCoordinates(latitude, longitude) {
    const cityName = document.getElementById('city-name');
    const rainChance = document.getElementById('condition');
    const temperature = document.getElementById('temp');
    const Weatherlogo = document.getElementById('weather-logo');
    const time = document.getElementById('time');
    const Airtemperature = document.getElementById('tempthird');
    const RainChance = document.getElementById('rainchance');
    const wind = document.getElementById('wind');
    const uvindex = document.getElementById('uv');
    const apiKey = '4be35b56586146529ef173048241307';

    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=7&aqi=no&alerts=no`);
        const data = await response.json();
        console.log(data);

        if (!data.location) {
            alert("Unable to retrieve weather data for your location.");
            return;
        }

        // Update current weather information if elements exist
        if (cityName) cityName.innerText = data.location.name;
        if (rainChance) rainChance.innerHTML = data.current.condition.text;
        if (temperature) temperature.innerText = `${data.current.temp_c}°C`;
        if (Weatherlogo) Weatherlogo.src = `https:${data.current.condition.icon}`;
        if (time) time.innerText = data.location.localtime;
        if (Airtemperature) Airtemperature.innerText = `${data.current.feelslike_c}°C`;
        if (RainChance) RainChance.innerText = `${data.current.precip_mm} mm`;
        if (wind) wind.innerText = `${data.current.wind_kph} km/h`;
        if (uvindex) uvindex.innerText = `${data.current.uv}`;

        // Update hourly forecast
        updateHourlyForecast(data);

        // Update upcoming 7 days forecast
        upcomingForecast(data);

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function updateHourlyForecast(data) {
    // Time intervals to be updated
    const timeIntervals = [
        { time: '06:00', element: document.querySelectorAll('.time')[0] },
        { time: '09:00', element: document.querySelectorAll('.time')[1] },
        { time: '12:00', element: document.querySelectorAll('.time')[2] },
        { time: '15:00', element: document.querySelectorAll('.time')[3] },
        { time: '18:00', element: document.querySelectorAll('.time')[4] },
        { time: '21:00', element: document.querySelectorAll('.time')[5] },
    ];

    // Clear previous forecast data
    document.querySelectorAll('.logo').forEach(logo => logo.innerHTML = '');
    document.querySelectorAll('.Sectemp').forEach(temp => temp.innerText = '');

    // Hourly forecast information for the current day
    const hourlyForecast = data.forecast.forecastday[0].hour;

    hourlyForecast.forEach(hour => {
        const forecastTime = new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

        timeIntervals.forEach(interval => {
            if (forecastTime.startsWith(interval.time)) {
                const parentElement = interval.element.parentElement;
                if (parentElement) {
                    const logoElement = parentElement.querySelector('.logo');
                    const tempElement = parentElement.querySelector('.Sectemp');
                    if (logoElement) logoElement.innerHTML = `<img src="https:${hour.condition.icon}" alt="${hour.condition.text}">`;
                    if (tempElement) tempElement.innerText = `${hour.temp_c}°C`;
                }
            }
        });
    });
}

function upcomingForecast(data) {
    // Upcoming days forecast information
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const mainForecastContainer = document.querySelector('.mainforecast');

    // Clear previous forecast data
    mainForecastContainer.innerHTML = '';

    // Update upcoming 7 days forecast
    data.forecast.forecastday.slice(1, 8).forEach((day, index) => {
        const date = new Date(day.date);
        const dayOfWeek = daysOfWeek[date.getDay()];
        const conditionIcon = day.day.condition.icon;
        const conditionText = day.day.condition.text;
        const highTemp = day.day.maxtemp_c;
        const lowTemp = day.day.mintemp_c;

        // Create HTML template for each day forecast
        const forecastHTML = `
            <div class="flex justify-between gap-2 items-center">
                <p class="days">${dayOfWeek}</p>
                <div class="flex gap-2 justify-center items-center">
                    <p class="upcominglogo"><img src="https:${conditionIcon}" class="w-[50px]" alt="${conditionText}"></p>
                    <p class="status">${conditionText}</p>
                </div>
                <p class="hightemp">${highTemp}<span class="lowtemp">/${lowTemp}</span></p>
            </div>
        `;

        // Append forecast HTML to main forecast container
        mainForecastContainer.innerHTML += forecastHTML;
    });

    function options(){
        const weatheropt=document.getElementById('weathericon');
        const city=document.getElementById('citiesicon');
        const settings=document.getElementById('settings');

        weatheropt.addEventListener('click',()=>{
            window.location.href="index.html"
        })

        city.addEventListener('click',()=>{
            alert('Coming Soon')
        })

        settings.addEventListener('click',()=>{
            alert('Coming Soon')
        })
    }

    options();

}
