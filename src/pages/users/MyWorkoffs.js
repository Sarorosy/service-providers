import { Calendar1 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { RevolvingDot } from 'react-loader-spinner';

const MyWorkoffs = () => {
    const [workoffs, setWorkoffs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = sessionStorage.getItem('userId');
        fetch(`http://localhost:5000/api/workoffs/user/${userId}`)
            .then(response => response.json())
            .then(data => {
                setWorkoffs(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching workoffs:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <RevolvingDot color="#00BFFF" size={100} />;
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">My Workoffs</h2>
            <ul className="space-y-2">
                {workoffs && workoffs.length > 0 && workoffs.map(workoff => (
                    <li key={workoff._id} className="flex flex-col text-gray-800">
                        <div className="flex justify-between items-start">
                            <span className="text-sm text-gray-600 flex items-center">
                                <Calendar1 className='mr-1 text-blue-600' />
                                Workoff Date: 
                                <span className="font-medium">
                                    {new Intl.DateTimeFormat('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                    }).format(new Date(workoff.fld_start_date))}
                                </span>
                            </span>
                            
                        </div>
                        <strong className="mt-2 text-blue-600">{workoff.fld_reason}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyWorkoffs;
