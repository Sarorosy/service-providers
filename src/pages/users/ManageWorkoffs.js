import React, { useState, useEffect } from 'react';
import { RevolvingDot } from 'react-loader-spinner';

const ManageWorkoffs = () => {
    const [workoffs, setWorkoffs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = sessionStorage.getItem('userId');
        fetch(`https://serviceprovidersback.onrender.comapi/manageworkoffs/first/${userId}`)
            .then(response => response.json())
            .then(data => {
                setWorkoffs(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching manage workoffs:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <RevolvingDot color="#00BFFF" size={100} />;
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Manage Workoffs</h2>
            <ul className="space-y-4">
    
        <li key={workoffs._id} className="text-gray-800 border-b pb-2">
            
            <div className="flex justify-between">
                <div className="flex flex-col items-center w-1/3 bg-blue-100 text-blue-800 rounded-lg">
                    <div className=" p-4  w-full text-center">
                        Total
                    </div>
                    <span className="font-semibold text-2xl">{workoffs.fld_total_no_of_work_offs}</span>
                </div>
                <div className="flex flex-col items-center w-1/3 bg-green-100 text-green-800 rounded-lg">
                    <div className=" p-4  w-full text-center">
                        Availed
                    </div>
                    <span className="font-semibold text-2xl">{workoffs.fld_work_offs_availed}</span>
                </div>
                <div className="flex flex-col items-center w-1/3 bg-yellow-100 text-yellow-800 rounded-lg">
                    <div className=" p-4  w-full text-center">
                        Balance
                    </div>
                    <span className="font-semibold text-2xl">{workoffs.fld_work_offs_balance}</span>
                </div>
            </div>
        </li>
    
</ul>

        </div>
    );
};

export default ManageWorkoffs;
