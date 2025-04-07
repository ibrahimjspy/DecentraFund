import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useContractContext } from "../../context/ContractContext";
import { parseEther } from "ethers";
import {
  ArrowRightIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

const CampaignCard = ({ campaign, refreshCampaigns }) => {
  const { account, contracts, executeTx } = useContractContext();
  const [isDonating, setIsDonating] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleDonate = async () => {
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }
    if (!contracts.campaign) {
      setError("Contract not initialized");
      return;
    }

    try {
      const tx = await executeTx(contracts.campaign.contribute, [], {
        value: parseEther(donationAmount),
      });

      setDonationAmount("");
      refreshCampaigns();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDonating(false);
    }
  };

  return (
    <div
      className={`relative bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:border-indigo-300 transition-all duration-300 ${
        isHovered ? "transform hover:-translate-y-1 hover:shadow-lg" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Campaign Image */}
      <div className="h-48 w-full overflow-hidden">
        <img
          src={
            campaign.image.startsWith("/")
              ? campaign.image
              : `/assets/${campaign.image}`
          }
          onError={(e) => {
            e.target.src = "/assets/localart.jpg";
            e.target.onerror = null;
          }}
          alt={campaign.title}
          className="w-full h-full object-cover"
        />
      </div>
      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 w-full">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
          style={{
            width: `${Math.min(
              (campaign.currentAmount / campaign.goal) * 100,
              100
            )}%`,
          }}
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {campaign.title}
            </h3>
            <p className="text-gray-600 text-sm">{campaign.category}</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            {campaign.daysLeft} days left
          </span>
        </div>

        <p className="text-gray-700 mb-6 line-clamp-2">
          {campaign.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 font-medium">Raised</p>
            <p className="text-lg font-bold text-gray-900">
              {campaign.currentAmount} ETH
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 font-medium">Goal</p>
            <p className="text-lg font-bold text-gray-900">
              {campaign.goal} ETH
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="text-center mb-3">
            <Link
              to={`/campaigns/${campaign.id}`}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              View Details →
            </Link>
          </div>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              placeholder="0.00"
              className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              min="0.01"
              step="0.01"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500 sm:text-sm">ETH</span>
            </div>
          </div>

          <button
            onClick={handleDonate}
            disabled={isDonating}
            className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
              isDonating ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isDonating ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                Donate Now
                <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
