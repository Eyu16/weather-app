// import { useEffect, useState } from "react";
// const APIKEY = `9eabaad89aece2b8a5b0aac418e6a26d`;
// export default function App() {
//   return (
//     <div>
//       <WeatherFetch />
//     </div>
//   );
// }
// function WeatherFetch() {
//   const [temprature, setTemprature] = useState(null);
//   const [city, setCity] = useState("");
//   const [currentCity, setCurrentCity] = useState("");

//   const getTemprature = async function (city) {
//     if (!city) return;
//     try {
//       const response = await fetch(
//         `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=9eabaad89aece2b8a5b0aac418e6a26d`
//       );

//       const data = await response.json();
//       return data.main.temp_min - 273.5;
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const getPosition = async function () {
//     try {
//       return await new Promise((resolve, reject) => {
//         navigator.geolocation.getCurrentPosition(
//           (position) => resolve(position),
//           (error) => reject(error)
//         );
//       });
//     } catch (error) {
//       throw error;
//     }
//   };

//   const getCity = async function () {
//     const data = await getPosition();
//     const { latitude: lat, longitude: lon } = data.coords;
//     const response = await fetch(
//       `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${APIKEY}`
//     );
//     const data2 = await response.json();
//     const city = data2[0].name;
//     // setCurrentCity(data2[0].name);
//     // const currentCity = ;
//     const temprature = await getTemprature(city);
//     return { city, temprature };
//   };
//   const fecthData = async function (currentCity = true) {
//     const data = await getCity();
//     if (currentCity) {
//       setCurrentCity(data.city);
//       setTemprature(Math.round(data.temprature));
//     } else {
//       const temp = await getTemprature(city);
//       setTemprature(Math.round(temp));
//     }
//   };
//   fecthData();
//   const handleSubmit = function (event) {
//     event.preventDefault();
//     fecthData(false);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         value={city}
//         type="text"
//         onChange={(event) => setCity(event.target.value)}
//         required
//       ></input>
//       <button>Search</button>
//       {!city && (
//         <p>
//           {!currentCity || !temprature
//             ? "Loading your current position..."
//             : `You are currently in ${currentCity} and the temprature is ${temprature}`}
//         </p>
//       )}
//       {city && (
//         <p>
//           {" "}
//           Your search result is {city}: {temprature}
//         </p>
//       )}
//     </form>
//   );
// }
