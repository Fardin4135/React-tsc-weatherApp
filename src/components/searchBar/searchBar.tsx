import { useEffect, useState } from "react";
import searchIcon from "../../assets/images/icon-search.svg";

interface LocationResult {
  name: string;
  country: string;
  country_code: string;
  latitude: number;
  longitude: number;
}

interface SearchBarProps {
  setWeatherData: (data: any) => void;
  setLoadingWeather: (value: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ setWeatherData,setLoadingWeather}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedLocation, setSelectedLocation] =
    useState<LocationResult | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setShowDropdown(true);

        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=10&language=en&format=json`,
          { signal: controller.signal }
        );

        const data = await res.json();
        setResults(data.results || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const handleSelect = (item: LocationResult) => {
    setQuery(`${item.name}, ${item.country}`);
    setSelectedLocation(item);
    setShowDropdown(false);
  };

  

  // ✅ UPDATED WEATHER API WITH EXTRA DATA
 const handleSearch = async () => {
  if (!selectedLocation) return;

  const { latitude, longitude, name, country } = selectedLocation;

  try {
    setLoadingWeather(true); // 🔵 start skeleton

    const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m,precipitation,apparent_temperature,windspeed_10m,weathercode&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto
`
    );

    const data = await res.json();

    // ✅ inject city name into data
    const fullData = {
      ...data,
      city: `${name}, ${country}`,
    };

    setWeatherData(fullData);

    // ✅ KEEP the city visible in input
    setQuery(`${name}, ${country}`);
  } catch (error) {
    console.error("Weather API Error:", error);
  } finally {
    setLoadingWeather(false); // 🔵 stop skeleton
    setResults([]);
    setShowDropdown(false);
  }
};


  return (
    <div className="px-4">
      <h1 className="text-white text-center text-4xl md:text-5xl xl:text-6xl py-5 sm:py-6 font-bricolage font-bold">
        How's the sky looking today?
      </h1>

      <div className="flex gap-2 justify-center items-center md:py-8 flex-wrap flex-col sm:flex-row">
        <div className="relative w-full sm:w-[40vw]">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a place..."
            className="w-full pl-10 pr-4 py-2 text-white rounded-md bg-[hsl(243,27%,20%)]
            focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <img
            src={searchIcon}
            alt="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
          />

          {showDropdown && (
            <div
              className="absolute top-full left-0 mt-2 w-full max-h-72 overflow-y-auto 
              rounded-xl bg-[#1f2937] shadow-2xl border border-white/10
              transition-all duration-200 ease-out"
            >
              {loading && (
                <div className="px-4 py-3 text-gray-300 text-sm animate-pulse">
                  Loading locations...
                </div>
              )}

              {!loading && results.length === 0 && (
                <div className="px-4 py-3 text-gray-400 text-sm">
                  No locations found
                </div>
              )}

              {!loading &&
                results.map((place, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelect(place)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-white cursor-pointer
                    hover:bg-[#374151] transition"
                  >
                    <img
                      src={`https://flagcdn.com/w40/${place.country_code.toLowerCase()}.png`}
                      className="w-6 h-4 object-cover rounded-sm"
                    />
                    <div>
                      <p className="font-medium">
                        {place.name}, {place.country}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSearch}
          className="px-4 w-full sm:w-[100px] md:w-[120px] py-2 bg-[hsl(233,67%,56%)] hover:bg-[hsl(248,70%,36%)] rounded-md text-white cursor-pointer"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
