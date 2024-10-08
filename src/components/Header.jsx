import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {

  const [activeButton, setActiveButton] = useState('UPLOAD');
  const navigate = useNavigate(); 


  const handleNavigation = (button, path) => {
    setActiveButton(button); 
    navigate(path); 
  };

  return (
    <header className="bg-gray-100 shadow-md">
      {/* Top Bar */}
      <div className="flex justify-between items-center py-2 px-4 bg-white">
        <div className="text-lg font-bold text-black">Telamon</div>
      </div>
      
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center bg-blue-800 py-2 px-4">
        <div className="flex space-x-16">
          <button
            onClick={() => handleNavigation('UPLOAD', '/')}
            className={`${
              activeButton === 'UPLOAD' ? 'bg-white text-black' : 'text-white'
            } font-semibold py-1 px-4 rounded transition-colors duration-300`}
          >
            UPLOAD
          </button>
          
          {/* <button
            onClick={() => handleNavigation('ANNOTATE', '/dimensionless_img')}
            className={`${
              activeButton === 'ANNOTATE' ? 'bg-white text-black' : 'text-white'
            } font-semibold py-1 px-4 rounded transition-colors duration-300`}
          >
            ANNOTATE
          </button> */}
          
          <button
            onClick={() => handleNavigation('BILL', '/bill')}
            className={`${
              activeButton === 'BILL' ? 'bg-white text-black' : 'text-white'
            } font-semibold py-1 px-4 rounded transition-colors duration-300`}
          >
            BILL
          </button>
          <button
            onClick={() => handleNavigation('TABLE', '/table')}
            className={`${
              activeButton === 'TABLE' ? 'bg-white text-black' : 'text-white'
            } font-semibold py-1 px-4 rounded transition-colors duration-300`}
          >
            TABLE
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
