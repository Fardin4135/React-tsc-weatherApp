
import { useState } from 'react';
import './App.css'
import Header from './components/header/Header'
import SearchBar from './components/searchBar/searchBar'
import Weather from './components/weather/Weather'

function App() {
 const [weatherData, setWeatherData] = useState<any>(null);
 const [loadingWeather, setLoadingWeather] = useState<boolean>(false);


  return (
    <>
  <Header/>
  <SearchBar setWeatherData={setWeatherData} setLoadingWeather={setLoadingWeather}  />
      
{loadingWeather && <Weather  weatherData={null}  />}
{!loadingWeather && weatherData && (
<Weather weatherData={weatherData}  />
)}

    </>
  )
}

export default App
