import { useEffect, useState } from "react";
import searchIcon from "../../assets/images/icon-search.svg";

interface LocationResult {
  name: string;
  country: string;
  country_code?: string;
  latitude?: number;
  longitude?: number;
}

interface SearchBarProps {
  setWeatherData: (data: any) => void;
  setLoadingWeather: (value: boolean) => void;
  onError: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  setWeatherData,
  setLoadingWeather,
  onError,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);
  const [showEmptyPopup, setShowEmptyPopup] = useState(false);

  // Normalize text to remove accents/diacritics
  const normalizeText = (text: string) =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

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

        const normalizedResults = (data.results || []).map((r: LocationResult) => ({
          name: normalizeText(r.name || ""),
          country: normalizeText(r.country || ""),
          country_code: r.country_code || "",
          latitude: r.latitude || 0,
          longitude: r.longitude || 0,
        }));

        setResults(normalizedResults);
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

  const handleSearch = async () => {
    if (!query.trim()) {
      setShowEmptyPopup(true);
      setTimeout(() => setShowEmptyPopup(false), 3000);
      return;
    }

    let location = selectedLocation;

    // If user typed full city name manually, we still use the first dropdown match
    if (!location && query.trim()) {
      location = results.find(
        (res) => `${res.name}, ${res.country}`.toLowerCase() === query.toLowerCase()
      ) || null;
    }

    if (!location) return;

    const { latitude, longitude, name, country } = location;

    try {
      setLoadingWeather(true);

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m,precipitation,apparent_temperature,windspeed_10m,weathercode&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto`
      );

      if (!res.ok) {
        onError();
        throw new Error("API request failed");
      }

      const data = await res.json();

      const fullData = {
        ...data,
        city: `${name}, ${country}`,
      };

      setWeatherData(fullData);
      setQuery(`${name}, ${country}`);
    } catch (err) {
      console.error("Weather API Error:", err);
      onError();
    } finally {
      setLoadingWeather(false);
      setShowDropdown(false);
      setResults([]);
    }
  };

  return (
    <div className="px-4 relative">
     <h1
  className="text-white text-center text-4xl md:text-5xl xl:text-6xl py-5 sm:py-6 font-bricolage font-bold"
  style={{ fontFamily: "Bricolage Grotesque, DM Sans, sans-serif" }}
>
  How's the sky looking today?
</h1>


      {/* Empty input popup */}
      {showEmptyPopup && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 text-[0.5rem] sm:text-sm md:text-base rounded-md shadow-lg z-50 animate-pulse">
          Please enter the city name.
        </div>
      )}

      <div className="flex gap-2 justify-center items-center md:py-8 flex-wrap flex-col sm:flex-row">
        <div className="relative w-full sm:w-[40vw]">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a place..."
            className="w-full pl-10 pr-4 py-2 md:py-3 text-white rounded-md bg-[hsl(243,27%,20%)]
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
              rounded-xl bg-[hsl(243,27%,20%)] shadow-2xl border border-white/10
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
                    hover:bg-[hsl(243,23%,30%)] transition"
                  >
                    <img
                      src={
                        place.country_code
                          ? `https://flagcdn.com/w40/${place.country_code.toLowerCase()}.png`
                          : "https://via.placeholder.com/40x24?text=?"
                      }
                      className="w-6 h-4 object-cover rounded-sm"
                      alt={`${place.country} flag`}
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
          className="px-4 w-full sm:w-[100px] md:w-[120px] py-2 md:py-3 bg-[hsl(233,67%,56%)] hover:bg-[hsl(248,70%,36%)] rounded-md text-white cursor-pointer"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
