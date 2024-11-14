import React, { useState } from 'react';
import logo from '../assets/logo-elk.png';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading,  setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const loginData = {
      username,
      password,
    };
  
    try {
      setLoading(true);
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

          setTimeout(()=>{
             // Redirect or do something after successful login
              if(sessionStorage.getItem('adminType') == "SUPERADMIN"){
                navigate('/admindashboard');
              }else{
                navigate('/dashboard');
              }
          }, 2000)
       

      } else {
        console.error('Login failed:', data.message);
        toast.error("Login failed!");
      }
    } catch (error) {
      console.error('Error:', error);
    }finally{
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden ">
      
      

      {/* Gradient blob */}
      <div className=""></div>

      {/* Glassmorphism form card */}
      <div className="relative z-10 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg  p-8 w-full max-w-md mx-4 shadow-lg border rounded-md border-white border-opacity-30">
        <div className="text-center mb-4">
          <img
            src={logo} // Adjust the path as necessary
            alt="Service Providers Logo"
            className="mx-auto  bg-white mb-2"
            style={{  width: '150px' }}
          />
          <h2 className="text-3xl font-bold text-gray-800 f-20">Service Providers</h2>
          <p className="text-gray-600 mt-1 f-14">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="">
          <div>
            <label htmlFor="username" className="text-gray-700 f-13 f-w-600">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-control form-control-sm"
            />
          </div>
          <div className="mt-3 relative">
            <label htmlFor="password" className="text-gray-700">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control form-control-sm pr-10" // Padding right for icon space
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 focus:outline-none"
                style={{ cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="n-login-btn-set">
          <button
    type="submit"
    className="mt-4"
    disabled={loading}
>
    {loading ? (
        <svg
            className="animate-spin h-5 w-5 text-white mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l1.769 1.768A8.001 8.001 0 0112 20v-4a4 4 0 01-4-4H4v5.291z"
            ></path>
        </svg>
    ) : null}
    {loading ? "Signing In..." : "Sign In"}
    <i class="fa fa-chevron-circle-right ml-2" aria-hidden="true"></i>
</button>
          </div>

        </form>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full text-center pt-4  text-gray-600">
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
