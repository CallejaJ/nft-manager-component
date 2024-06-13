import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { ethers } from "ethers";
import MintNFT from "./components/MintNFT";
import ViewNFTs from "./components/ViewNFTs";
import './App.css';

export default function App() {
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        console.log('Ethereum object found');
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            const network = await provider.getNetwork();
            setNetwork(network);
          } else {
            console.error('No accounts found');
          }
        } catch (error) {
          console.error("Error checking connection", error);
        }
      } else {
        console.error('window.ethereum is not defined');
        alert('Please install MetaMask');
      }
    };
    checkConnection();
  }, []);

  const connectWallet = async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        setAccount(accounts[0]);
        setNetwork(network);
      } catch (err) {
        console.error('Error connecting to wallet:', err);
      } finally {
        setIsConnecting(false);
      }
    } else {
      console.error('MetaMask is not installed');
      setIsConnecting(false);
    }
  };

  const switchToSepolia = async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: '0xaa36a7', // Chain ID de Sepolia en hexadecimal
            chainName: 'Sepolia Test Network',
            nativeCurrency: {
              name: 'SepoliaETH',
              symbol: 'SEP',
              decimals: 18
            },
            rpcUrls: ['https://rpc.sepolia.org'],
            blockExplorerUrls: ['https://sepolia.etherscan.io']
          }]
        });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        setNetwork(network);
      } catch (error) {
        console.error("Error switching to Sepolia", error);
      } finally {
        setIsConnecting(false);
      }
    } else {
      alert("Please install MetaMask");
      setIsConnecting(false);
    }
  };

  const handleConnectOrSwitch = async () => {
    if (!account) {
      await connectWallet();
    }
    if (network && network.chainId !== 11155111) { // Asegúrate de que el networkId sea el correcto para Sepolia
      await switchToSepolia();
    }
  };

  return (
    <Router>
      <div className="App">
        <nav className="App-nav">
          <ul>
            <li><Link to="/">Mint NFT</Link></li>
            <li><Link to="/view-nfts">View NFTs</Link></li>
          </ul>
          <button onClick={handleConnectOrSwitch} className="connect-button" disabled={isConnecting}>
            {account ? `Connected: ${account}` : "Connect Wallet"}
          </button>
        </nav>
        <Routes>
          <Route path="/" element={<MintNFT account={account} />} />
          <Route path="/view-nfts" element={<ViewNFTs />} />
        </Routes>
      </div>
    </Router>
  );
}
