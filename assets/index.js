let search = document.querySelector("input");
let daysForecastCont = document.querySelector(".forecast-box");
let hoursForecastCont = document.querySelector(".hour-forecast");
let cityName;

// EventListener on "Enter" keypress
search.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    daysForecastCont.innerHTML = "";
    hoursForecastCont.innerHTML = "";
    cityName = search.value;

    // Passing cityname as a paramter to fetchWeather function
    fetchWeather(cityName);
  }
});

// Function for Search Weather for city
function fetchWeather(cityName) {
  // URL & Options
  const url = `https://api.weatherapi.com/v1/forecast.json?key=bc11ab7e238845a392833721230507&q=${cityName}`;
  const futureUrl = `https://api.weatherapi.com/v1/forecast.json?key=bc11ab7e238845a392833721230507&q=${cityName}&days=8`;

  const options = {
    method: "GET",
  };

  // Function to fetch API
  async function weatherFunction() {
    // Fetching FutureApi Url
    const futureWeather = await fetch(futureUrl, options)
      .then((response) => response.json())
      .then((response) => {
        if (
          response.forecast &&
          response.forecast.forecastday &&
          response.forecast.forecastday.length > 0
        ) {
          let forecastDaysCont = document.querySelector(".forecast-box");
          let days = response.forecast.forecastday;

          // Using For loop to display next 7days weather details
          for (let i = 1; i < days.length; i++) {
            let dayOfDate = new Date(days[i].date).toLocaleDateString([], {
              weekday: "long",
            });
            let date = new Date(days[i].date).toLocaleDateString([], {
              month: "long",
              day: "numeric",
            });
            let day = document.createElement("div");
            day.classList.add("days");
            day.innerHTML = `<div class="days-img">
          <img src=${days[i].day.condition.icon} />
        </div>
        <div class="days-temp">${Math.round(days[i].day.avgtemp_c)}°</div>
        <div class="days-date">${date}</div>
        <div class="days-day">${dayOfDate}</div>`;
            forecastDaysCont.appendChild(day);
          }
        } else {
          console.log("Error: Missing forecast data");
          document.querySelector(".container").innerHTML = "<div class='error-box'><p class='error'>City Not Found</p></div>"
        }
      });

    // Fetching CurrentApi Url
    const weather = await fetch(url, options)
      .then((response) => response.json())
      .then((response) => {
        // Current Weather Details
        document.getElementById("city").innerHTML = response.location.name;
        document.querySelector(".current-temp").innerHTML =
          Math.round(response.current.temp_c) + "°C";
        document.getElementById("condition").innerHTML =
          response.current.condition.text;
        document.querySelector(".date").querySelector("p").innerHTML =
          new Date().toLocaleDateString([], {
            weekday: "long",
            month: "long",
            day: "numeric",
          });
        document
          .querySelector(".current-weather-img")
          .setAttribute("src", response.current.condition.icon);

        //Passing Data to Highlights element
        document.querySelector(".temp_c").innerHTML = `${Math.round(
          response.current.temp_c
        )}`;
        document.querySelector(".temp_f").innerHTML = `${Math.round(
          response.current.temp_f
        )}`;
        document.querySelector(".degree").innerHTML = `${Math.round(
          response.current.wind_degree
        )}`;
        document.querySelector(".speed").innerHTML = `${Math.round(
          response.current.wind_kph
        )}`;
        document.querySelector(
          ".sunrise"
        ).innerHTML = `${response.forecast.forecastday[0].astro.sunrise}`;
        document.querySelector(
          ".sunset"
        ).innerHTML = `${response.forecast.forecastday[0].astro.sunset}`;
        document.querySelector(".uv").innerHTML = `${response.current.uv}`;
        document.querySelector(
          ".humidity"
        ).innerHTML = `${response.current.humidity}`;
        document.querySelector(
          ".pressure"
        ).innerHTML = `${response.current.pressure_mb}`;
        document.querySelector(
          ".feels_like"
        ).innerHTML = `${response.current.feelslike_c}`;

        // Passign Data to 24Hrs Forecasting elements
        let forecastContainer = document.querySelector(".hour-forecast");
        let hours = response.forecast.forecastday[0].hour;

        for (let i = 0; i < hours.length; i++) {
          let time = new Date(hours[i].time);
          let card = document.createElement("div");
          card.classList.add("card");
          card.innerHTML = `<div class="time">${time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}</div>
          <img src="${hours[i].condition.icon}" />
          <div class="temp">${Math.round(hours[i].temp_c) + "°"}</div>`;
          forecastContainer.appendChild(card);
        }
      })

      // catching out the error in console.
      .catch((err) => console.log(err));
  }

  weatherFunction();
}

fetchWeather("London");
