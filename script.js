const apiKey = "99026dccf4becbdba046163c3206056a";

document.getElementById("searchBtn").addEventListener("click", () => {
  let city = document.getElementById("cityInput").value.trim();
  if(city) fetchWeather(city);
});

async function fetchWeather(city) {
  try {
    // 🌤 Current Weather
    const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    if (!currentRes.ok) throw new Error("City not found");
    const currentData = await currentRes.json();

    document.getElementById("currentWeather").innerHTML = `
      <h2>${currentData.name}</h2>
      <p>${currentData.weather[0].description}</p>
      <h3>${currentData.main.temp.toFixed(1)}°C</h3>
      <img src="http://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png">
    `;

    // 📅 Forecast Data
    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    const forecastData = await forecastRes.json();

    // Daily Forecast (5-day)
    let forecastHTML = "";
    for(let i = 0; i < forecastData.list.length; i += 8) {
      let day = forecastData.list[i];
      forecastHTML += `
        <div class="day">
          <h4>${new Date(day.dt_txt).toDateString()}</h4>
          <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
          <p>${day.main.temp.toFixed(1)}°C</p>
        </div>`;
    }
    document.getElementById("forecast").innerHTML = forecastHTML;

    // ⏰ Hourly Timeline (next 10 intervals = ~30 hours)
    let timelineHTML = "";
    forecastData.list.slice(0, 10).forEach(hour => {
      let time = new Date(hour.dt_txt);
      timelineHTML += `
        <div class="hour">
          <h4>${time.getHours()}:00</h4>
          <img src="http://openweathermap.org/img/wn/${hour.weather[0].icon}.png">
          <p>${hour.main.temp.toFixed(1)}°C</p>
        </div>`;
    });
    document.getElementById("timeline").innerHTML = timelineHTML;

  } catch (error) {
    document.getElementById("currentWeather").innerHTML = `<p style="color:red;">${error.message}</p>`;
    document.getElementById("forecast").innerHTML = "";
    document.getElementById("timeline").innerHTML = "";
  }
}
