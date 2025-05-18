import React, { useState } from 'react';
import { Copy, CheckCheck, Loader2 } from 'lucide-react';
import { generateKey } from '../utils/keyGenerator';

const Generator: React.FC = () => {
  const [name, setName] = useState('');
  const [result, setResult] = useState<{ name: string; key: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const key = await generateKey(name.trim());
      setResult({
        name: name.trim(),
        key
      });
    } catch (err) {
      setError('Failed to generate key. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.key) {
      navigator.clipboard.writeText(result.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300">
      <div className="px-6 py-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Generate License Key</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Registered Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter any name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              disabled={loading}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
              loading || !name.trim() 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Generating...
              </span>
            ) : (
              'Generate Key'
            )}
          </button>
        </form>

        {result && (
          <div className="mt-8 space-y-4">
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Registered Name</h3>
                <p className="text-gray-900 font-medium">{result.name}</p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-medium text-gray-500">License Key</h3>
                  <button
                    onClick={copyToClipboard}
                    className="text-blue-600 hover:text-blue-800 focus:outline-none transition-colors text-sm flex items-center"
                  >
                    {copied ? (
                      <>
                        <CheckCheck className="h-4 w-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="text-gray-900 font-medium break-all">{result.key}</p>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              <h3 className="font-medium text-gray-700 mb-1">How to use:</h3>
              <ol className="list-decimal list-inside space-y-1">
                <li>Open Charles application</li>
                <li>Go to <span className="font-medium">Help &gt; Register Charles</span></li>
                <li>Enter the registered name and license key exactly as shown</li>
                <li>Click Register to activate Charles</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Generator;