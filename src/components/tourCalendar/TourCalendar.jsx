import React, { useState } from "react";
import "./TourCalendar.css";

const tours = [
  {
    date: new Date(2025, 3, 25),
    title: "Batumi Tour",
    details: "Explore the beautiful coastal city.",
  },
  {
    date: new Date(2025, 3, 28),
    title: "Tbilisi Tour",
    details: "Discover the vibrant capital of Georgia.",
  },
  {
    date: new Date(2025, 4, 3),
    title: "Kazbegi Tour",
    details: "Witness the stunning Caucasus Mountains.",
  },
];

function TourCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const getTourOnDate = (year, month, day) => {
    return tours.find(
      (t) =>
        t.date.getFullYear() === year &&
        t.date.getMonth() === month &&
        t.date.getDate() === day
    );
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
    setSelectedDay(null); // Reset active day when changing month
    setSelectedDateInfo(null); // Optional: reset selected info too
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
    setSelectedDay(null);
    setSelectedDateInfo(null);
  };

  const handleDayClick = (year, month, day) => {
    setSelectedDay({ year, month, day });

    const clickedDate = new Date(year, month, day);
    const tourOnClickedDate = getTourOnDate(year, month, day);

    if (tourOnClickedDate) {
      setSelectedDateInfo({
        type: "tour",
        title: tourOnClickedDate.title,
        details: tourOnClickedDate.details,
      });
    } else {
      setSelectedDateInfo({
        type: "standard",
        date: clickedDate.toLocaleDateString(),
      });
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="empty-day"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const tourOnDay = getTourOnDate(year, month, day);
    const isTourDay = !!tourOnDay;
    const isActiveDay =
      selectedDay &&
      selectedDay.year === year &&
      selectedDay.month === month &&
      selectedDay.day === day;

    calendarDays.push(
      <div
        key={day}
        className={`day ${isTourDay ? "tour-day" : "standart_day"} ${
          isActiveDay ? "active_day" : ""
        }`}
        onClick={() => handleDayClick(year, month, day)}
      >
        <span>{day}</span>
        {tourOnDay && <h4 className="tour-title">{tourOnDay.title}</h4>}
      </div>
    );
  }

  return (
    <>
      <div className="upcoming">
        <h3>Upcoming</h3>
        <div className="handmade-calendar">
          <div className="calendar-header">
            <button onClick={prevMonth}>&laquo;</button>
            <h2>{`${monthNames[month]} ${year}`}</h2>
            <button onClick={nextMonth}>&raquo;</button>
          </div>
          <div className="calendar-grid">
            {dayNames.map((day) => (
              <div key={day} className="day-name">
                {day}
              </div>
            ))}
            {calendarDays}
          </div>
        </div>
      </div>

      {selectedDateInfo && selectedDateInfo.type === "tour" && (
        <div className="selected-date-info">
          <h3>{selectedDateInfo.title}</h3>
          <p>{selectedDateInfo.details}</p>
          <div className="book_from_calendar">
            <button>Join This Tour</button>
            <button>Book This Tour Out of Order</button>
          </div>
        </div>
      )}

      {selectedDateInfo && selectedDateInfo.type === "standard" && (
        <div className="selected-date-info">
          <h3>No Scheduled Tour</h3>
          <p>There is nothing scheduled for {selectedDateInfo.date}.</p>
          <div className="book_from_calendar">
            <button>Book This Day for Your Desired Tour</button>
          </div>
        </div>
      )}
    </>
  );
}

export default TourCalendar;
