import { Calendar1 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { RevolvingDot } from 'react-loader-spinner';

const RecentNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = sessionStorage.getItem('userId');
        fetch(`https://serviceprovidersback.onrender.com/api/notifications/user/${userId}`)
            .then(response => response.json())
            .then(data => {
                setNotifications(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching notifications:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <RevolvingDot color="#00BFFF" size={100} />;
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Recent Notifications</h2>
            <ul className="space-y-2">
                {notifications.map(notification => (
                    <li key={notification._id} className="flex flex-col text-gray-800">
                        <div className="flex justify-between items-start">
                            <strong className="mr-2 text-blue-600">{notification.fld_title}</strong>
                            <span className="text-sm text-gray-600 flex items-center">
                                <Calendar1 className='mr-1 text-blue-600' />
                                Due Date: 
                                <span className="font-medium">
                                    {new Intl.DateTimeFormat('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                    }).format(new Date(notification.fld_due_date))}
                                </span>
                            </span>
                        </div>
                        <div
                            className="text-sm text-gray-700 mt-2"
                            dangerouslySetInnerHTML={{ __html: notification.fld_description }}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentNotification;
