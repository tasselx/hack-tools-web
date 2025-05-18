import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-4 px-6 text-center text-sm text-gray-500 border-t border-gray-200">
      <div className="max-w-4xl mx-auto space-y-2">
        <p>For educational purposes only. Not for commercial use.</p>
        <p className="text-red-600 font-medium">
          Disclaimer: This tool is provided strictly for educational and research purposes.
          Users are responsible for complying with all applicable laws and software licenses.
          We do not encourage or support software piracy.
        </p>
      </div>
    </footer>
  );
};

export default Footer;