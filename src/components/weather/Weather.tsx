

import { useEffect, useState } from "react";
import bgImage from "../../assets/images/bg-today-large.svg";
import bgImage2 from "../../assets/images/bg-today-small.svg"
import HourlyDropdown from "../Hourlycast/HourlyDropdown";
import sunny from "../../assets/images/icon-sunny.webp";
import snow from "../../assets/images/icon-snow.webp";
import fog from "../../assets/images/icon-fog.webp";
import parialCloud from "../../assets/images/icon-partly-cloudy.webp"
import rain from "../../assets/images/icon-rain.webp";
import thunder from "../../assets/images/icon-storm.webp";
import overcast from "../../assets/images/icon-overcast.webp";
import "./Weather.css"

interface WeatherProps {
  switchImperial: boolean;
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  time: string;
}

// Hourly weather data
export interface HourlyData {
  time: string[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  precipitation: number[];
  windspeed_10m: number[];
   weathercode: number[];
}

// Daily forecast
export interface DailyData {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  weathercode: number[];
}

// Full API response
export interface WeatherResponse {
  latitude: number;
  longitude: number;
  timezone: string;

  current_weather: CurrentWeather;
  hourly: HourlyData;
  daily: DailyData;

  city?: string; 
}
interface WeatherProps {
  // loading: boolean;
  weatherData: WeatherResponse | null;
}

const Weather: React.FC<WeatherProps> = ({ weatherData,switchImperial }) =>  {

  
  const [selectedDay, setSelectedDay] = useState("Today");
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
    if (!weatherData) return null;

     const currentTemp = weatherData.current_weather.temperature;
  const feelsLike = weatherData.hourly.apparent_temperature[0];
  const humidity = weatherData.hourly.relative_humidity_2m[0];
  const wind = weatherData.current_weather.windspeed;
  const precipitation = weatherData.hourly.precipitation[0];

  const getWeatherImage = (code: number) => {
  if (code === 0) return sunny; // Clear sky

  if ([1, 2, 3].includes(code)) return parialCloud; // Mainly clear, partly cloudy

  if ([45, 48].includes(code)) return fog; // Fog

  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return rain; // Rain

  if ([71, 73, 75, 77, 85, 86].includes(code)) return snow; // Snow

  if ([95, 96, 99].includes(code)) return thunder; // Thunderstorm

  return overcast; // Fallback
};


  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true"
    )
      .then((res) => res.json())
      .then((result: WeatherResponse) => {
        setData(result);
        console.log(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching weather:", error);
        setLoading(false);
      });
  }, []);
  const fahrenheit = ((feelsLike * 9) / 5 + 32).toFixed(0);
  const currentTemp2 = ((currentTemp * 9) / 5 + 32).toFixed(0) ;
  const windMph = (wind * 0.621371).toFixed(0);
  const precipitationIn = precipitation * 0.0393701;
  const today = new Date();

const formattedDate = today.toLocaleDateString("en-US", {
  weekday: "long",
  month: "short",
  day: "numeric",
  year: "numeric",
}).replace(" ", "");

  // if (loading) return <p className="text-white text-center">Loading weather...</p>;



  return (
    // <div className="">
      <div className="flex flex-col lg:flex-row gap-5 md:justify-between xl:justify-around px-4 md:px-16 lg:px-30 py-6 items-start ">
        
       <div className="w-full flex flex-col gap-5"> 


       {loading ? (
    // Skeleton for the same space
    <div className="w-full h-full rounded-lg bg-gray-700 animate-pulse flex items-center">
      <div className="flex flex-wrap justify-between gap-4 items-center w-full px-3 sm:px-8 md:px-10">
        <div>
          <div className="h-6 w-32 bg-gray-500 rounded mb-2"></div> {/* City Name */}
          <div className="h-4 w-40 bg-gray-500 rounded"></div>     {/* Date */}
        </div>
        <div className="flex items-center justify-end gap-2">
          <div className="h-10 w-10 bg-gray-500 rounded-full"></div> {/* Weather Icon */}
          <div className="h-6 w-12 bg-gray-500 rounded"></div>       {/* Temperature */}
        </div>
      </div>
    </div>
  ) : (
    // Original div
    <div
      className="w-full rounded-lg bg-cover bg-center bg-no-repeat py-6 md:py-12 lg:py-16 h-full flex items-center"
      style={{
    backgroundImage: `url(${window.innerWidth < 640 ? bgImage2 : bgImage})`,
   }}
    >
      <div className="flex flex-wrap flex-col sm:flex-row  sm:justify-between gap-4 items-center w-full px-3 sm:px-8 md:px-10">
        <div>
          <h3 className="font-bold text-2xl text-white">{weatherData.city}</h3>
          <p className="font-normal text-lg text-white">{formattedDate}</p>
        </div>
        <div className="flex items-center justify-end gap-4">
          {/* <img src={sunny} className="w-15 md:w-25" alt="" /> */}
          <img
  src={getWeatherImage(weatherData.current_weather.weathercode)}
  className="w-18 md:w-23"
  alt="weather icon"
/>

          <h3 className="font-bold text-white text-4xl md:text-6xl ">
            {switchImperial ? `${currentTemp2}°`: 
          `${currentTemp.toFixed(0)}°` }
            </h3>
        </div>
      </div>
    </div>
)}



    <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
  {loading ? (
    // Skeleton for all 4 cards
    <>
      {[1, 2, 3, 4].map((_, index) => (
        <div
          key={index}
          className="rounded-lg py-2 px-4 bg-[hsl(243,23%,30%)] w-full animate-pulse"
        >
          <div className="h-4 w-24 bg-gray-500 rounded mb-2"></div> {/* Label */}
          <div className="h-6 w-16 bg-gray-500 rounded"></div>     {/* Value */}
        </div>
      ))}
    </>
  ) : (
    // Original cards
    <>
      <div className="rounded-lg py-2 px-4 bg-[hsl(243,23%,30%)] text-white w-full ">
        <p className="py-2">Feels like</p>
        <p className="py-2 text-xl md:text-2xl">
          {switchImperial ? `${fahrenheit}°`: 
          `${feelsLike.toFixed(0)}°` }</p>
      </div>
      <div className="rounded-lg py-2 px-4 bg-[hsl(243,23%,30%)] text-white w-full ">
        <p className="py-2">Humidity</p>
        <p className="py-2 text-xl md:text-2xl">{humidity}%</p>
      </div>
      <div className="rounded-lg py-2 px-4 bg-[hsl(243,23%,30%)] text-white w-full ">
        <p className="py-2">Wind</p>
        <p className="py-2 text-xl md:text-2xl">{switchImperial ? `${windMph} mph`: 
          `${wind} km/h` }</p>
      </div>
      <div className="rounded-lg py-2 px-4 bg-[hsl(243,23%,30%)] text-white w-full ">
        <p className="py-2">Percipitation</p>
        <p className="py-2 text-xl md:text-2xl">{switchImperial ? `${precipitationIn} in`: 
          `${precipitation} mm` }</p>
      </div>
    </>
  )}
</div>

    <h3 className="text-white">daily forecast</h3>

    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-7 gap-3">
  {loading
    ? Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg py-2 flex flex-col items-center px-4 bg-[hsl(243,23%,30%)] text-white"
        >
          <div className="h-5 w-10 bg-gray-500 rounded mb-2 animate-pulse"></div> {/* Day */}
          <div className="h-10 w-10 bg-gray-500 rounded-full mb-2 animate-pulse"></div> {/* Icon */}
          <div className="flex gap-4">
            <div className="h-4 w-6 bg-gray-500 rounded animate-pulse"></div> {/* Max temp */}
            <div className="h-4 w-6 bg-gray-500 rounded animate-pulse"></div> {/* Min temp */}
          </div>
        </div>
      ))
    : weatherData.daily.time.map((day, i) => (
        <div
          key={i}
          className="rounded-lg py-2 w-full flex flex-col items-center px-4 bg-[hsl(243,23%,30%)] text-white"
        >
          <h5 className="text-white">{new Date(day).toLocaleDateString('en-US', { weekday: 'short' })}</h5>
           <img
      src={getWeatherImage(weatherData.daily.weathercode[i])}
      className="w-10 md:w-20"
      alt="weather icon"
    />
          <div className="flex gap-4">
            <p className="text-white py-1 text-sm">
              {switchImperial ? `${(((weatherData.daily.temperature_2m_max[i] * 9) / 5) + 32).toFixed(0)}°`: 
          `${weatherData.daily.temperature_2m_max[i].toFixed(0)}°` }
          
             </p>
              <p className="text-white py-1 text-sm">
              {switchImperial ? `${(((weatherData.daily.temperature_2m_min[i] * 9) / 5) + 32).toFixed(0)}°`: 
          `${weatherData.daily.temperature_2m_min[i].toFixed(0)}°` }
          
             </p>
          </div>
        </div>
      ))}
</div>


      </div>

<div className="bg-[hsl(243,27%,20%)] w-full lg:w-[380px] xl:w-[470px] rounded-lg p-3">
  <div className="flex justify-between items-center">
    <h3 className="text-white py-2 font-bold">Hourly Forecast</h3>
    <HourlyDropdown selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
  </div>

  {/* Scrollable container */}
  <div className="custom-scrollbar flex flex-col gap-3 mt-2 max-h-[470px] overflow-y-auto pr-3">
    {loading
      ? Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-[hsl(243,23%,30%)] rounded-lg px-2 animate-pulse"
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[hsl(243,23%,40%)] rounded-full" />
              <div className="h-6 w-16 bg-[hsl(243,23%,40%)] rounded" />
            </div>
            <div className="h-6 w-12 bg-[hsl(243,23%,40%)] rounded" />
          </div>
        ))
      : (() => {
          // ✅ Filter hourly data based on selected day
          const filteredHourly = weatherData.hourly.time
            .map((timeStr, idx) => ({ timeStr, idx }))
            .filter(({ timeStr }) => {
              const date = new Date(timeStr);
              const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
              const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
              return selectedDay === "Today" ? dayName === todayName : dayName === selectedDay;
            });

          return filteredHourly.map(({ timeStr, idx }) => {
            const date = new Date(timeStr);
            const hours = date.getHours();
            const formattedTime =
              hours === 0
                ? `12 AM`
                : hours < 12
                ? `${hours} AM`
                : hours === 12
                ? `12 PM`
                : `${hours - 12} PM`;

            const code = weatherData.hourly.weathercode[idx];

            return (
              <div
                key={idx}
                className="flex justify-between items-center bg-[hsl(243,23%,30%)] rounded-lg px-2"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={code !== undefined ? getWeatherImage(code) : sunny}
                    className="w-10"
                    alt="weather icon"
                  />
                  <h3 className="font-normal text-white py-2">{formattedTime}</h3>
                </div>
                <h3 className="font-normal text-white py-2">
                   {switchImperial ? `${(((weatherData.hourly.apparent_temperature[idx] * 9) / 5) + 32).toFixed(0)}°`: 
          `${weatherData.hourly.apparent_temperature[idx].toFixed(0)}°` }
                  
                </h3>
              </div>
            );
          });
        })()}
  </div>
</div>


</div>


  );
};

export default Weather;

