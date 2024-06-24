import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import http from '../../../http';
import { useDispatch, useSelector } from 'react-redux';
import { setReservation } from '../../../redux/actions/libraryActions';

const localizer = momentLocalizer(moment);

const CustomToolbar = ({ onNavigate, label }) => {
  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={() => onNavigate('PREV')}>
          Back
        </button>
      </span>
      <span className="rbc-toolbar-label">{label}</span>
      <span className="rbc-btn-group">
        <button type="button" onClick={() => onNavigate('NEXT')}>
          Next
        </button>
      </span>
    </div>
  );
};

export default function AdminCalendar() {

// ========================== DISPLAY THE DATA FROM THE DATABASE CODES START HERE ==========================
  const reservations = useSelector(state => {
    console.log('Redux State:', state.allReservations.reservations);
    return state.allReservations.reservations;
  });
  const dispatch = useDispatch();

  const displayReservation = () => {
    http.get('reservations')
      .then(result => {
        console.log('API Result:', result.data);
        dispatch(setReservation(result.data.reservation));
      })
      .catch(error => {
        console.log('API Error:', error.message);
      });
  };

  useEffect(() => {
    displayReservation();
  }, []);

// ========================== DISPLAY THE DATA FROM THE DATABASE CODES END HERE ==========================

// ========================== DISPLAY RESERVATION TO THE CALENDAR CODES START HERE ==========================
  const filteredReservations = reservations.filter(reservation => reservation.Status === "Reserved" || reservation.Status === "Completed");

  const events = filteredReservations.map(reservation => ({
    title: `Reserved`,
    start: new Date(reservation.StartDate),
    end: new Date(reservation.EndDate),
    status: reservation.Status
  }));

  

  const Highlight = (event) => {
    let backgroundColor = '';
    if (event.status === 'Reserved') {
      backgroundColor = '#ad0404';
    } else if (event.status === 'Completed') {
      backgroundColor = '#ad0404';
    }

    return {
      style: {
        backgroundColor: 'Red',
        borderRadius: '0px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

// ========================== DISPLAY RESERVATION TO THE CALENDAR CODES END HERE ==========================
  return (
    <div id='CalendarMainDiv' className="container">
        <div id='CalendarTitle'>
            <h1>Resort Calendar</h1>
        </div>

        <div id='Calendar' className="container">
            <Calendar
                localizer={localizer}
                events={events}
                style={{ height: 500 }}
                components={{ toolbar: CustomToolbar }}
                eventPropGetter={Highlight}
            />
        </div>
    </div>
  );
}
