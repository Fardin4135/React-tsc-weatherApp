import { useState } from "react";
import "./App.css";
import Header from "./components/header/Header";
import Weather from "./components/weather/Weather";
import ApiError from "./components/ApiErrorState/ApiError";
import SearchBar from "./components/TMPbar/SearchBar";
// import SearchBar from './components/searchBar/searchBar'

function App() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [switchImperial, setSwitchImperial] = useState<boolean>(false);
  const [apiError, setApiError] = useState(false);

  if (apiError) {
    return <ApiError onRetry={() => setApiError(false)} />;
  }

  return (
    <>
      <Header
        switchImperial={switchImperial}
        setSwitchImperial={setSwitchImperial}
      />

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
  );
}

export default App;
