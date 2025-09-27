import React from 'react';

const Header = ({ onResubmit }) => {
    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Department of Motor Traffic</h1>
                    <p className="text-sm text-gray-600">Online Driving Licence Application</p>
                </div>
                <nav className="space-x-4 text-sm font-medium">
                    <a href="#" onClick={(e) => { e.preventDefault(); onResubmit(); }} className="text-gray-500 hover:text-gray-900">Logout</a>
                    <a href="#" className="text-gray-500 hover:text-gray-900">Check Status</a>
                    <a href="#" className="text-gray-500 hover:text-gray-900">Contact Us</a>
                </nav>
            </div>
        </header>
    );
};

export default Header;