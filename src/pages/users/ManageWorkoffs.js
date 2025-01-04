import React, { useState, useEffect } from 'react';
import { RevolvingDot } from 'react-loader-spinner';

const ManageWorkoffs = () => {
    const [workoffs, setWorkoffs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = sessionStorage.getItem('userId');
        fetch(`https://elementk.in/spbackend/api/manageworkoffs/first/${userId}`)
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
        <div className="card n-card round w-100">
            <div className='card-header'>
                <div className='d-flex align-items-center justify-content-between'>
                    <h4 className="card-title d-flex mb-0 font-bold align-items-center f-15">
                        Manage Workoffs
                    </h4>
                </div>
            </div>
            <div className="card-body">
                <div key={workoffs._id} className="">
                    
                    <div className="row">
                        <div className='col-md-4'>
                        <div className="p-4 items-center text-center bg-blue-100 text-blue-800 rounded-lg">
                            <div className="mb-2 w-full text-center">
                                Total
                            </div>
                            <span className="font-semibold text-2xl">{workoffs.fld_total_no_of_work_offs}</span>
                        </div>
                        </div>
                        <div className='col-md-4'>
                        <div className="p-4 items-center text-center bg-green-100 text-green-800 rounded-lg">
                            <div className="mb-2 w-full text-center">
                                Availed
                            </div>
                            <span className="font-semibold text-2xl">{workoffs.fld_work_offs_availed}</span>
                        </div>
                        </div>
                        <div className='col-md-4'>
                        <div className="p-4 items-center text-center bg-yellow-100 text-yellow-800 rounded-lg">
                            <div className="mb-2 w-full text-center">
                                Balance
                            </div>
                            <span className="font-semibold text-2xl">{workoffs.fld_work_offs_balance}</span>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageWorkoffs;
