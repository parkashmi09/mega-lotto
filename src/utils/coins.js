/**
 * Coins Data
 * List of all available coins with their properties
 * Matches the structure from jackopot/src/utils/coins.js
 */

const coins = [
  { id: 1, name: "Bitcoin", preffix: "BTC", image: "BTC.webp", min: "0.00008000", active: true, test: false, network: "BTC" },
  { id: 2, name: "Indian Rupees", preffix: "INR", image: "INR.webp", min: "1000", active: true, test: false, network: "UPI" },
  { id: 3, name: "Tether", preffix: "USDT", image: "USDT.webp", min: "5.00000000", active: true, test: false, network: "TRC-20" },
  { id: 4, name: "Ethereum", preffix: "ETH", image: "ETH.webp", min: "0.0050000", active: true, test: false, network: "ETH" },
  { id: 5, name: "Litcoin", preffix: "LTC", image: "LTC.webp", min: "0.2000", active: true, test: false, network: "LTC" },
  { id: 6, name: "TRON", preffix: "TRX", image: "TRON.webp", min: "140.00000", active: true, test: false, network: "TRX" },
  { id: 7, name: "Dogecoin", preffix: "DOGE", image: "DOGE.webp", min: "120.00000", active: true, test: false, network: "BSC" },
  { id: 8, name: "Cardano", preffix: "ADA", image: "ADA.webp", min: "25.00000000", active: true, test: false, network: "BSC" },
  { id: 9, name: "Ripple", preffix: "XRP", image: "XRP.webp", min: "25.00000000", active: true, test: false, network: "BSC" },
  { id: 10, name: "Binance", preffix: "BNB", image: "BNB.webp", min: "0.03", active: true, test: false, network: "BSC" },
  { id: 11, name: "Pax USD", preffix: "USDP", image: "USDP.webp", min: "1.00000000", active: true, test: false, network: "ERC-20" },
  { id: 12, name: "NEXO", preffix: "NEXO", image: "NEXO.png", min: "10.000000", active: true, test: false, network: "ERC-20" },
  { id: 13, name: "Maker", preffix: "MKR", image: "MKR.webp", min: "0.00200000", active: true, test: false, network: "ERC-20" },
  { id: 14, name: "TrueUSD", preffix: "TUSD", image: "TUSD.webp", min: "10.00000000", active: true, test: false, network: "ERC-20" },
  { id: 15, name: "USDC", preffix: "USDC", image: "USDC.webp", min: "10.00000000", active: true, test: false, network: "BSC" },
  { id: 16, name: "Binance USD", preffix: "BUSD", image: "BUSD.webp", min: "10.00000000", active: true, test: false, network: "BSC" },
  { id: 20, name: "Bitcoin Cash", preffix: "BCH", image: "BCH.webp", min: "0.750000", active: true, test: false, network: "BCH" },
  { id: 62, name: "PKR", preffix: "PKR", image: "PKR.webp", min: "0.00008000", active: true, test: false, network: "pkr" },
];

export default coins;
