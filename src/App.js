import React, { useState, useEffect } from 'react';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import axios from 'axios';

function App() {
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
    <div className="min-h-screen bg-black text-white">
      <header className="bg-[#1a1a1a] border-b border-zinc-800">
        <div className="max-w-7xl mx-auto">
          {!imageError.banner ? (
            <img 
              src="/deadstool-banner.jpg"
              alt="DEADSTOOL" 
              className="h-40 md:h-48 w-full mx-auto object-cover py-4"
              onError={() => handleImageError('banner')}
            />
          ) : (
            <h1 className="text-3xl font-bold text-center py-4">DEADSTOOL</h1>
          )}
        </div>
      </header>

      <main 
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
      </main>

      <footer className="bg-[#1a1a1a] border-t border-zinc-800 p-2.5 mt-6">
        <p className="text-center text-zinc-600 text-[11px] uppercase tracking-widest">© 2024 DEADSTOOL · Maximum Effort!</p>
      </footer>
    </div>
  );
}

export default App; 