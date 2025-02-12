import React, { useState, useEffect } from 'react';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import Typewriter from 'typewriter-effect';
import axios from 'axios';

// Dashboard Component (previously main content)
function Dashboard() {
  const [coinData, setCoinData] = useState({
    price: 0,
    marketCap: 0,
    volume24h: 0,
    priceChange24h: 0,
  });

  const [imageError, setImageError] = useState({
    banner: false,
    profile: false
  });

  const handleImageError = (type) => {
    console.error(`Failed to load ${type} image`);
    setImageError(prev => ({ ...prev, [type]: true }));
  };

  useEffect(() => {
    // Load Twitter widget script
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        // Fetch token data from DexScreener API
        const response = await axios.get(
          `https://api.dexscreener.com/latest/dex/tokens/3cc8hXHqZdvsbvw5azbLdk4Rxse1KERtL4HaquDVpump`
        );

        // Log raw response for debugging
        console.log('Raw API response:', response.data);

        // Get the first pair data (usually the most liquid one)
        const pairData = response.data.pairs?.[0];

        if (!pairData) {
          throw new Error('Token pair data not found');
        }

        setCoinData({
          price: parseFloat(pairData.priceUsd) || 0,
          marketCap: parseFloat(pairData.fdv) || 0, // Using FDV (Fully Diluted Valuation)
          volume24h: parseFloat(pairData.volume.h24) || 0,
          priceChange24h: parseFloat(pairData.priceChange.h24) || 0
        });

        // Log processed data
        console.log('Processed pair data:', pairData);

      } catch (error) {
        console.error('Error fetching token data:', error);
        // Log the full error and response data for debugging
        console.log('Detailed error:', {
          message: error.message,
          responseData: error.response?.data,
          status: error.response?.status,
          rawError: error
        });
      }
    };

    fetchCoinData();
    // Update every 3 seconds
    const interval = setInterval(fetchCoinData, 3000);

    return () => clearInterval(interval);
  }, []);

  // Format number to handle very small values with more precision
  const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) return '$0.00';
    if (price < 0.00001) {
      return `$${price.toExponential(6)}`;
    }
    if (price < 1) {
      return price.toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 8,
        maximumFractionDigits: 8
      });
    }
    return price.toLocaleString(undefined, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
  };

  // Format market cap and volume to use K, M, B suffixes
  const formatLargeNumber = (num) => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(2)}B`;
    }
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen relative">
      <div 
        className="min-h-screen relative"
        style={{
          backgroundImage: 'url("/deadstool-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/80"></div>
        <div className="container mx-auto px-4 py-6 max-w-4xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
            <div className="space-y-6">
              {/* Deadpool Image */}
              <div className="bg-[#1a1a1a] rounded border border-zinc-800">
                <div className="p-4">
                  {!imageError.profile ? (
                    <img 
                      src="/deadstool-stars.png"
                      alt="Deadpool" 
                      className="w-full rounded"
                      onError={() => handleImageError('profile')}
                    />
                  ) : (
                    <div className="w-full aspect-square bg-[#141414] rounded flex items-center justify-center">
                      <p className="text-zinc-600">Image Loading Error</p>
                    </div>
                  )}
                  <h2 className="text-2xl font-semibold tracking-wider text-center mt-3 text-zinc-200">$DEADSTOOL</h2>
                </div>
              </div>

              {/* Coin Statistics */}
              <div className="bg-[#1a1a1a] rounded border border-zinc-800">
                <h2 className="text-sm uppercase tracking-wider p-3 text-zinc-400 font-semibold border-b border-zinc-800">Live Stats</h2>
                <div>
                  <div className="border-b border-zinc-800/50">
                    <div className="flex justify-between items-center px-3 py-2.5">
                      <h3 className="text-[11px] uppercase tracking-widest text-zinc-500">Price</h3>
                      <p className="text-base tracking-wide font-light">{formatPrice(coinData.price)}</p>
                    </div>
                  </div>
                  <div className="border-b border-zinc-800/50">
                    <div className="flex justify-between items-center px-3 py-2.5">
                      <h3 className="text-[11px] uppercase tracking-widest text-zinc-500">Market Cap</h3>
                      <p className="text-base tracking-wide font-light">{formatLargeNumber(coinData.marketCap)}</p>
                    </div>
                  </div>
                  <div className="border-b border-zinc-800/50">
                    <div className="flex justify-between items-center px-3 py-2.5">
                      <h3 className="text-[11px] uppercase tracking-widest text-zinc-500">24h Volume</h3>
                      <p className="text-base tracking-wide font-light">{formatLargeNumber(coinData.volume24h)}</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center px-3 py-2.5">
                      <h3 className="text-[11px] uppercase tracking-widest text-zinc-500">24h Change</h3>
                      <p className={`text-base tracking-wide font-light ${coinData.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {coinData.priceChange24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Telegram Link */}
              <div className="bg-[#1a1a1a] rounded border border-zinc-800">
                <div className="p-4">
                  <a
                    href="https://t.me/+Lk-Z9dZIpr1jYmY5#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 bg-[#1a5c7e] hover:bg-[#1d6b93] transition-colors rounded py-3 px-4"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.015-.15-.056-.212s-.041-.041-.248-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.14.119.098.152.228.166.331.015.109.034.318.02.49z"/>
                    </svg>
                    <span className="font-semibold text-lg">Join our Telegram Community</span>
                  </a>
                </div>
              </div>

              {/* Twitter Feed */}
              <div className="bg-[#1a1a1a] rounded border border-zinc-800">
                <h2 className="text-sm uppercase tracking-wider p-3 text-zinc-400 font-semibold border-b border-zinc-800">Latest Updates</h2>
                <div className="h-[425px] overflow-hidden bg-[#1a1a1a]">
                  <TwitterTimelineEmbed
                    sourceType="profile"
                    screenName="deadstool__"
                    options={{
                      height: 425,
                      theme: 'dark',
                      dnt: true,
                      cards: 'hidden'
                    }}
                    placeholder="Loading Timeline..."
                    autoHeight={false}
                    theme="dark"
                    borderColor="#27272a"
                    noScrollbar
                    transparent
                    key="deadstool-timeline"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Home Component
function Home() {
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [coinData, setCoinData] = useState({
    price: 0,
    marketCap: 0,
    volume24h: 0,
    priceChange24h: 0,
  });

  const handleImageError = () => {
    console.error('Failed to load profile image');
    setImageError(true);
  };

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const response = await axios.get(
          `https://api.dexscreener.com/latest/dex/tokens/3cc8hXHqZdvsbvw5azbLdk4Rxse1KERtL4HaquDVpump`
        );
        const pairData = response.data.pairs?.[0];
        if (pairData) {
          setCoinData({
            price: parseFloat(pairData.priceUsd) || 0,
            marketCap: parseFloat(pairData.fdv) || 0,
            volume24h: parseFloat(pairData.volume.h24) || 0,
            priceChange24h: parseFloat(pairData.priceChange.h24) || 0
          });
        }
      } catch (error) {
        console.error('Error fetching token data:', error);
      }
    };

    fetchCoinData();
    const interval = setInterval(fetchCoinData, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) return '$0.00';
    if (price < 0.00001) {
      return `$${price.toExponential(6)}`;
    }
    if (price < 1) {
      return price.toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 8,
        maximumFractionDigits: 8
      });
    }
    return price.toLocaleString(undefined, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
  };

  const formatLargeNumber = (num) => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(2)}B`;
    }
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center -mt-16">
      <div className="text-center space-y-8 mb-16">
        <div className="space-y-6">
          <div className="text-2xl md:text-3xl font-bold text-white">
            <Typewriter
              options={{
                strings: ['Welcome to Meme Syndicate'],
                autoStart: true,
                loop: false,
                delay: 80,
                cursor: ''
              }}
              onInit={(typewriter) => {
                typewriter
                  .typeString('Welcome to Meme Syndicate')
                  .callFunction(() => {
                    setShowSubtitle(true);
                  })
                  .start();
              }}
            />
          </div>
          {showSubtitle && (
            <div className="text-lg md:text-xl text-zinc-300">
              <Typewriter
                options={{
                  strings: ['the first-ever meme media launchpad'],
                  autoStart: true,
                  loop: false,
                  delay: 50,
                  cursor: ''
                }}
                onInit={(typewriter) => {
                  typewriter
                    .typeString('the first-ever meme media launchpad')
                    .start();
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Coin Card */}
      <div className="w-full max-w-4xl px-4">
        <div className="bg-[#1a1a1a] rounded-lg border border-zinc-800 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_300px]">
            {/* Stats Section */}
            <div>
              <h2 className="text-sm uppercase tracking-wider p-3 text-zinc-400 font-semibold border-b border-zinc-800">Live Stats</h2>
              <div>
                <div className="border-b border-zinc-800/50">
                  <div className="flex justify-between items-center px-3 py-2.5">
                    <h3 className="text-[11px] uppercase tracking-widest text-zinc-500">Price</h3>
                    <p className="text-base tracking-wide font-light">{formatPrice(coinData.price)}</p>
                  </div>
                </div>
                <div className="border-b border-zinc-800/50">
                  <div className="flex justify-between items-center px-3 py-2.5">
                    <h3 className="text-[11px] uppercase tracking-widest text-zinc-500">Market Cap</h3>
                    <p className="text-base tracking-wide font-light">{formatLargeNumber(coinData.marketCap)}</p>
                  </div>
                </div>
                <div className="border-b border-zinc-800/50">
                  <div className="flex justify-between items-center px-3 py-2.5">
                    <h3 className="text-[11px] uppercase tracking-widest text-zinc-500">24h Volume</h3>
                    <p className="text-base tracking-wide font-light">{formatLargeNumber(coinData.volume24h)}</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center px-3 py-2.5">
                    <h3 className="text-[11px] uppercase tracking-widest text-zinc-500">24h Change</h3>
                    <p className={`text-base tracking-wide font-light ${coinData.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {coinData.priceChange24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Image Section */}
            <div className="bg-[#141414] p-4 flex flex-col items-center justify-center border-l border-zinc-800 md:border-l md:border-t-0 border-t">
              <div className="w-48 h-48 rounded-lg overflow-hidden">
                <img 
                  src="/deadstool-stars.png"
                  alt="Deadstool" 
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
              <h2 className="text-2xl font-semibold tracking-wider text-center mt-3 text-zinc-200">$DEADSTOOL</h2>
              <a
                href="https://t.me/+Lk-Z9dZIpr1jYmY5#"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center space-x-2 bg-[#1a5c7e] hover:bg-[#1d6b93] transition-colors rounded py-2 px-4 w-full"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.015-.15-.056-.212s-.041-.041-.248-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.14.119.098.152.228.166.331.015.109.034.318.02.49z"/>
                </svg>
                <span className="font-medium">Join Community</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Navigation Component
function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="bg-[#1a1a1a] border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Hamburger Menu */}
          <div className="flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 rounded-md hover:bg-zinc-800"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/' ? 'text-white bg-zinc-800' : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
              }`}
            >
              HOME
            </Link>
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/dashboard' ? 'text-white bg-zinc-800' : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
              }`}
            >
              DEADSTOOL
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        <Transition
          show={isOpen}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/' ? 'text-white bg-zinc-800' : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                }`}
                onClick={() => setIsOpen(false)}
              >
                HOME
              </Link>
              <Link
                to="/dashboard"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/dashboard' ? 'text-white bg-zinc-800' : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                }`}
                onClick={() => setIsOpen(false)}
              >
                DEADSTOOL
              </Link>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <footer className="bg-[#1a1a1a] border-t border-zinc-800 p-2.5 mt-6">
          <p className="text-center text-zinc-600 text-[11px] uppercase tracking-widest">© 2024 DEADSTOOL · Maximum Effort!</p>
        </footer>
      </div>
    </Router>
  );
}

export default App; 