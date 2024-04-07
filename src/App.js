// BN0T894LHUZ6
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
  faSync,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
// import { faCloud } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
const APIKEY = `9eabaad89aece2b8a5b0aac418e6a26d`;
const APIKEY1 = `BN0T894LHUZ6`;
export default function App() {
  const [displayedCity, setDisplayedCity] = useState("");
  const [weekPrediction, setWeekPrediction] = useState("");
  const [isFarhanite, setIsFarhanite] = useState(false);
  const [overAllError, setOverAllError] = useState(false);
  const [searchStarted, setSearchStarted] = useState(false);
  return (
    <div className="app">
      <SearchBox
        weekPrediction={weekPrediction}
        setWeekPrediction={setWeekPrediction}
        setDisplayedCity={setDisplayedCity}
        isFarhanite={isFarhanite}
        searchStarted={searchStarted}
        setSearchStarted={setSearchStarted}
        setOverAllError={setOverAllError}
      />
      <DisplayBox
        weekPrediction={weekPrediction}
        displayedCity={displayedCity}
        isFarhanite={isFarhanite}
        setIsFarhanite={setIsFarhanite}
        overAllError={overAllError}
      />
    </div>
  );
}
//
//
//
function SearchBox({
  weekPrediction,
  setWeekPrediction,
  setDisplayedCity,
  isFarhanite,
  searchStarted,
  setSearchStarted,
  setOverAllError,
}) {
  const [searching, setSearching] = useState(false);
  const [city, setCity] = useState("");
  const [temprature, setTemprature] = useState(null);
  const [date, setDate] = useState();
  const [error, setError] = useState(null);
  let catchErroMessage;
  const getTemprature = async function (lat, lon) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKEY}`
      );
      if (!response.ok) throw new Error();
      const data = await response.json();
      return data.list;
    } catch (error) {
      catchErroMessage = `We could not fetch Temprature data from server`;
      // setError(`Cant fetch Temprature data from server`);
      // throw new Error(`Cant fetch data from server`);
    }
  };
  // get specififc time
  const getHoursMinutes = async function (lat, lon) {
    const response = await fetch(
      `http://api.timezonedb.com/v2.1/get-time-zone?key=${APIKEY1}&format=json&by=position&lat=${lat}&lng=${lon}`
    );
    const data = await response.json();
    const newDate = new Date(data.formatted);
    const hours = newDate.getHours();
    const minutes = String(newDate.getMinutes()).padStart(2, "0");
    const AMPM = +hours >= 12 ? "PM" : "AM";
    const specific_time = `${
      hours >= 12 ? String(hours - 12) : hours
    }:${minutes} ${AMPM}`;
    setDate(specific_time);
    return data;
  };
  // const converToCelsius = function (array) {};
  const getPosition = async function () {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${APIKEY}`
      );
      const data = await response.json();
      if (!data.length) {
        throw new Error(`We could not find a city called ${city}`);
      }
      console.log(`hey`);
      const { lat, lon } = data[0];
      getHoursMinutes(lat, lon);
      return { lat, lon };
    } catch (error) {
      // console.log(`error at get position`);
      catchErroMessage = error.message;
      // setError(error.message);
      // throw error;
    }
  };
  const getCoords = async function () {
    try {
      const { lat, lon } = await getPosition();

      const datas = await getTemprature(lat, lon);
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
      //
      // const date = new Date(finallArray[0].timeStamp);
      // const options = {
      //   hour: "numeric",
      //   minute: "numeric",
      // };
      // const formatedDate = new Intl.DateTimeFormat("us-GB", options).format(
      //   date
      // );
      // setDate(formatedDate);
      //
      setSearching(false);
    } catch (error) {
      setError(catchErroMessage);
      setOverAllError(() => true);
      // setOverAllError(true);
      // setError(`We could not find a city called ${city}`);
    }
  };

  const handleSubmit = function (event) {
    event.preventDefault();
    try {
      setSearchStarted(() => true);
      getCoords();
      setDisplayedCity(city);
      setSearching(true);
      setError(null);
      setOverAllError(false);
      setCity("");
    } catch (error) {
      setError(`We could not find a city called ${city} hahahha`);
    }
  };

  if (error)
    return (
      <div className="search-box">
        <form className="search-form" onSubmit={handleSubmit}>
          <input
            required
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
          <FontAwesomeIcon icon={faExclamationTriangle} />
          {error}
        </div>
      </div>
    );

  return (
    <div className="search-box">
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          required
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
        <div className="time">{date}</div>
        {!searching && city && temprature && <div>{city}</div>}
        {searching && <div>Loading...</div>}
      </div>
      <Currently
        weekPrediction={weekPrediction}
        setWeekPrediction={setWeekPrediction}
        setDisplayedCity={setDisplayedCity}
        isFarhanite={isFarhanite}
        searchStarted={searchStarted}
      />
      <footer>
        <a href="https://github.com/Eyu16" target="blank">
          Produced By <strong className="producer">Eyob Yihalem</strong>
        </a>
      </footer>
    </div>
  );
}

function Currently({
  weekPrediction,
  setWeekPrediction,
  setDisplayedCity,
  isFarhanite,
  searchStarted,
}) {
  const [currentCity, setCurrentCity] = useState("");
  const [currentCityTemp, setCurrentCityTemp] = useState(null);
  const isReady = currentCity && currentCityTemp;
  const getTemprature = async function (lat, lon) {
    console.log(`temp`);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=9eabaad89aece2b8a5b0aac418e6a26d`
    );

    const data = await response.json();
    return data.list;
  };

  const getPosition = async function () {
    return await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error)
      );
    });
  };

  const getCity = async function () {
    console.log(`city`);
    const data = await getPosition();
    console.log(data);
    const { latitude: lat, longitude: lon } = data.coords;
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${APIKEY}`
    );
    const data2 = await response.json();
    const { name: city } = data2[0];
    return { city, lat, lon };
  };
  const fetchData = async function () {
    const cityCords = await getCity();
    setCurrentCity(cityCords.city);
    if (!searchStarted) setDisplayedCity(cityCords.city);
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
    if (!searchStarted) {
      setWeekPrediction(() => [...finallArray]);
    }
    setCurrentCityTemp(Math.round(finallArray[0].main.temp - 273.5));
  };
  useEffect(() => {
    fetchData();
  });

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
function DisplayBox({
  weekPrediction,
  displayedCity,
  isFarhanite,
  setIsFarhanite,
  overAllError,
}) {
  const [details, setDetails] = useState(weekPrediction[0]);
  useEffect(() => {
    if (weekPrediction && weekPrediction.length > 0) {
      setDetails(weekPrediction[0]);
    }
  }, [weekPrediction]);
  if (overAllError)
    return (
      <div className="display-box waiting-message">
        <FontAwesomeIcon icon={faExclamationTriangle} /> We couldnot load the
        details
      </div>
    );
  if (!weekPrediction.length)
    return (
      <div className="display-box waiting-message">
        Loading the current location status...
      </div>
    );
  return (
    <div className="display-box">
      <div className="sync-div">
        <a
          style={{ position: "absolute" }}
          href="https://github.com/Eyu16/weather-app"
        >
          <FontAwesomeIcon icon={faSync} className="sync" />
        </a>
        <div className="display-mode">
          <button>Dark</button>
          <button onClick={() => setIsFarhanite((isFarhanite) => !isFarhanite)}>
            °{isFarhanite ? "F" : "C"}
          </button>
        </div>
      </div>
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
    if (temprature <= 0) {
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
