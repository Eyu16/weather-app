import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import {
  faLocation,
  faCloud,
  faSun,
  faMoon,
  faTint,
  faSnowflake,
  faUmbrella,
  faWind,
  faTachometerAlt,
  faEye,
  faLevelUp,
  faThermometer0,
} from "@fortawesome/free-solid-svg-icons";
// import { faCloud } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
const APIKEY = `9eabaad89aece2b8a5b0aac418e6a26d`;
export default function App() {
  const [displayedCity, setDisplayedCity] = useState("");
  const [weekPrediction, setWeekPrediction] = useState("");
  return (
    <div className="app">
      <SearchBox
        setWeekPrediction={setWeekPrediction}
        setDisplayedCity={setDisplayedCity}
      />
      <DisplayBox
        weekPrediction={weekPrediction}
        displayedCity={displayedCity}
      />
    </div>
  );
}
//
//
//
function SearchBox({ setWeekPrediction, setDisplayedCity }) {
  const [searching, setSearching] = useState(false);
  const [city, setCity] = useState("");
  const [temprature, setTemprature] = useState(null);
  const getTemprature = async function (lat, lon) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=9eabaad89aece2b8a5b0aac418e6a26d`
      );
      const data = await response.json();
      return data.list;
    } catch (error) {
      console.log(error);
    }
  };
  const getPosition = async function () {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${APIKEY}`
      );

      const data = await response.json();
      const { lat, lon } = data[0];
      console.log(lat, lon);
      return { lat, lon };
    } catch (error) {
      throw error;
    }
  };
  const getCoords = async function () {
    const { lat, lon } = await getPosition();
    const datas = await getTemprature(lat, lon);
    console.log(datas);
    const dataModified = datas.map((data) => {
      const timeStamp = new Date(data.dt_txt).getTime();
      return { ...data, timeStamp };
    });

    const getDay = (timestamp) => {
      const date = new Date(timestamp); // Convert seconds to milliseconds
      return date.toISOString().split("T")[0]; // Extract YYYY-MM-DD
    };

    const groupedData = dataModified.reduce((acc, data) => {
      const day = getDay(data.timeStamp);
      acc[day] = acc[day] || [];
      acc[day].push(data);
      return acc;
    }, {});
    const finallArray = [];
    for (const items in groupedData) {
      finallArray.push(groupedData[items][0]);
    }
    finallArray.splice(0, 1);
    setWeekPrediction(() => [...finallArray]);
    setTemprature(Math.round(finallArray[0].main.temp - 273.5));
    setSearching(false);
  };
  const handleSubmit = function (event) {
    event.preventDefault();
    getCoords();
    setDisplayedCity(city);
    setSearching(true);
  };
  return (
    <div className="search-box">
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          value={city}
          onChange={(event) => {
            setCity(event.target.value);
            setTemprature(null);
          }}
          className="search-input"
          type="text"
        ></input>
        <button className="seach-btn">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            style={{ fontSize: "2rem", color: "#fff" }}
          />
        </button>
      </form>
      <div className="search-description">
        {!searching && city && temprature && (
          <div className="temprature-main">{temprature}°c</div>
        )}
        <div className="time">12:30 PM</div>
        {!searching && city && temprature && <div>{city}</div>}
        {searching && <div>Loading...</div>}
      </div>
      <Currently
        setWeekPrediction={setWeekPrediction}
        setDisplayedCity={setDisplayedCity}
      />
      <footer>
        <a href="https://github.com/Eyu16" target="blank">
          Produced By <strong className="producer">Eyob Yihalem</strong>
        </a>
      </footer>
    </div>
  );
}

function Currently({ setWeekPrediction, setDisplayedCity }) {
  const [currentCity, setCurrentCity] = useState("");
  const [currentCityTemp, setCurrentCityTemp] = useState(null);
  const isReady = currentCity && currentCityTemp;
  const getTemprature = async function (lat, lon) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=9eabaad89aece2b8a5b0aac418e6a26d`
      );

      const data = await response.json();
      return data.list;
    } catch (error) {
      console.log(error);
    }
  };

  const getPosition = async function () {
    try {
      return await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position),
          (error) => reject(error)
        );
      });
    } catch (error) {
      throw error;
    }
  };

  const getCity = async function () {
    const data = await getPosition();
    const { latitude: lat, longitude: lon } = data.coords;
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${APIKEY}`
    );
    const data2 = await response.json();
    const { name: city } = data2[0];
    return { city, lat, lon };
  };
  const fetchData = async function () {
    const cityCords = await getCity();
    setCurrentCity(cityCords.city);
    setDisplayedCity(cityCords.city);
    const datas = await getTemprature(cityCords.lat, cityCords.lon);
    const dataModified = datas.map((data) => {
      const timeStamp = new Date(data.dt_txt).getTime();
      return { ...data, timeStamp };
    });

    const getDay = (timestamp) => {
      const date = new Date(timestamp); // Convert seconds to milliseconds
      return date.toISOString().split("T")[0]; // Extract YYYY-MM-DD
    };
    const groupedData = dataModified.reduce((acc, data) => {
      const day = getDay(data.timeStamp);
      acc[day] = acc[day] || [];
      acc[day].push(data);
      return acc;
    }, {});
    const finallArray = [];
    for (const items in groupedData) {
      finallArray.push(groupedData[items][0]);
    }
    finallArray.splice(0, 1);
    setWeekPrediction(() => [...finallArray]);
    setCurrentCityTemp(Math.round(finallArray[0].main.temp - 273.5));
  };
  useEffect(() => {
    fetchData();
  }, []);
  if (!isReady)
    return (
      <div className="currently not-ready">
        Loading Your Current position Status...
      </div>
    );
  return (
    <div className="currently slide">
      <FontAwesomeIcon
        icon={faLocation}
        style={{ fontSize: "2rem", color: "#000" }}
      />
      {currentCity} {currentCityTemp}°c
    </div>
  );
}
function DisplayBox({ weekPrediction, displayedCity }) {
  const [details, setDetails] = useState(weekPrediction[0]);
  useEffect(() => {
    if (weekPrediction && weekPrediction.length > 0) {
      setDetails(weekPrediction[0]);
    }
  }, [weekPrediction]);
  if (!weekPrediction.length) return;
  return (
    <div className="display-box">
      <WeaksBox weekPrediction={weekPrediction} setDetails={setDetails} />
      <Deatials
        details={details}
        weekPrediction={weekPrediction}
        displayedCity={displayedCity}
      />
    </div>
  );
}

function WeaksBox({ weekPrediction, setDetails }) {
  // const weekDay = ["monday", "tuesday", "wednsday", "thursday", "friday"];
  return (
    <div className="weaks-summary">
      {weekPrediction.map((data, i) => (
        <WeatherCard data={data} key={i} setDetails={setDetails} />
      ))}
    </div>
  );
}
function WeatherCard({ data, setDetails }) {
  const temprature = Math.round(data.main.temp - 273.5);
  const chooseIcon = function () {
    if (temprature < 0) {
      return faSnowflake;
    }
    if (temprature > 0 && temprature <= 5) {
      return faCloud;
    }
    if (temprature > 5 && temprature <= 10) {
      return faMoon;
    }
    if (temprature > 10 && temprature <= 15) {
      return faUmbrella;
    }
    if (temprature > 15) {
      return faSun;
    }
  };
  const isSun = chooseIcon() === faSun;
  const date = new Date(data.timeStamp);
  const options = {
    weekday: "long",
  };
  const day = new Intl.DateTimeFormat("us-GB", options).format(date);
  const handleClick = function () {
    setDetails(data);
  };
  return (
    <div className="weather-card" onClick={handleClick}>
      <h2>{day}</h2>
      <FontAwesomeIcon
        icon={chooseIcon()}
        style={{ fontSize: "5rem", color: isSun ? "#FFFF00" : "#fff" }}
      />
      <div className="card-temprature">{temprature}°c</div>
    </div>
  );
}
function Deatials({ details, displayedCity }) {
  const [data, setData] = useState(details);
  useEffect(() => {
    if (details) {
      setData(details);
    }
  }, [details]);
  const properties = [
    "Humudity",
    "Wind Speed",
    "Visibility",
    "Pressure",
    "Sea Level",
    "Feels Like",
  ];
  return (
    <div className="details">
      <h3 className="Heading-main">Details of {displayedCity}</h3>
      <div className="details-grid">
        {data && (
          <>
            <DetailsCard property={properties[0]} icon={faTint}>
              {data.main.humidity}%RH
            </DetailsCard>
            <DetailsCard property={properties[1]} icon={faWind}>
              {data.wind.speed}Km/Hr
            </DetailsCard>
            <DetailsCard property={properties[2]} icon={faEye}>
              {data.visibility}M
            </DetailsCard>
            <DetailsCard property={properties[3]} icon={faTachometerAlt}>
              {data.main.pressure}Pa
            </DetailsCard>
            <DetailsCard property={properties[4]} icon={faLevelUp}>
              {data.main.sea_level}M
            </DetailsCard>
            <DetailsCard property={properties[5]} icon={faThermometer0}>
              {Math.round(data.main.feels_like - 273.5)}°c
            </DetailsCard>
          </>
        )}
      </div>
    </div>
  );
}
function DetailsCard({ property, children, icon }) {
  return (
    <div className="detais-card">
      <h5 className="detail-title">{property}</h5>
      <div className="detail-numbers">{children}</div>
      <div className="deatil-description">
        <FontAwesomeIcon icon={icon} />
      </div>
    </div>
  );
}
