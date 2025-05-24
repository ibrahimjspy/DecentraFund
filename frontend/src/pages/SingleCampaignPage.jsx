import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ethers, Contract, BrowserProvider } from 'ethers';
import AOS from 'aos';
import 'aos/dist/aos.css';

import CampaignABI from '../contracts/CrowdfundingCampaign.json';

export default function SingleCampaignPage() {
  const { address: campaignAddress } = useParams();

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [campaignContract, setCampaignContract] = useState(null);

  const [account, setAccount] = useState('');
  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState('');
  const [tierIndex, setTierIndex] = useState(0);
  const [countdown, setCountdown] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize AOS animation
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  // Connect to MetaMask
  const connect = useCallback(async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const newProvider = new BrowserProvider(window.ethereum);
        setProvider(newProvider);
        const newSigner = await newProvider.getSigner();
        setSigner(newSigner);
        setAccount(await newSigner.getAddress());
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  }, []);

  // Auto-connect if not already connected
  useEffect(() => {
    if (!account) {
      connect();
    }
  }, [account, connect]);

  // Set up contract when signer & address are available
useEffect(() => {
  if (signer) {
    try {
      const contract = new Contract(
        '0xCafac3dD18aC6c6e92c921884f9E4176737C052c' || campaignAddress, // <-- checksummed is hardcoded for testing
        CampaignABI.abi,
        signer,
      );
      setCampaignContract(contract);
      setMessage(''); // clear old error
      console.log('Campaign contract set:', contract);
    } catch (err) {
      setCampaignContract(null);
      setMessage('❌ Invalid contract address (bad checksum).');
      console.error('Error setting campaign contract:', err);
    }
  }
}, [signer]);


  // Fetch campaign data when contract is ready
  useEffect(() => {
    const fetchCampaign = async () => {
      if (!campaignContract) {
        return;
      }
      try {
        const [title, goal, raised, deadline] = await Promise.all([
          campaignContract.title(),
          campaignContract.goal(),
          campaignContract.totalRaised(),
          campaignContract.deadline(),
        ]);
        setCampaign({
          title,
          goal: ethers.formatEther(goal),
          raised: ethers.formatEther(raised),
          deadline: Number(deadline),
          deadlineDisplay: new Date(Number(deadline) * 1000).toLocaleString(),
        });
        setMessage('');
      } catch (err) {
        setCampaign(null);
        setMessage('❌ Could not fetch campaign data.');
        console.error('[fetchCampaign] Error:', err);
      }
    };
    fetchCampaign();
  }, [campaignContract]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (campaign?.deadline) {
        const diff = campaign.deadline - Math.floor(Date.now() / 1000);
        if (diff <= 0) setCountdown('Campaign Ended');
        else {
          const h = Math.floor(diff / 3600);
          const m = Math.floor((diff % 3600) / 60) % 60;
          const s = diff % 60;
          setCountdown(`${h}h ${m}m ${s}s`);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [campaign]);

  // Handle contribution
  const handleContribute = async () => {
    if (!campaignContract || !amount) return;
    try {
      setLoading(true);
      setMessage('⏳ Processing...');
      const tx = await campaignContract.contribute(tierIndex, {
        value: ethers.parseEther(amount),
      });
      await tx.wait();
      setMessage('✅ Contribution successful!');
      setAmount('');
      setTierIndex(0);
      // Refresh campaign data
      const [title, goal, raised, deadline] = await Promise.all([
        campaignContract.title(),
        campaignContract.goal(),
        campaignContract.totalRaised(),
        campaignContract.deadline(),
      ]);
      setCampaign({
        title,
        goal: ethers.formatEther(goal),
        raised: ethers.formatEther(raised),
        deadline: Number(deadline),
        deadlineDisplay: new Date(Number(deadline) * 1000).toLocaleString(),
      });
    } catch (err) {
      setMessage('❌ Transaction failed.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while contract is not set
  if (!campaignContract) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-700">
        ⏳ Loading campaign contract...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white p-10 shadow-md rounded-lg">
        <h1
          className="text-3xl font-bold mb-4 text-indigo-700"
          data-aos="fade-up"
        >
          {campaign?.title || 'Loading...'}
        </h1>

        {account ? (
          <p className="text-sm text-gray-500 mb-6">
            Connected Wallet: <span className="font-mono">{account}</span>
          </p>
        ) : (
          <button
            onClick={connect}
            className="mb-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
          >
            Connect Wallet
          </button>
        )}

        <div
          className="grid grid-cols-2 gap-4 text-gray-700 mb-8"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div>
            <p className="font-semibold">Goal:</p>
            <p>{campaign?.goal} ETH</p>
          </div>
          <div>
            <p className="font-semibold">Raised:</p>
            <p>{campaign?.raised} ETH</p>
          </div>
          <div>
            <p className="font-semibold">Deadline:</p>
            <p>{campaign?.deadlineDisplay}</p>
          </div>
          <div>
            <p className="font-semibold">Countdown:</p>
            <p
              className={
                countdown === 'Campaign Ended'
                  ? 'text-red-600'
                  : 'text-green-600'
              }
            >
              {countdown}
            </p>
          </div>
        </div>

        <div
          className="border-t border-gray-200 pt-6 mt-6"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <h2 className="text-xl font-semibold mb-4">Contribute ETH</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount (ETH)"
              className="border px-4 py-2 rounded w-full"
            />
            <input
              type="number"
              value={tierIndex}
              onChange={(e) => setTierIndex(parseInt(e.target.value))}
              placeholder="Tier Index"
              className="border px-4 py-2 rounded w-full"
            />
          </div>
          <button
            onClick={handleContribute}
            disabled={loading || countdown === 'Campaign Ended'}
            className={`mt-4 w-full py-3 px-6 rounded-lg text-white font-semibold ${
              loading || countdown === 'Campaign Ended'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Contributing...' : 'Contribute'}
          </button>
          {message && <p className="mt-3 text-sm text-center">{message}</p>}
        </div>
      </div>
    </div>
  );
}
