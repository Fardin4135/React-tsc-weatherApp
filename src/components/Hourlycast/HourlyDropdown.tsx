import { useState, type Dispatch, type SetStateAction } from "react";
// import sunny from "../../assets/images/icon-sunny.webp";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

// Add props interface
interface HourlyDropdownProps {
  selectedDay: string;
  setSelectedDay: Dispatch<SetStateAction<string>>;
}

const HourlyDropdown: React.FC<HourlyDropdownProps> = ({ selectedDay, setSelectedDay }) => {
  const [isOpen, setIsOpen] = useState(false);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const toggleDropdown = () => setIsOpen(!isOpen);
  const selectDay = (day: string) => {
    setSelectedDay(day);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 bg-[hsl(243,23%,30%)] hover:bg-[hsl(243,23%,25%)] cursor-pointer text-white px-3 py-1 rounded-lg"
      >
        <span>{selectedDay}</span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-40 bg-[hsl(243,23%,30%)] rounded-lg shadow-lg z-10 overflow-hidden">
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
