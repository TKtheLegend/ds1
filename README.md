# Memecoin Dashboard

A modern, real-time dashboard for tracking memecoin statistics and social media updates.

## Features

- Real-time price tracking
- Market statistics (Market Cap, Volume, Price Change)
- Price history chart
- Live Twitter feed integration
- Responsive design
- Dark mode UI

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Configure your environment:
   - Create a `.env` file in the root directory
   - Add your coin API endpoint:
     ```
     REACT_APP_COIN_API_ENDPOINT=your_api_endpoint
     ```
   - Add your Twitter handle:
     ```
     REACT_APP_TWITTER_HANDLE=your_twitter_handle
     ```

4. Start the development server:
```bash
npm start
```

## Configuration

### Coin API
Replace `YOUR_COIN_API_ENDPOINT` in `App.js` with your actual coin API endpoint. The API response should include:
- price
- market_cap
- volume_24h
- price_change_24h

### Twitter Integration
Replace `YOUR_TWITTER_HANDLE` in `App.js` with your coin's Twitter handle.

## Technologies Used

- React
- TailwindCSS
- Chart.js
- React Twitter Embed
- Axios

## License

MIT License 