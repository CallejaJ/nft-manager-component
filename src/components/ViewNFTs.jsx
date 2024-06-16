import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "../CSS/ViewNFT.css";
import abi from "../abis/contractABI.json";

const contractAddress = "0x8E8382DE55fd90552DFf74C7Ea2D5FBFe2A5bE26";

export default function ViewNFTs() {
    const [nfts, setNfts] = useState([]);
    const [contract, setContract] = useState(null);

    useEffect(() => {
        const initContract = async () => {
            if (window.ethereum) {
                try {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const signer = provider.getSigner();
                    const tempContract = new ethers.Contract(contractAddress, abi, signer);
                    setContract(tempContract);
                    console.log('Contract set:', tempContract);
                } catch (error) {
                    console.error('Error creating contract instance:', error);
                }
            } else {
                alert('Please install MetaMask');
            }
        };

        initContract();
    }, []);

    useEffect(() => {
        const fetchNFTs = async () => {
            if (contract) {
                try {
                    const totalSupply = await contract.totalSupply();
                    const nftsArray = [];
                    for (let i = 0; i < totalSupply; i++) {
                        const tokenURI = await contract.tokenURI(i);
                        nftsArray.push({ id: i, uri: tokenURI });
                    }
                    setNfts(nftsArray);
                } catch (error) {
                    console.error('Error fetching NFTs:', error);
                }
            }
        };

        fetchNFTs();
    }, [contract]);

    return (
        <div className="ViewNFTs">
            <header className="ViewNFTs-header">
                <h1>Minted NFTs</h1>
                <div className="nft-list">
                    {nfts.map((nft) => (
                        <div key={nft.id} className="nft-item">
                            <img src={nft.uri} alt={`NFT ${nft.id}`} />
                            <p>ID: {nft.id}</p>
                        </div>
                    ))}
                </div>
            </header>
        </div>
    );
}
