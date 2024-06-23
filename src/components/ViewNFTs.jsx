import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "../CSS/ViewNFT.css";
import abi from "../abis/contractABI.json";
import nfticon from "../images/nft-icon-non-fungible-token-vector.jpg"

const contractAddress = "0xe1b9c0851A09DC26Ad6CadC18A8e5c82cDd30e80";

export default function ViewNFTs({ account, imageURLs }) {
    const [loading, setLoading] = useState(true);
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

            try {
                console.log('Fetching balance...');
                const balance = await contract.balanceOf(account);
                console.log(`Balance: ${balance.toString()}`);
                const nftData = [];

                for (let i = 0; i < balance; i++) {
                    try {
                        const tokenId = await contract.tokenOfOwnerByIndex(account, i);
                        console.log(`Token ID: ${tokenId.toString()}`);

                        nftData.push({
                            tokenId: tokenId.toString(),
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

        };

        if (contract && account) {
            fetchNFTs().finally(() => {
                setLoading(false);
            });
        }
    }, [contract, account, provider]);

    if (error) {
        return <div>Error fetching NFTs: {error}</div>;
    }

    if (loading) {
        return (
            <div className="ViewNFTs">
                <header className="ViewNFTs-header">
                    {account ? (
                        <>
                            <h3>Loading NFTs</h3>
                            <table className="nft-table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Token ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {nfts.length > 0 ? (
                                        nfts.map((nft, index) => {
                                            const imageIconURL = imageURLs[index] ?? nfticon;

                                            return (
                                                <tr key={index} className="nft-row">
                                                    <td><img src={imageIconURL} alt={`NFT ${nft.tokenId}`} className="nft-image-small" /></td>
                                                    <td className="token-id">{nft.tokenId}</td>
                                                </tr>
                                            )
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="2">...</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </>
                    ) : (
                        <p>Please connect your wallet to view your NFTs.</p>
                    )}
                </header>
            </div>
        )
    }

    return (
        <div className="ViewNFTs">
            <header className="ViewNFTs-header">
                {account ? (
                    <>
                        <h3>Your NFTs list</h3>
                        <table className="nft-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Token ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nfts.length > 0 ? (
                                    nfts.map((nft, index) => {
                                        const imageIconURL = imageURLs[index] ?? nfticon;

                                        return (
                                            <tr key={index} className="nft-row">
                                                <td><img src={imageIconURL} alt={`NFT ${nft.tokenId}`} className="nft-image-small" /></td>
                                                <td className="token-id">{nft.tokenId}</td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="2">No NFTs found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <p>Please connect your wallet to view your NFTs.</p>
                )}
            </header>
        </div>
    );
}