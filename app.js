const apiKey = '367bbb256c872aa5520fab206ea82a51';

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('City not found');
        return await response.json();
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

function formatDateTime(timestamp, timezoneOffset) {
    const localMillis = (timestamp + timezoneOffset) * 1000;
    const localDate = new Date(localMillis);
    return localDate.toLocaleString(undefined, {
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
}


function updateWeatherDisplay(data) {
    const weatherInfo = document.getElementById('weather-info');
    if (data && data.main) {
        const tempCelsius = Math.round(data.main.temp - 273.15);
        const feelsLike = Math.round(data.main.feels_like - 273.15);
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const description = data.weather[0].description;
        const icon = data.weather[0].icon;
        const name = data.name;
        const country = data.sys.country;
        const localTime = formatDateTime(data.dt, data.timezone);

        weatherInfo.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" />
        <p style="font-size: 0.8em; margin-top: -8px;">(${description})</p>
        <p><strong>${name.replace(/_/g, ' ')}, ${country}</strong></p>
        <p>${localTime}</p>
        <p><strong>Temperature:</strong> ${tempCelsius}°C</p>
        <p><strong>Feels Like:</strong> ${feelsLike}°C</p>
        <p><strong>Condition:</strong> ${description}</p>
        <p><strong>Humidity:</strong> ${humidity}%</p>
        <p><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
    `;
    
    } else {
        weatherInfo.innerHTML = `<p style="color: #ff5252;">Could not fetch weather data. Try again.</p>`;
    }
}

document.getElementById('weather-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = document.getElementById('city').value.trim();
    if (city) {
        document.getElementById('weather-info').innerHTML = '<p>Loading...</p>';
        const data = await getWeatherData(city);
        updateWeatherDisplay(data);
    } else {
        alert('Please enter a valid city name.');
    }
});
