import { Calendar1 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { RevolvingDot } from 'react-loader-spinner';

const UpcomingHolidays = () => {
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = sessionStorage.getItem('userId');
        fetch(`https://serviceprovidersback.onrender.comapi/holidays/user/${userId}`)
            .then(response => response.json())
            .then(data => {
                setHolidays(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching holidays:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <RevolvingDot color="#00BFFF" size={100} />;
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <div className="bg-purple-100 shadow-md rounded p-4 flex items-center">
                <Calendar1 className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                    <h2 className="text-xl font-bold">Upcoming Holidays</h2>
                    <p className="text-3xl">{holidays.length}</p>

                </div>
            </div>
            <ul className="space-y-2">
                {holidays.map(holiday => (
                    <li key={holiday._id} className="flex flex-col text-gray-800">
                        <div key={holiday._id} className="bg-purple-50 p-3 rounded mt-2 shadow-md">
                            <h3 className="text-lg font-semibold">{holiday.fld_title}</h3>
                            <p className="text-gray-600">
                                {/* Format the date correctly */}
                                {new Date(holiday.fld_holiday_date).toLocaleDateString()}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UpcomingHolidays;
