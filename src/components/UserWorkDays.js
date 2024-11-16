import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useNavigate, useParams } from 'react-router-dom';
import { RevolvingDot } from 'react-loader-spinner'; // Import the loading spinner
import { ArrowLeftCircle, Calendar1, Clock4, LogIn, LogOut, RefreshCw,CircleX } from 'lucide-react';
import { motion } from 'framer-motion';


const UserWorkDays = ({ serviceProviderId, onClose }) => {
  const { id } = useParams(); // Get the service provider ID from the URL
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [sidebarDetails, setSidebarDetails] = useState({ inTime: '', outTime: '' }); // State for sidebar details
  const [loading, setLoading] = useState(true); // Loading state
  const [holidayDates, setHolidayDates] = useState([]);
  const [user, setUser] = useState(null);

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const date = new Date(`1970-01-01T${timeString}`);
    const options = { hour: '2-digit', minute: '2-digit', hour12: false }; // 24-hour format
    return date.toLocaleTimeString([], options); // Format the time
  };

  const fetchLoginHistories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/login-history/${serviceProviderId}`); // Fetch login histories for the user
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      // Group data by login date
      const groupedData = data.reduce((acc, entry) => {
        const date = entry.fld_login_date.split('T')[0]; // Get the date part only
        if (!acc[date]) acc[date] = [];
        acc[date].push(entry);
        return acc;
      }, {});

      const formattedEvents = Object.entries(groupedData).map(([date, entries]) => {
        const inTime = formatTime(entries[0].fld_start_time); // Format login time
        const outTime = formatTime(entries.reduce((latest, entry) => {
          return entry.fld_end_time && (!latest || entry.fld_end_time > latest) ? entry.fld_end_time : latest;
        }, null)); // Format logout time

        return {
          title: `In: ${inTime} Out: ${outTime ? outTime : 'N/A'}`, // Title without <br />
          start: date, // Use the date as the event start date
          allDay: true, // Set to true for all-day events
          entries: entries // Store entries for this date
        };
      }).filter(event => event.start); // Filter out events without a start date

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching login histories:', error);
    }
  };

  const fetchHolidays = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/holidays`);
      if (!response.ok) {
        throw new Error('Failed to fetch holidays');
      }
      const holidays = await response.json();


      const userHolidays = holidays.filter(holiday => {
        // Check if fld_userid is defined and is an array
        return Array.isArray(holiday.fld_userid) && holiday.fld_userid.includes(serviceProviderId);
      });

      // Map the holidays to a format suitable for FullCalendar
      const holidayEvents = userHolidays.map(holiday => ({
        title: holiday.fld_title,
        start: holiday.fld_holiday_date.split('T')[0], // Extract date part
        allDay: true,
        backgroundColor: '#007bff', // Blue background
        textColor: '#ffffff', // White text
      }));

      // Merge holidayEvents with existing events
      setEvents(prevEvents => {
        // Filter out any pre-existing holiday events to avoid duplication
        const nonHolidayEvents = prevEvents.filter(event => !holidayEvents.some(holiday => holiday.start === event.start));
        return [...nonHolidayEvents, ...holidayEvents]; // Merge and return updated events
      });

      // Extract holiday dates for internal state
      const holidayDatesArray = userHolidays.map(holiday => holiday.fld_holiday_date.split('T')[0]);
      setHolidayDates(holidayDatesArray);

    } catch (error) {
      console.error('Error fetching holidays:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };


  // Fetch user by ID
  const fetchUser = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/find/${serviceProviderId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      const userData = await response.json();
      setUser(userData); // Set the user data
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null); // Set user to null on error
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      await fetchLoginHistories();
      await fetchHolidays();
      await fetchUser();
    };
    fetchData();
  }, [serviceProviderId]);

  const handleDateClick = (arg) => {
    const clickedDate = arg.dateStr;
    const entries = events.find(event => event.start === clickedDate)?.entries || [];
    setSelectedDate(clickedDate);
    setSelectedEntries(entries);
  };

  const handleEventClick = (info) => {
    // Extract inTime and outTime from the event title
    const [inTime, outTime] = info.event.title.split(' Out: ');

    // Extract the date from the event (assuming it’s stored in a property like start or date)
    const eventDate = info.event.start; // or use info.event.date if that's where the date is stored

    // Set sidebar details including inTime, outTime, and formatted date
    setSidebarDetails({
      inTime: inTime.split('In: ')[1],
      outTime: outTime,
      date: eventDate.toLocaleDateString() // Format the date as needed
    });

    console.log('Event clicked:', info.event.title); // Debug: Check event click
    console.log('Selected Date:', eventDate); // Debug: Log the selected date
  };


  const calculateTotalWorkingHours = (inTime, outTime) => {
    if (inTime && outTime) {
      const startTime = new Date(`1970-01-01T${inTime}`);
      const endTime = new Date(`1970-01-01T${outTime}`);
      const totalHours = (endTime - startTime) / (1000 * 60 * 60); // Convert milliseconds to hours
      return totalHours.toFixed(2); // Return total hours with 2 decimal places
    }
    return 'N/A'; // If outTime is null, return 'N/A'
  };



  return (
    <motion.div
            // initial={{ x: '100%' }}
            // animate={{ x: 0 }}
            // exit={{ x: '100%' }}
            // transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full h-full p-6 fixed top-0 right-0 z-50 shadow-lg n-pop-up"
        >
    <div className="p-6 bg-white rounded-lg shadow-md h-auto wrk-of-wdt">
      <div className='flex justify-content-between mb-6'>
        <h1 className="text-xl font-bold mb-2 text-gray-800 flex items-center">
          {user ? (
            <>
              <img
                src={user.fld_profile_image && user.fld_profile_image !== ""
                  ? 'http://localhost:5000/uploads/profileimg/' + user.fld_profile_image
                  : "https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg"}
                alt={user.fld_username || 'No Name'}
                className="w-10 h-10 rounded-full border border-gray-200 mr-2" // Added margin to separate image and text
              />
              {user.fld_name} Work Days
            </>
          ) : 'Loading...'}
        </h1>
        <div className="flex justify-end items-center mb-3">
        <button
                            onClick={onClose}
                            className="text-white mr-2 "
                        >
                            <CircleX className='colorr' />
                        </button>

        </div>
      </div>

      <div className='flex n-popup-body wor-dy-pop-h'>
        <div className="flex-1">

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <RevolvingDot height="100" width="100" color="#3b82f6" ariaLabel="loading" />
            </div>
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin]}
              initialView="dayGridMonth"
              events={events}
              height="auto" // Set height to auto
              contentHeight="85vh" // Ensure it doesn't overflow the viewport
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              eventContent={(arg) => {
                // If event is a holiday, only show the title
                if (arg.event.title.startsWith('In:')) {
                  const [inTime, outTime] = arg.event.title.split(' Out: ');
                  return (
                    <div className="p-2">
                      <div>{inTime}</div>
                      <div>Out: {outTime}</div>
                    </div>
                  );
                }
                return (
                  <div className="brek">
                    <div>{arg.event.title}</div>
                  </div>
                );
              }}
              dateClick={handleDateClick} // Set date click handler here
              dayCellDidMount={(info) => {
                // Highlight Sundays with background color #adceff
                const day = info.date.getDay();
                if (day === 0) {
                  info.el.style.backgroundColor = '#adceff';
                }

              }}
              dayCellClassNames="border border-gray-200 hover:bg-gray-100 cursor-pointer" // Make cells clickable
              eventClick={handleEventClick} // Use event click handler
            />
          )}
        </div>
        <div className="w-1/4 ml-6 p-6 bggrey rounded mt-5">
          {selectedDate && (
            <>
              <h2 className="text-2xl font-semibold text-blue-800 mb-6">
                Details for {selectedDate}
              </h2>
              {selectedEntries.length > 0 ? (
                <div>
                  {selectedEntries.map((entry, index) => (
                    <div
                      key={index}
                      className="mb-4 p-4 bg-white rounded-md shadow-md"
                    >
                      <div className="text-lg">
                        <span className="font-semibold">Login Time:</span>{' '}
                        {entry.fld_start_time}
                      </div>
                      <div className="text-lg">
                        <span className="font-semibold">Logout Time:</span>{' '}
                        {entry.fld_end_time || 'N/A'}
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 p-4 bg-blue-200 rounded-md text-lg font-bold">
                    Total Working Hours: {calculateTotalWorkingHours(selectedEntries)}{' '}
                    hours
                  </div>
                </div>
              ) : (
                <div className="text-blue-700">No entries for this date.</div>
              )}
            </>
          )}
          {sidebarDetails.inTime && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-md "> {/* Fixed width */}
              {/* Display Date */}
              <div className="flex flex-col items-center mb-2">
                <div>
                  <Calendar1 className="dblue text-lg mr-1 mb-1" /> {/* Reduced icon size */}
                </div>
                <h2 className="text-md font-bold">
                  {sidebarDetails.date} {/* Ensure this is formatted correctly */}
                </h2>
              </div>

              {/* Login Time */}
              <div className="flex justify-center mb-2 text-sm">
                {/* <LogIn className="text-blue-600 text-lg mr-1" />  */}
                {/* Reduced icon size */}
                <span className="font-semibold">Login Time:</span>
                <span className="text-gray-700">{sidebarDetails.inTime}</span> {/* Added subtle color for clarity */}
              </div>

              {/* Logout Time */}
              <div className="flex justify-center mb-2 text-sm">
                {/* <LogOut className="text-blue-600 text-lg mr-1" /> */}
                {/* Reduced icon size */}
                <span className="font-semibold">Logout Time:</span>
                <span className="text-gray-700">{sidebarDetails.outTime || 'N/A'}</span> {/* Added subtle color for clarity */}
              </div>

              {/* Total Working Hours */}
              {sidebarDetails.outTime && (
                <div className="flex flex-col items-center text-sm font-bold mt-4 shadow-sm border border-gray-300 p-2 rounded-lg bg-gray-100">
                  <Clock4 className="dblue text-lg mr-1" /> {/* Reduced icon size */}
                  <span>Total Working Hours:</span>
                  <span className="ml-2">{calculateTotalWorkingHours(sidebarDetails.inTime, sidebarDetails.outTime)} hours</span>
                </div>
              )}
            </div>
          )}



        </div>
      </div>
    </div>
    </motion.div>
  );
};

export default UserWorkDays;
