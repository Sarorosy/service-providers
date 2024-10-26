import React, { useState } from 'react';
import logo from '../assets/logo-login.png';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const loginData = {
      username,
      password,
    };
  
    try {
      const response = await fetch('https://serviceprovidersback.onrender.com/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
  
      const data = await response.json();
      
  
      if (response.ok) {
        console.log('Login successful:', data);
        toast.success("Login Successfull!");
        sessionStorage.setItem('userId', data.user._id);
        sessionStorage.setItem('admin_id', data.user.id);
        sessionStorage.setItem('adminId', data.user.fld_adminid);
        sessionStorage.setItem('adminType', data.user.fld_admin_type);
        sessionStorage.setItem('username', data.user.fld_username);
        sessionStorage.setItem('name', data.user.fld_name);
        sessionStorage.setItem('email', data.user.fld_email);
        sessionStorage.setItem('profileImage', data.user.fld_profile_image);
        sessionStorage.setItem('phone', data.user.fld_phone);
        sessionStorage.setItem('gender', data.user.fld_gender);
        sessionStorage.setItem('marital', data.user.fld_marital);
        sessionStorage.setItem('address', data.user.fld_address);
        sessionStorage.setItem('designation', data.user.fld_designation);
        sessionStorage.setItem('aadhar', data.user.fld_aadhar);
        sessionStorage.setItem('bankName', data.user.fld_bankname);
        sessionStorage.setItem('accountNo', data.user.fld_accountno);
        sessionStorage.setItem('branch', data.user.fld_branch);
        sessionStorage.setItem('ifsc', data.user.fld_ifsc);
        sessionStorage.setItem('verify', data.user.fld_verify);
        sessionStorage.setItem('lastLogin', data.user.fld_last_login);
        sessionStorage.setItem('status', data.user.status);
        sessionStorage.setItem('aadharCard', data.user.fld_aadharcard);
        sessionStorage.setItem('panCard', data.user.fld_pancard);
        sessionStorage.setItem('cancelledChequeImage', data.user.fld_cancelledchequeimage);
        sessionStorage.setItem('startDate', data.user.fld_start_date);
        sessionStorage.setItem('endDate', data.user.fld_end_date);
        sessionStorage.setItem('totalWorkOffs', data.user.fld_total_work_offs);
        // Redirect or do something after successful login
        if(sessionStorage.getItem('adminType') == "SUPERADMIN"){
          navigate('/admindashboard');
        }else{
          navigate('/dashboard');
        }
      } else {
        console.error('Login failed:', data.message);
        toast.error("Login failed!");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#eafdff] via-[#cef8ee] to-[#defbff]">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)]">
        {Array.from({ length: 400 }).map((_, i) => (
          <div key={i} className="border-[1px] border-black/5"></div>
        ))}
      </div>

      {/* Gradient blob */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-sky-300 to-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>

      {/* Glassmorphism form card */}
      <div className="relative z-10 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg  p-8 w-full max-w-md mx-4 shadow-lg border border-white border-opacity-30">
        <div className="text-center mb-8">
          <img
            src={logo} // Adjust the path as necessary
            alt="Service Providers Logo"
            className="mx-auto  bg-white p-2 mb-4"
            style={{  height: '60px' }}
          />
          <h2 className="text-3xl font-bold text-gray-800">Service Providers</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="text-gray-700">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full mt-1 bg-white bg-opacity-50 border-0 focus:ring-2 focus:ring-sky-300 p-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 bg-white bg-opacity-50 border-0 focus:ring-2 focus:ring-sky-300 p-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 to-green-500 hover:from-sky-400 hover:to-green-400 text-white font-semibold py-2 px-4 rounded-md transition duration-300 shadow-md"
          >
            Sign In
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full text-center p-4 mt-8 text-gray-600">
        <p>&copy; {new Date().getFullYear()} Service Providers. All rights reserved.</p>
      </footer>

      {/* Custom animation for the gradient blob */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 20s infinite;
        }
      `}</style>
      <ToastContainer />
    </div>
  );
}
