import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/header/Header";
import Weather from "./components/weather/Weather";
import ApiError from "./components/ApiErrorState/ApiError";
import SearchBar from "./components/SearchBar/SearchBar";
const BASE_URL = import.meta.env.VITE_WEATHER_API;

function App() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [switchImperial, setSwitchImperial] = useState<boolean>(false);
  const [apiError, setApiError] = useState(false);

const checkWeatherAPI = async () => {
  try {
    const res = await fetch(
      `${BASE_URL}?latitude=52.52&longitude=13.41&current_weather=true`
    );

    if (!res.ok) throw new Error("API is down");
    return true;
  } catch (err) {
    console.error("API check failed:", err);
    return false;
  }
};
useEffect(() => {
  const checkApi = async () => {
    const isApiOk = await checkWeatherAPI();
    if (!isApiOk) {
      setApiError(true);
    }
  };

  checkApi();
}, []);



  return (
    <>
 
      <Header
        switchImperial={switchImperial}
        setSwitchImperial={setSwitchImperial}
      />

    
      {apiError ? (
        <ApiError onRetry={() => {!apiError ? setApiError(false): setApiError(true)}} />
      ) : (
        <>
          <SearchBar
            setWeatherData={setWeatherData}
            setLoadingWeather={setLoadingWeather}
            onError={() => setApiError(true)}
          />

          <Weather
            weatherData={weatherData}
            switchImperial={switchImperial}
            loadingWeather={loadingWeather}
            onError={() => setApiError(true)}
          />
        </>
      )}
    </>
  );
}

export default App;
