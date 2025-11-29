// Add these imports at the top if not already
import React, { useState, useRef, useEffect } from "react";
import logo from "../../assets/images/logo.svg";
import units from "../../assets/images/icon-units.svg";
// import dropdown from "../../assets/images/icon-dropdown.svg";
import tick from "../../assets/images/icon-checkmark.svg";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

interface HeaderProps {
  switchImperial: boolean;
  setSwitchImperial: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ switchImperial, setSwitchImperial }) => {
  const [isOpen, setIsOpen] = useState(false);
  // const [temperature, setTemperature] = useState<"celsius" | "fahrenheit">("celsius");
  // const [wind, setWind] = useState<"km" | "mph">("km");
  // const [precipitation, setPrecipitation] = useState<"mm" | "inches">("mm");

  

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <div className="flex justify-between items-center px-4 py-2 md:px-20 md:py-10">
        <div className="w-[30vw] sm:w-[40vw]">
          <img src={logo} alt="Logo" />
        </div>

        {/* Dropdown button */}
        <div
          ref={buttonRef}
          className="flex gap-2 sm:gap-3 rounded px-2 py-1 sm:px-4 sm:py-2 items-center bg-[hsl(243,27%,20%)] hover:bg-[hsl(243,23%,30%)] cursor-pointer text-sm md:text-lg"
          onClick={() => setIsOpen(prev => !prev)}
        >
          <img src={units} className="w-[12px] sm:w-[15px] md:w-[18px]" alt="units" />
          <p className="text-white">Units</p>
          <ChevronDownIcon className={`w-4 text-white h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </div>

      {/* Dropdown content */}
      <div
        ref={dropdownRef}
        className={`overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 absolute right-4 md:right-20 md:top-24 z-50 w-[250px] bg-[hsl(243,27%,20%)] text-white p-2 rounded-lg transform transition-all duration-200 origin-top-right ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* Switch to Imperial */}
        {!switchImperial ? 
        <div className="cursor-pointer bg-[hsl(243,23%,30%)] px-2 py-1 rounded-md " onClick={() => setSwitchImperial(prev => !prev)}>
          Switch to Imperial
        </div>
        : <div className="cursor-pointer bg-[hsl(243,23%,30%)] px-2 py-1 rounded-md " onClick={() => setSwitchImperial(prev => !prev)}>
          Switch to Metric
        </div> }

        {/* Temperature */}
        <p className="p-2 text-[hsl(240,6%,70%)] text-sm">Temperature</p>
        <div
          // onClick={() => setTemperature("celsius")}
          className={`cursor-pointer px-2 rounded-md mb-1 py-1 flex justify-between w-full ${
            !switchImperial ? "bg-[hsl(243,23%,30%)]" : ""
          }`}
        >
          <p>Celcius (°C)</p>
          {!switchImperial && <img src={tick} alt="tick" />}
        </div>
        <div
          // onClick={() => setTemperature("fahrenheit")}
          className={`cursor-pointer px-2 rounded-md mb-1 py-1 flex justify-between w-full ${
            switchImperial ? "bg-[hsl(243,23%,30%)]" : ""
          }`}
        >
          <p>Fahrenheit (°F)</p>
          {switchImperial && <img src={tick} alt="tick" />}
        </div>

        <hr className="mt-3 border-[hsl(243,23%,30%)]" />

        {/* Wind Speed */}
        <p className="p-2 text-[hsl(240,6%,70%)] text-sm">Wind Speed</p>
        <div
          // onClick={() => setWind("km")}
          className={`cursor-pointer px-2 rounded-md mb-1 py-1 flex justify-between w-full ${
            !switchImperial ? "bg-[hsl(243,23%,30%)]" : ""
          }`}
        >
          <p>km/h</p>
          {!switchImperial && <img src={tick} alt="tick" />}
        </div>
        <div
          // onClick={() => setWind("mph")}
          className={`cursor-pointer px-2 rounded-md mb-1 py-1 flex justify-between w-full ${
            switchImperial ? "bg-[hsl(243,23%,30%)]" : ""
          }`}
        >
          <p>mph</p>
          {switchImperial && <img src={tick} alt="tick" />}
        </div>

        <hr className="mt-3 border-[hsl(243,23%,30%)]" />

        {/* Precipitation */}
        <p className="p-2 text-[hsl(240,6%,70%)] text-sm">Precipitation</p>
        <div
          // onClick={() => setPrecipitation("mm")}
          className={`cursor-pointer px-2 rounded-md mb-1 py-1 flex justify-between w-full ${
            !switchImperial ? "bg-[hsl(243,23%,30%)]" : ""
          }`}
        >
          <p>Millimeters (mm)</p>
          {!switchImperial && <img src={tick} alt="tick" />}
        </div>
        <div
          // onClick={() => setPrecipitation("inches")}
          className={`cursor-pointer px-2 rounded-md mb-1 py-1 flex justify-between w-full ${
            switchImperial ? "bg-[hsl(243,23%,30%)]" : ""
          }`}
        >
          <p>Inches (in)</p>
          {switchImperial && <img src={tick} alt="tick" />}
        </div>
      </div>
    </div>
  );
};

export default Header;
