import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // To navigate to the diet page
import "./Calendar.css";

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    generateCalendar(currentMonth);
  }, [currentMonth]);

  const generateCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    // Get the number of days in the month
    const numDays = new Date(year, month + 1, 0).getDate();
    const days: number[] = Array.from({ length: numDays }, (_, i) => i + 1);
    setDaysInMonth(days);
  };

  const handleDateClick = (day: number) => {
    // Navigate to the diet page with the selected date
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day+1);
    navigate(`/diet/${selectedDate.toISOString().split('T')[0]}`); // Format date as YYYY-MM-DD
  };

  return (
    <div className="calendar-container">
      <h2>{currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}</h2>
      <div className="calendar-grid">
        {daysInMonth.map(day => (
          <div key={day} className="calendar-cell" onClick={() => handleDateClick(day)}>
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;