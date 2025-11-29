
import { useState } from 'react';
import './App.css'
import Header from './components/header/Header'
import SearchBar from './components/searchBar/searchBar'
import Weather from './components/weather/Weather'
import ApiError from './components/ApiErrorState/ApiError';

function App() {
 const [weatherData, setWeatherData] = useState<any>(null);
 const [loadingWeather, setLoadingWeather] = useState<boolean>(false);
 const [switchImperial,setSwitchImperial] = useState<boolean>(false);
 const [apiError, setApiError] = useState(false);


 if (apiError) {
    return <ApiError onRetry={() => setApiError(false)} />;
  }

  return (
    <>
  <Header switchImperial={switchImperial} setSwitchImperial={setSwitchImperial}/>
  <SearchBar setWeatherData={setWeatherData} setLoadingWeather={setLoadingWeather}  onError={() => setApiError(true)}  />
      
{loadingWeather && <Weather  weatherData={null} switchImperial={switchImperial} />}
{!loadingWeather && weatherData && (
<Weather weatherData={weatherData} switchImperial={switchImperial}  />
)}

    </>
  )
}

export default App
