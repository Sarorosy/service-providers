import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const userId = sessionStorage.getItem('userId');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setErrorMessage('New Password and Confirm Password do not match');
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');

        try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    oldPassword,
                    newPassword,
                }),
            });

            if (!response.ok) {
                throw new Error('Old Password was wrong');
            } else {
                toast.success('Password updated successfully');
            }
        } catch (error) {
            toast.error(error.message);
            setErrorMessage('Failed to update password');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-20">
            <h2 className="text-2xl mb-4">Change Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4 relative">
                    <label htmlFor="oldPassword" className="block mb-2">Old Password</label>
                    <input
                        type={showOldPassword ? "text" : "password"}
                        id="oldPassword"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        className="border rounded p-2 w-full"
                    />
                    <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-2 top-10 text-gray-500"
                    >
                        {showOldPassword ? '🙈' : '👁️'}
                    </button>
                </div>
                <div className="mb-4 relative">
                    <label htmlFor="newPassword" className="block mb-2">New Password</label>
                    <input
                        type={showNewPassword ? "text" : "password"}
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="border rounded p-2 w-full"
                    />
                    <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-2 top-10 text-gray-500"
                    >
                        {showNewPassword ? '🙈' : '👁️'}
                    </button>
                </div>
                <div className="mb-4 relative">
                    <label htmlFor="confirmPassword" className="block mb-2">Confirm Password</label>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="border rounded p-2 w-full"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-10 text-gray-500"
                    >
                        {showConfirmPassword ? '🙈' : '👁️'}
                    </button>
                </div>
                {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
                <button
                    type="submit"
                    className={`bg-blue-600 text-white px-4 py-2 rounded-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Updating...' : 'Update Password'}
                </button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default ChangePassword;
