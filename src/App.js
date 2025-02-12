import React, { useState, useEffect } from 'react';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import Typewriter from 'typewriter-effect';
import axios from 'axios';

// Home Component
function Home() {
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [coinData, setCoinData] = useState({
    price: 0,
    marketCap: 0,
    volume24h: 0,
    priceChange24h: 0,
  });

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
    
    // For very small numbers (less than 0.01), show more decimal places
    if (price < 0.01) {
      // Convert to string to avoid scientific notation
      const priceStr = price.toFixed(9);
      // Remove trailing zeros after decimal
      return '$' + parseFloat(priceStr).toString();
    }
    
    // For regular numbers, use standard formatting
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
                strings: ['Welcome to MemeVault.'],
                autoStart: true,
                loop: false,
                delay: 80,
                cursor: ''
              }}
              onInit={(typewriter) => {
                typewriter
                  .typeString('Welcome to MemeVault.')
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
          {/* Adding Telegram Button */}
          <div className="mt-8 overflow-hidden">
            <a
              href="https://t.me/+Lk-Z9dZIpr1jYmY5#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-zinc-800 hover:bg-zinc-700 transition-colors rounded-lg py-3 px-6 text-white animate-pulse-glow"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.015-.15-.056-.212s-.041-.041-.248-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.14.119.098.152.228.166.331.015.109.034.318.02.49z"/>
              </svg>
              <span className="font-semibold text-lg">Join our Telegram</span>
            </a>
          </div>
        </div>
      </div>

      {/* Cards Container */}
      <div className="flex flex-wrap justify-center gap-6 w-full px-4">
        {/* $WOLF Card */}
        <a 
          className="w-full max-w-md transform transition-transform duration-300 hover:scale-105 cursor-pointer relative"
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl z-10 flex items-center justify-center">
            <h2 className="text-2xl font-bold text-white tracking-wider">COMING SOON</h2>
          </div>
          <div className="bg-[#1a1a1a] rounded-lg border border-zinc-800 overflow-hidden animate-pulse-glow blur-lg">
            <div className="flex items-center justify-between border-b border-zinc-800">
              <h2 className="text-sm uppercase tracking-wider px-3 py-2 text-zinc-400 font-semibold">Live Stats</h2>
              <h2 className="text-sm uppercase tracking-wider px-3 py-2 text-zinc-200 font-semibold">$WOLF (STOOLVERINE)</h2>
            </div>
            <div className="flex items-stretch">
              <div className="w-32 border-r border-zinc-800/50">
                <img 
                  src="/images/wolf-stars.png" 
                  alt="Wolf" 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    console.error('Failed to load Wolf image');
                    e.target.src = '/deadstool-stars.png';
                  }}
                />
              </div>
              <div className="flex-1 pl-4">
                <div className="border-b border-zinc-800/50">
                  <div className="flex items-center px-3 py-2">
                    <h3 className="text-[11px] uppercase tracking-widest text-zinc-500 mr-auto">Price</h3>
                    <p className="text-base tracking-wide font-light">{formatPrice(coinData.price)}</p>
                  </div>
                </div>
                <div className="border-b border-zinc-800/50">
                  <div className="flex items-center px-3 py-2">
                    <h3 className="text-[11px] uppercase tracking-widest text-zinc-500 mr-auto">Market Cap</h3>
                    <p className="text-base tracking-wide font-light">{formatLargeNumber(coinData.marketCap)}</p>
                  </div>
                </div>
                <div className="border-b border-zinc-800/50">
                  <div className="flex items-center px-3 py-2">
                    <h3 className="text-[11px] uppercase tracking-widest text-zinc-500 mr-auto">All Time Volume</h3>
                    <p className="text-base tracking-wide font-light">{formatLargeNumber(coinData.volume24h)}</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center px-3 py-2">
                    <h3 className="text-[11px] uppercase tracking-widest text-zinc-500 mr-auto">24h Change</h3>
                    <p className={`text-base tracking-wide font-light ${coinData.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {coinData.priceChange24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a>

        {/* $DEADSTOOL Card */}
        <a 
          href="https://dexscreener.com/solana/3cc8hXHqZdvsbvw5azbLdk4Rxse1KERtL4HaquDVpump"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-md transform transition-transform duration-300 hover:scale-105 cursor-pointer"
        >
          <div className="bg-[#1a1a1a] rounded-lg border border-zinc-800 overflow-hidden animate-pulse-glow">
            <div className="flex items-center justify-between border-b border-zinc-800">
              <h2 className="text-sm uppercase tracking-wider px-3 py-2 text-zinc-400 font-semibold">Live Stats</h2>
              <h2 className="text-sm uppercase tracking-wider px-3 py-2 text-zinc-200 font-semibold">$DEADSTOOL</h2>
            </div>
            <div className="flex items-stretch">
              <div className="w-32 border-r border-zinc-800/50">
                <img src="/deadstool-stars.png" alt="Deadstool" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 pl-4">
                <div className="border-b border-zinc-800/50">
                  <div className="flex items-center px-3 py-2">
                    <h3 className="text-[11px] uppercase tracking-widest text-zinc-500 mr-auto">Price</h3>
                    <p className="text-base tracking-wide font-light">{formatPrice(coinData.price)}</p>
                  </div>
                </div>
                <div className="border-b border-zinc-800/50">
                  <div className="flex items-center px-3 py-2">
                    <h3 className="text-[11px] uppercase tracking-widest text-zinc-500 mr-auto">Market Cap</h3>
                    <p className="text-base tracking-wide font-light">{formatLargeNumber(coinData.marketCap)}</p>
                  </div>
                </div>
                <div className="border-b border-zinc-800/50">
                  <div className="flex items-center px-3 py-2">
                    <h3 className="text-[11px] uppercase tracking-widest text-zinc-500 mr-auto">All Time Volume</h3>
                    <p className="text-base tracking-wide font-light">{formatLargeNumber(coinData.volume24h)}</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center px-3 py-2">
                    <h3 className="text-[11px] uppercase tracking-widest text-zinc-500 mr-auto">24h Change</h3>
                    <p className={`text-base tracking-wide font-light ${coinData.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {coinData.priceChange24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a>
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
        </Routes>
        <footer className="bg-[#1a1a1a] border-t border-zinc-800 p-2.5 mt-6">
          <p className="text-center text-zinc-600 text-[11px] uppercase tracking-widest">© 2024 DEADSTOOL · Maximum Effort!</p>
        </footer>
      </div>
    </Router>
  );
}

export default App; 