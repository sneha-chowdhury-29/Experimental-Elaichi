import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 bg-[#F8F6F0]/90 backdrop-blur-xl border-b border-[#1A1A1A] z-50" data-testid="main-navigation">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-['Cormorant_Garamond'] text-2xl font-bold italic text-[#386641]" data-testid="logo-link">
            Experimental Elaichi
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/" className="font-['Outfit'] text-sm font-bold uppercase tracking-wider hover:text-[#386641] transition-colors" data-testid="nav-home-link">
              Recipes
            </Link>
            
            {user && user.role === 'admin' && (
              <Link to="/admin" className="font-['Outfit'] text-sm font-bold uppercase tracking-wider hover:text-[#386641] transition-colors" data-testid="nav-admin-link">
                Admin
              </Link>
            )}
            
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-transparent border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F8F6F0] px-6 py-2 font-['Outfit'] font-bold text-sm tracking-wide transition-all"
                data-testid="logout-button"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-[#386641] text-white hover:bg-[#2B4F32] px-6 py-2 font-['Outfit'] font-bold text-sm tracking-wide transition-all"
                data-testid="login-button"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;