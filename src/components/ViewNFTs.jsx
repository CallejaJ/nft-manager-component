import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "../CSS/ViewNFT.css";
import abi from "../abis/contractABI.json";

const contractAddress = "0xe1b9c0851A09DC26Ad6CadC18A8e5c82cDd30e80";

export default function ViewNFTs({ account, mintedNFTs = [] }) {
    const [nfts, setNfts] = useState([]);
    const [contract, setContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initContract = async () => {
            if (!window.ethereum) {
                console.error('Ethereum object not found');
                alert("Please install MetaMask");
                return;
            }
            if (!account) {
                console.error('Account not found');
                return;
            }
            try {
                console.log('Initializing provider...');
                const provider = new ethers.BrowserProvider(window.ethereum);
                setProvider(provider);
                const signer = await provider.getSigner();
                console.log('Signer:', signer);
                const tempContract = new ethers.Contract(contractAddress, abi, signer);
                setContract(tempContract);
                console.log('Contract set:', tempContract);
            } catch (error) {
                console.error('Error creating contract instance:', error);
            }
        };

        if (account) {
            initContract();
        }
    }, [account]);

    useEffect(() => {
        const fetchNFTs = async () => {
            if (contract && account) {
                try {
                    console.log('Fetching balance...');
                    const balance = await contract.balanceOf(account);
                    console.log(`Balance: ${balance.toString()}`);
                    const nftData = [];
                    for (let i = 0; i < balance; i++) {
                        try {
                            const tokenId = await contract.tokenOfOwnerByIndex(account, i);
                            console.log(`Token ID: ${tokenId.toString()}`);

                            // Buscar la imagen en mintedNFTs
                            const mintedNFT = mintedNFTs.find(nft => nft.tokenId === tokenId.toString());

                            nftData.push({
                                tokenId: tokenId.toString(),
                                image: mintedNFT ? mintedNFT.image : "https://via.placeholder.com/150"
                            });
                        } catch (innerError) {
                            console.error(`Error fetching token data for tokenId ${i}:`, innerError);
                        }
                    }
                    setNfts(nftData);
                } catch (error) {
                    console.error("Error fetching NFTs", error);
                    setError(`Error fetching NFTs: ${error.message}`);
                }
            }
        };

        if (contract && account) {
            fetchNFTs();
        }
    }, [contract, account, provider, mintedNFTs]);

    if (error) {
        return <div>Error fetching NFTs: {error}</div>;
    }

    return (
        <div className="ViewNFTs">
            <header className="ViewNFTs-header">
                {account ? (
                    <>
                        <h2>Your NFTs</h2>
                        <div className="nft-grid">
                            {nfts.length > 0 ? (
                                nfts.map((nft, index) => (
                                    <div key={index} className="nft-card">
                                        <img src={nft.image} alt={`NFT ${nft.tokenId}`} className="nft-image" />
                                        <p>Token ID: {nft.tokenId}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No NFTs found.</p>
                            )}
                        </div>
                    </>
                ) : (
                    <p>Please connect your wallet to view your NFTs.</p>
                )}
            </header>
        </div>
    );
}