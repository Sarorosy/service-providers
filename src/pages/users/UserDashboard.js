import React from 'react';
import RecentNotification from './RecentNotification';
import UpcomingHolidays from './UpcomingHolidays';
import MyWorkoffs from './MyWorkoffs';
import ManageWorkoffs from './ManageWorkoffs';

const UserDashboard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="bg-white shadow-md rounded-lg p-4">
                <RecentNotification />
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
                <UpcomingHolidays />
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
                <MyWorkoffs />
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
                <ManageWorkoffs />
            </div>
        </div>
    );
};

export default UserDashboard;
