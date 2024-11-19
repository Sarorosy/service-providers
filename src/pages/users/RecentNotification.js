import { BellRing, Calendar1 } from 'lucide-react';
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
        <div className="card n-card round w-100">
            <div className='card-header'>
                <div className='d-flex align-items-center justify-content-between'>
                    <h4 className="card-title d-flex mb-0 font-bold align-items-center f-15">
                        <BellRing className="h-6 w-6 text-yellow-600 mr-3" />
                        Recent Notifications
                    </h4>
                    
                </div>
            </div>
            <div className="card-body rct-notify">
                {notifications.map(notification => (
                    <div className="card-list ">
                        <div className="item-list">
                            <div className="info-user">
                                <div key={notification._id} className="d-flex justify-content-between">
                                    <h4 className="mr-2 text-blue-600 f-12">{notification.fld_title}</h4>
                                    <div className="font-bold f-10 w-50 text-right">
                                        Due Date:<br></br>
                                        <span className="text-green-600 f-10">
                                            {new Intl.DateTimeFormat('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                            }).format(new Date(notification.fld_due_date))}
                                        </span>
                                    </div>
                                </div>
                            <div className="text-sm text-gray-700 mt-2" dangerouslySetInnerHTML={{ __html: notification.fld_description }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentNotification;
