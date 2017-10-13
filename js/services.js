export default class WeatherServices {
  constructor() {}

  getActivities() {
    return new Promise(resolve => {
      return resolve({
        teamIn: ["basketball", "hockey", "volleyball"],
        teamOutWarm: [
          "softball/baseball",
          "football/soccer",
          "American football",
          "rowing",
          "tennis",
          "volleyball",
          "ultimate frisbee",
          "rugby"
        ],
        teamOutCold: ["hockey"],
        soloIn: ["rock climbing", "swimming", "ice skating"],
        soloOutWarm: [
          "rowing",
          "running",
          "hiking",
          "cycling",
          "rock climbing"
        ],
        soloOutCold: [
          "snowshoeing",
          "downhill skiing",
          "cross-country skiing",
          "ice skating"
        ]
      });
    });
  }

  getWeather(location) {
    const URL = "http://api.openweathermap.org/data/2.5/weather?q=";
    const API_KEY = "";

    return fetch(`${URL}${location}&appid=${API_KEY}`).then(response => {
      return response.json();
    });
  }
}
