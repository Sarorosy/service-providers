import { Calendar1 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { RevolvingDot } from "react-loader-spinner";

const UpcomingHolidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const locationId = sessionStorage.getItem("locationId");
    fetch(`https://serviceprovidersback.onrender.com/api/holidays/user/${locationId}`)
      .then((response) => response.json())
      .then((data) => {
        setHolidays(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching holidays:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <RevolvingDot color="#00BFFF" size={100} />;
  }

  return (
    <div className="card n-card round w-100">
      <div className="card-header">
        <div className="d-flex align-items-center justify-content-between">
          <h4 className="card-title d-flex mb-0 font-bold align-items-center f-15">
            <Calendar1 className="h-6 w-6 text-info mr-3" />
            Upcoming Holidays
          </h4>
          <div className="">
            <span className="badge badge-info f-11">{holidays.length}</span>
          </div>
        </div>
      </div>

      <div className="card-body rct-notify">
        {holidays.length > 0 ? (
          holidays.map((holiday) => (
            <div key={holiday._id} className="card-list">
              <div className="item-list">
                <div className="info-user">
                  <div className="d-flex justify-content-between bg-purple-50 p-3 rounded shadow-md">
                    <h4 className="mr-2 text-blue-600 f-14">
                      {holiday.fld_title}
                    </h4>
                    <p className="text-green-600 f-12 font-bold">
                      {new Date(holiday.fld_holiday_date).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No upcoming holidays</p>
        )}
      </div>
    </div>
  );
};

export default UpcomingHolidays;
