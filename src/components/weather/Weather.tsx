import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import bgImage from "../../assets/images/bg-today-large.svg";
import bgImage2 from "../../assets/images/bg-today-small.svg";
import HourlyDropdown from "../Hourlycast/HourlyDropdown";
import sunny from "../../assets/images/icon-sunny.webp";
import snow from "../../assets/images/icon-snow.webp";
import fog from "../../assets/images/icon-fog.webp";
import parialCloud from "../../assets/images/icon-partly-cloudy.webp";
import rain from "../../assets/images/icon-rain.webp";
import thunder from "../../assets/images/icon-storm.webp";
import overcast from "../../assets/images/icon-overcast.webp";
import "./Weather.css";
const BASE_URL = import.meta.env.VITE_WEATHER_API;

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  time: string;
}

export interface HourlyData {
  time: string[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  precipitation: number[];
  windspeed_10m: number[];
  weathercode: number[];
}

export interface DailyData {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  weathercode: number[];
}

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
  weatherData: WeatherResponse | null;
  switchImperial: boolean;
  loadingWeather: boolean;
  onError: () => void;
}

// const fetchWeather = async (): Promise<WeatherResponse> => {
//   const res = await fetch(
//     "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,windspeed_10m,weathercode&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto"
//   );

//   if (!res.ok) {
//     throw new Error("Failed to fetch weather");
//   }

//   const data: WeatherResponse = await res.json();
//   data.city = "Berlin, Germany";

//   return data;
// };
const fetchWeather = async (lat: number, lon: number): Promise<WeatherResponse> => {
  const res = await fetch(
    `${BASE_URL}?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,windspeed_10m,weathercode&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  

  const data: WeatherResponse = await res.json();
  data.city = "Berlin, Germany";
  return data;
};

const Weather: React.FC<WeatherProps> = ({
  weatherData,
  switchImperial,
  loadingWeather,
}) => {
  const [selectedDay, setSelectedDay] = useState("Today");

const defaultLat = 52.52;
const defaultLon = 13.41;

// if searched --> use that
const lat = weatherData?.latitude ?? defaultLat;
const lon = weatherData?.longitude ?? defaultLon;

const { data: berlinWeather, isLoading } = useQuery<WeatherResponse>({
  queryKey: ["weather", lat, lon],
  queryFn: () => fetchWeather(lat, lon),
  enabled: !!lat && !!lon,
  staleTime: 1000 * 60 * 5,
});


  const finalWeather: WeatherResponse | undefined =
    weatherData ?? berlinWeather;

  const showSkeleton = isLoading || loadingWeather;

  if (!finalWeather) {
    return null;
  }

  const currentTemp = finalWeather.current_weather.temperature;
  const feelsLike = finalWeather.hourly.apparent_temperature[0];
  const humidity = finalWeather.hourly.relative_humidity_2m[0];
  const wind = finalWeather.current_weather.windspeed;
  const precipitation = finalWeather.hourly.precipitation[0];

  const fahrenheit = ((feelsLike * 9) / 5 + 32).toFixed(0);
  const currentTemp2 = ((currentTemp * 9) / 5 + 32).toFixed(0);
  const windMph = (wind * 0.621371).toFixed(0);
  const precipitationIn = (precipitation * 0.0393701).toFixed(0);

  const getWeatherImage = (code: number) => {
    if (code === 0) return sunny;
    if ([1, 2, 3].includes(code)) return parialCloud;
    if ([45, 48].includes(code)) return fog;
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return rain;
    if ([71, 73, 75, 77, 85, 86].includes(code)) return snow;
    if ([95, 96, 99].includes(code)) return thunder;
    return overcast;
  };

  const today = new Date();

  const formattedDate = today
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .replace(/,/g, ", ");

  return (
    <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 xl:gap-10 md:justify-between xl:justify-around px-4 md:px-8 lg:px-10 xl:px-20 2xl:px-30 py-6 items-start">
      <div className="w-full flex flex-col gap-10 pb-5">
        {/* HEADER CARD */}
        {showSkeleton ? (
          <div className="w-full h-[250px] rounded-lg bg-gray-700 animate-pulse flex items-center">
            <div className="flex flex-wrap justify-between gap-4 items-center w-full px-3 sm:px-8 md:px-10">
              <div>
                <div className="h-6 w-32 bg-gray-500 rounded mb-2" />
                <div className="h-4 w-40 bg-gray-500 rounded" />
              </div>
              <div className="flex items-center justify-end gap-2">
                <div className="h-10 w-10 bg-gray-500 rounded-full" />
                <div className="h-6 w-12 bg-gray-500 rounded" />
              </div>
            </div>
          </div>
        ) : (
          <div
            className="w-full rounded-3xl bg-cover bg-center bg-no-repeat md:py-12 lg:py-16 h-[320px] flex items-center"
            style={{
              backgroundImage: `url(${
                window.innerWidth < 640 ? bgImage2 : bgImage
              })`,
            }}
          >
            <div className="flex flex-wrap flex-col sm:flex-row sm:justify-between gap-4 items-center w-full px-3 sm:px-8 md:px-10">
              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-3xl text-white">
                  {finalWeather.city}
                </h3>
                <p className="text-lg font-bold text-[hsl(250,6%,84%)]">
                  {formattedDate}
                </p>
              </div>

              <div className="flex items-center justify-end gap-4 sm:gap-6 md:gap-10">
                <img
                  src={getWeatherImage(
                    finalWeather.current_weather.weathercode
                  )}
                  className="w-24"
                />
                <h3 className="font-bold text-white text-8xl"
                 >
                  {switchImperial
                    ? `${currentTemp2}°`
                    : `${currentTemp.toFixed(0)}°`}
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* INFO CARDS */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 lg:gap-4 xl:gap-7">
          {showSkeleton ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-lg py-2 px-4 bg-[hsl(243,23%,30%)] w-full animate-pulse"
              >
                <div className="h-4 w-24 bg-gray-500 rounded mb-2" />
                <div className="h-6 w-16 bg-gray-500 rounded" />
              </div>
            ))
          ) : (
            <>
              <div className="py-3 py-4 md:py-6 rounded-xl flex flex-col items-start gap-2 px-2 ps-4 md:ps-6 lg:ps-3 2xl:ps-5 bg-[hsl(243,23%,24%)] text-white w-full border-2 border-[hsl(243,23%,30%)]">
                <p className="text-[hsl(250,6%,84%)] text-lg 2xl:text-xl">
                  Feels like
                </p>
                <p className="text-2xl">
                  {switchImperial
                    ? `${fahrenheit}°`
                    : `${feelsLike.toFixed(0)}°`}
                </p>
              </div>

              <div className="py-3 py-4 md:py-6 rounded-xl flex flex-col items-start gap-2 px-2 ps-4 md:ps-6 lg:ps-3 2xl:ps-5 bg-[hsl(243,23%,24%)] text-white w-full border-2 border-[hsl(243,23%,30%)]">
                <p className="text-[hsl(250,6%,84%)] text-lg 2xl:text-xl">
                  Humidity
                </p>
                <p className="text-2xl">{humidity}%</p>
              </div>

              <div className="py-3 py-4 md:py-6 rounded-xl flex flex-col items-start gap-2 px-2 ps-4 md:ps-6 lg:ps-3 2xl:ps-5 bg-[hsl(243,23%,24%)] text-white w-full border-2 border-[hsl(243,23%,30%)]">
                <p className="text-[hsl(250,6%,84%)] text-lg 2xl:text-xl">
                  Wind
                </p>
                <p className="text-2xl">
                  {switchImperial ? `${windMph} mph` : `${wind} km/h`}
                </p>
              </div>

              <div className="py-3 py-4 md:py-6 rounded-xl flex flex-col items-start gap-2 px-2 ps-4 md:ps-6 lg:ps-3 2xl:ps-5 bg-[hsl(243,23%,24%)] text-white w-full border-2 border-[hsl(243,23%,30%)]">
                <p className="text-[hsl(250,6%,84%)] text-lg 2xl:text-xl">
                  Percipitation
                </p>
                <p className="text-2xl">
                  {switchImperial
                    ? `${precipitationIn} in`
                    : `${precipitation} mm`}
                </p>
              </div>
            </>
          )}
        </div>

        {/* DAILY FORECAST */}
        <div>
          <h3 className="text-white py-5 text-xl font-bold">Daily forecast</h3>
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-7 gap-4">
            {showSkeleton
              ? Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-lg py-2 flex flex-col items-center px-4 bg-[hsl(243,23%,30%)] text-white"
                  >
                    <div className="h-5 w-10 bg-gray-500 rounded mb-2 animate-pulse" />
                    <div className="h-10 w-10 bg-gray-500 rounded-full mb-2 animate-pulse" />
                    <div className="flex gap-4">
                      <div className="h-4 w-6 bg-gray-500 rounded animate-pulse" />
                      <div className="h-4 w-6 bg-gray-500 rounded animate-pulse" />
                    </div>
                  </div>
                ))
              : finalWeather.daily.time.map((day, i) => (
                  <div
                    key={i}
                    className="rounded-xl py-3 w-full flex flex-col items-center px-2 bg-[hsl(243,23%,24%)] border-2 border-[hsl(243,23%,30%)] text-white"
                  >
                    <h5>
                      {new Date(day).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </h5>
                    <img
                      src={getWeatherImage(finalWeather.daily.weathercode[i])}
                      className="w-10 md:w-20"
                    />
                    <div className="flex gap-6">
                      <p className="text-white text-sm">
                        {switchImperial
                          ? `${(
                              (finalWeather.daily.temperature_2m_max[i] * 9) /
                                5 +
                              32
                            ).toFixed(0)}°`
                          : `${finalWeather.daily.temperature_2m_max[i].toFixed(
                              0
                            )}°`}
                      </p>
                      <p className="text-white text-sm">
                        {switchImperial
                          ? `${(
                              (finalWeather.daily.temperature_2m_min[i] * 9) /
                                5 +
                              32
                            ).toFixed(0)}°`
                          : `${finalWeather.daily.temperature_2m_min[i].toFixed(
                              0
                            )}°`}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* HOURLY */}
      <div className="bg-[hsl(243,27%,20%)] w-full xl:w-[540px] rounded-3xl p-5">
        <div className="flex justify-between items-center pb-3">
          <h3 className="text-white font-bold text-xl">Hourly forecast</h3>
          <HourlyDropdown
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />
        </div>

        <div className="custom-scrollbar flex flex-col gap-4 mt-2 max-h-[635px] overflow-y-auto pr-3">
          {showSkeleton
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
            : finalWeather.hourly.time
                .map((timeStr, idx) => ({ timeStr, idx }))
                .filter(({ timeStr }) => {
                  const date = new Date(timeStr);
                  const dayName = date.toLocaleDateString("en-US", {
                    weekday: "long",
                  });
                  const todayName = new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                  });

                  return selectedDay === "Today"
                    ? dayName === todayName
                    : dayName === selectedDay;
                })
                .map(({ timeStr, idx }) => {
                  const date = new Date(timeStr);

                  let hours = date.getHours();
                  const formattedTime =
                    hours === 0
                      ? "12 AM"
                      : hours < 12
                      ? `${hours} AM`
                      : hours === 12
                      ? "12 PM"
                      : `${hours - 12} PM`;

                  return (
                    <div
                      key={idx}
                      className="flex justify-between items-center border-2 border-[hsl(243,23%,30%)] bg-[hsl(243,23%,24%)] py-2 rounded-lg px-3 text-lg md:text-xl"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={getWeatherImage(
                            finalWeather.hourly.weathercode[idx]
                          )}
                          className="w-10"
                        />
                        <h3 className="font-normal text-white py-2">
                          {formattedTime}
                        </h3>
                      </div>

                      <h3 className="font-normal text-white py-2">
                        {switchImperial
                          ? `${(
                              (finalWeather.hourly.apparent_temperature[idx] *
                                9) /
                                5 +
                              32
                            ).toFixed(0)}°`
                          : `${finalWeather.hourly.apparent_temperature[
                              idx
                            ].toFixed(0)}°`}
                      </h3>
                    </div>
                  );
                })}
        </div>
      </div>
    </div>
  );
};

export default Weather;
