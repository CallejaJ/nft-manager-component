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
                    console.log('Initializing provider...');
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    await provider.send("eth_requestAccounts", []);
                    const signer = await provider.getSigner();
                    console.log('Signer:', signer);
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
                    console.log('Total Supply:', totalSupply.toString());
                    const nftsArray = [];
                    for (let i = 0; i < totalSupply; i++) {
                        const tokenId = await contract.tokenByIndex(i);
                        const tokenURI = await contract.tokenURI(tokenId);
                        console.log('Token URI:', tokenURI);
                        nftsArray.push({ id: tokenId, uri: tokenURI });
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
                        <div key={nft.id.toString()} className="nft-item">
                            <img src={nft.uri} alt={`NFT ${nft.id.toString()}`} />
                            <p>ID: {nft.id.toString()}</p>
                        </div>
                    ))}
                </div>
            </header>
        </div>
    );
}
