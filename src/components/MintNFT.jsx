import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "../CSS/MintNFT.css";
import abi from "../abis/contractABI.json";

const contractAddress = "0x8E8382DE55fd90552DFf74C7Ea2D5FBFe2A5bE26";

export default function MintNFT({ account }) {
    const [contract, setContract] = useState(null);

    useEffect(() => {
        const initContract = async () => {
            if (window.ethereum && account) {
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
                if (!window.ethereum) {
                    console.error('Ethereum object not found');
                }
                if (!account) {
                    console.error('Account not found');
                }
            }
        };

        initContract();
    }, [account]);


    const getRandomImage = () => {
        return `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 1000)}`;
    };

    const mintNFT = async () => {
        if (contract && account) {
            try {
                console.log('Attempting to mint NFT...');
                const tx = await contract.mint(account);
                console.log('Transaction:', tx);
                await tx.wait();
                alert("NFT Minted!");
            } catch (error) {
                console.error("Error minting NFT", error);
                alert(`Error minting NFT: ${error.message}`);
            }
        } else {
            alert("Contract not initialized or account not connected.");
        }
    };

    return (
        <div className="MintNFT">
            <header className="MintNFT-header">
                {account ? (
                    <>
                        <div>
                            <img src={getRandomImage()} alt="NFT" className="nft-image" />
                        </div>
                        <button onClick={mintNFT} className="mint-button">Mint NFT</button>
                    </>
                ) : (
                    <p>Please connect your wallet to mint an NFT.</p>
                )}
            </header>
        </div>
    );
}
