
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-indigo-700 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="font-bold text-xl">
          Daily Stain QC
        </Link>
        
        <div className="space-x-4">
          {user ? (
            <>
              <Link 
                to="/" 
                className={`${location.pathname === '/' ? 'underline' : ''} hover:text-indigo-200`}
              >
                Submit QC
              </Link>
              <Link 
                to="/stains" 
                className={`${location.pathname === '/stains' ? 'underline' : ''} hover:text-indigo-200`}
              >
                View All Stains
              </Link>
              <button 
                onClick={signOut} 
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
              >
                Sign Out
              </button>
              <span className="ml-2 text-sm opacity-80">({user.email})</span>
            </>
          ) : (
            <Link 
              to="/auth" 
              className="bg-indigo-500 px-3 py-1 rounded hover:bg-indigo-600 transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
