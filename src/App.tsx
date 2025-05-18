import React, { useState } from 'react';
import { Copy, CheckCheck, Loader2 } from 'lucide-react';
import Generator from './components/Generator';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <Generator />
      </main>
      <Footer />
    </div>
  );
}

export default App;