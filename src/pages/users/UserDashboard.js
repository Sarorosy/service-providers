import React from 'react';
import RecentNotification from './RecentNotification';
import UpcomingHolidays from './UpcomingHolidays';
import MyWorkoffs from './MyWorkoffs';
import ManageWorkoffs from './ManageWorkoffs';

const UserDashboard = () => {
    return (
        
        <div className="row mt-20">
            <div className="col-md-6">
                <RecentNotification />
                
            </div>
            <div className="col-md-6">
                <UpcomingHolidays />
                
            </div>
            <div className="col-md-6 d-flex">
            <MyWorkoffs />
            </div>
            <div className="col-md-6 d-flex">
            <ManageWorkoffs />
            </div>
        </div>
    );
};

export default UserDashboard;
