import { Calendar1 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { RevolvingDot } from 'react-loader-spinner';

const UpcomingHolidays = () => {
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = sessionStorage.getItem('userId');
        fetch(`https://serviceprovidersback.onrender.com/api/holidays/user/${userId}`)
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
            <h2 className="text-lg font-semibold mb-4">Upcoming Holidays</h2>
            <ul className="space-y-2">
                {holidays.map(holiday => (
                    <li key={holiday._id} className="flex flex-col text-gray-800">
                        <div className="flex justify-between items-start">
                            <strong className="mr-2 text-blue-600">{holiday.fld_title}</strong>
                            <span className="text-sm text-gray-600 flex items-center">
                                <Calendar1 className='mr-1 text-blue-600' />
                                
                                <span className="font-medium">
                                    {new Intl.DateTimeFormat('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                    }).format(new Date(holiday.fld_holiday_date))}
                                </span>
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UpcomingHolidays;
