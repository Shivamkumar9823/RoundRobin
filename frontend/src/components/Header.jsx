import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-indigo-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-5">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            Coupon Distribution System
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
