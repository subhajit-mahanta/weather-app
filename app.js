const apiKey = '367bbb256c872aa5520fab206ea82a51';

async function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('City not found');
    return await response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

function updateWeatherDisplay(data) {
  const weatherInfo = document.getElementById('weather-info');
  if (!data) {
    weatherInfo.innerHTML = `<p style="color: #ff6b6b;">Could not fetch weather data. Please try again.</p>`;
    weatherInfo.classList.remove('hidden');
    return;
  }

  const {
    name,
    sys: { country, sunrise, sunset },
    weather,
    main: { temp, feels_like, humidity, pressure },
    wind: { speed, deg, gust },
    visibility
  } = data;

  const icon = weather[0].icon;
  const desc = weather[0].description;

  const sunriseTime = new Date(sunrise * 1000).toLocaleTimeString();
  const sunsetTime = new Date(sunset * 1000).toLocaleTimeString();
  const tempC = Math.round(temp - 273.15);
  const feelsC = Math.round(feels_like - 273.15);

  weatherInfo.innerHTML = `
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" />
    <h2>${name}, ${country}</h2>
    <p><strong>Temperature:</strong> ${tempC}°C</p>
    <p><strong>Feels Like:</strong> ${feelsC}°C</p>
    <p><strong>Condition:</strong> ${desc}</p>
    <p><strong>Humidity:</strong> ${humidity}%</p>
    <p><strong>Pressure:</strong> ${pressure} hPa</p>
    <p><strong>Visibility:</strong> ${visibility / 1000} km</p>
    <p><strong>Wind:</strong> ${speed} m/s, Gust: ${gust || 'N/A'}, Direction: ${deg}°</p>
    <p><strong>Sunrise:</strong> ${sunriseTime}</p>
    <p><strong>Sunset:</strong> ${sunsetTime}</p>
  `;
  weatherInfo.classList.remove('hidden');
}

document.getElementById('weather-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = document.getElementById('city').value.trim();
  const weatherInfo = document.getElementById('weather-info');
  if (city) {
    weatherInfo.innerHTML = '<p>Loading...</p>';
    weatherInfo.classList.remove('hidden');
    const data = await getWeatherData(city);
    updateWeatherDisplay(data);
  } else {
    alert('Please enter a valid city name.');
  }
});
