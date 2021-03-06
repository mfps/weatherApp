import "./fetch";
import "./promise.min";

import WeatherServices from "./services";

class WeatherForecast {
  constructor() {
    this.state = {};
    this.category = "all";
    this.foreCastButton = document.querySelector(".forecast-button");
    this.location = document.querySelector("#location");
    this.resultOptions = document.querySelectorAll(".options div");
    this.conditions = document.querySelector(".conditions");
    this.reset = document.querySelector(".forecast-button__reset");
    this.results = document.querySelector(".results");
    this.activities = document.querySelector(".activities");
    this.weatherServices = new WeatherServices();
    this.onInit();
  }

  eventHandler() {
    this.foreCastButton.addEventListener(
      "click",
      e => {
        e.preventDefault();
        this.getWeatherData();
      },
      false
    );

    this.resultOptions.forEach(el => {
      el.addEventListener(
        "click",
        e => {
          e.preventDefault();
          this.updateActivityList(e);
        },
        false
      );
    });

    this.reset.addEventListener("click", e => this.resetWeatherForecast());
  }

  getWeatherData() {
    const location = this.location.value;
    this.location.value = "";

    this.weatherServices
      .getWeather(location)
      .then(response => {
        this.updateUISuccess(response);
      })
      .catch(error => {
        this.updateUIFailure(error);
      });
  }

  updateUISuccess(response = null) {
    if (response) {
      const degC = response.main.temp - 273.15;
      const degCInt = Math.floor(degC);
      const degF = degC * 1.8 + 32;
      const degFInt = Math.floor(degF);
      this.state = {
        condition: response.weather[0].main,
        icon: `http://openweathermap.org/img/w/${response.weather[0].icon}.png`,
        degCInt: Math.floor(degCInt),
        degFInt: Math.floor(degFInt),
        city: response.name
      };

      let container = document.createElement("div");
      let cityPara = document.createElement("p");
      cityPara.setAttribute("class", "city");
      cityPara.textContent = this.state.city;
      let conditionsPara = document.createElement("p");
      conditionsPara.textContent = `${this.state.degCInt}\u00B0 C / ${this.state
        .degFInt}\u00B0 F`;
      let iconImage = document.createElement("img");
      iconImage.setAttribute("src", this.state.icon);
      iconImage.setAttribute("alt", this.state.condition);
      conditionsPara.appendChild(iconImage);
      container.appendChild(cityPara);
      container.appendChild(conditionsPara);

      const conditions = document.querySelector(".conditions div");

      if (conditions) {
        this.conditions.replaceChild(container, conditions);
      } else {
        this.conditions.appendChild(container);
      }

      this.updateActivityList();
    } else {
      while (this.activities.firstChild) {
        this.activities.removeChild(this.activities.firstChild);
      }
      while (this.conditions.firstChild) {
        this.conditions.removeChild(this.conditions.firstChild);
      }
      this.results.classList.remove("open");
    }
  }

  updateUIFailure(error = null) {
    document.querySelector(".conditions").textContent =
      "Weather information unavailable";
  }

  async updateActivityList(event) {
    const targetClassList = event.target.classList;
    if (event !== undefined && targetClassList.contains("selected")) {
      return true;
    } else if (event !== undefined && !targetClassList.contains("selected")) {
      this.category = event.target.id;
      this.resultOptions.forEach(el => {
        el.classList.remove("selected");
      });

      targetClassList.add("selected");
    }

    this.state.activities = [];
    if (this.state.condition === "Rain") {
      await this.updateState("In");
    } else if (this.state.condition === "Snow" || this.state.degFInt < 50) {
      await this.updateState("OutCold");
    } else {
      await this.updateState("OutWarm");
    }

    const into = this.activities;
    const activities = document.querySelector(".activities div");
    let activitiesContainer = document.createElement("div");
    let list = document.createElement("ul");

    this.state.activities.forEach((activity, index) => {
      let listItem = document.createElement("li");
      listItem.setAttribute("key", index);
      listItem.textContent = activity;
      list.appendChild(listItem);
    });
    activitiesContainer.appendChild(list);

    if (activities) {
      into.replaceChild(activitiesContainer, activities);
    } else {
      into.appendChild(activitiesContainer);
    }

    this.results.classList.add("open");
  }

  async updateState(type) {
    const activities = await this.weatherServices
      .getActivities()
      .then(activities => activities);

    if (this.category === "solo") {
      this.state.activities.push(...activities[`solo${type}`]);
    } else if (this.category === "team") {
      this.state.activities.push(...activities[`team${type}`]);
    } else {
      this.state.activities.push(...activities[`solo${type}`]);
      this.state.activities.push(...activities[`team${type}`]);
    }
  }

  resetWeatherForecast() {
    this.state = {};
    this.updateUISuccess();
  }

  onInit() {
    this.eventHandler();
  }
}

(() => {
  new WeatherForecast();
})();
