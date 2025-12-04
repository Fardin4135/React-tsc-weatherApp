import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
// import sunny from "../../assets/images/icon-sunny.webp";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

// Add props interface
interface HourlyDropdownProps {
  selectedDay: string;
  setSelectedDay: Dispatch<SetStateAction<string>>;
}

const HourlyDropdown: React.FC<HourlyDropdownProps> = ({
  selectedDay,
  setSelectedDay,
}) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);
  const selectDay = (day: string) => {
    setSelectedDay(day);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block"  ref={buttonRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 bg-[hsl(243,23%,30%)] hover:bg-[hsl(243,23%,30%)] cursor-pointer text-white px-4 py-2 rounded-lg"
      >
        <span>{selectedDay}</span>
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-55  bg-[hsl(243,27%,20%)] rounded-lg border border-[hsl(243,23%,30%)] shadow-lg z-40 overflow-hidden" ref={dropdownRef}>
          {days.map((day) => (
            <div
              key={day}
              onClick={() => selectDay(day)}
              className="flex items-center gap-2 px-3 rounded-lg py-1 m-2 hover:bg-[hsl(243,23%,25%)] cursor-pointer"
            >
              {/* <img src={sunny} className="w-5" alt="" /> */}
              <span className="text-white">{day}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HourlyDropdown;
