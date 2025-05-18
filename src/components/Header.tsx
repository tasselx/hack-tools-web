import React from 'react';
import { TerminalSquare } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <div className="max-w-4xl mx-auto flex items-center">
        <TerminalSquare className="h-6 w-6 text-blue-600 mr-2" />
        <h1 className="text-xl font-semibold text-gray-800">Charles Activation Code</h1>
      </div>
    </header>
  );
};

export default Header;