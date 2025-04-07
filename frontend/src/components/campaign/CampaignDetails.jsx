import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContractContext } from "../../context/ContractContext";
import { parseEther, formatEther } from "ethers";
import { EscrowState } from "../../utils/enums";
import ProgressBar from "../common/ProgressBar";
import {
  ArrowLeftIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserIcon,
  CheckIcon,
  XIcon,
} from "@heroicons/react/24/outline";

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    account,
    contracts,
    executeTx,
    getEscrowStatus,
    getEscrowBalance,
    getRequiredApprovals,
    getCurrentApprovals,
    isApprover,
    depositToEscrow,
    requestFundsRelease,
    approveFundsRelease,
    releaseFunds,
    claimRefund,
  } = useContractContext();
  const [campaign, setCampaign] = useState(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDonating, setIsDonating] = useState(false);
  const [escrow, setEscrow] = useState({
    status: null,
    balance: null,
    requiredApprovals: null,
    currentApprovals: null,
    isUserApprover: false,
    isLoading: false,
  });
  const [withdrawRequest, setWithdrawRequest] = useState({
    description: "",
    amount: "",
    recipient: "",
  });
  const [isCreatingRequest, setIsCreatingRequest] = useState(false);

  const fetchCampaignAndEscrowData = useCallback(async () => {
    try {
      if (!contracts.factory) {
        throw new Error("Contract not initialized");
      }

      const campaignData = await contracts.factory.getCampaign(id);
      setCampaign({
        id,
        title: campaignData.title,
        description: campaignData.description,
        image: campaignData.image || "/assets/localart.jpg",
        goal: formatEther(campaignData.goal),
        currentAmount: formatEther(campaignData.currentAmount),
        deadline: new Date(campaignData.deadline * 1000).toLocaleDateString(),
        owner: campaignData.owner,
        requests: campaignData.requests || [],
        contributors: campaignData.contributors || [],
        contributorsCount: campaignData.contributorsCount,
      });

      // Fetch escrow data
      setEscrow((prev) => ({ ...prev, isLoading: true }));
      const [status, balance, required, current, approver] = await Promise.all([
        getEscrowStatus(id),
        getEscrowBalance(id),
        getRequiredApprovals(id),
        getCurrentApprovals(id),
        isApprover(id, account),
      ]);

      setEscrow({
        status,
        balance: formatEther(balance),
        requiredApprovals: required,
        currentApprovals: current,
        isUserApprover: approver,
        isLoading: false,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [
    id,
    contracts.factory,
    account,
    getEscrowStatus,
    getEscrowBalance,
    getRequiredApprovals,
    getCurrentApprovals,
    isApprover,
  ]);

  useEffect(() => {
    fetchCampaignAndEscrowData();
  }, [fetchCampaignAndEscrowData]);

  const handleDonate = async () => {
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      setIsDonating(true);
      setError(null);

      const tx = await depositToEscrow(id, parseEther(donationAmount));
      await tx.wait();
      setDonationAmount("");

      // Refresh escrow balance
      const newBalance = await getEscrowBalance(id);
      setEscrow((prev) => ({ ...prev, balance: formatEther(newBalance) }));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDonating(false);
    }
  };

  const handleCreateRequest = async () => {
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      if (!contracts.campaign) {
        throw new Error("Contract not initialized");
      }

      setIsCreatingRequest(true);
      setError(null);

      const tx = await executeTx(contracts.campaign.createRequest, [
        withdrawRequest.description,
        parseEther(withdrawRequest.amount),
        withdrawRequest.recipient,
      ]);

      await tx.wait();
      setWithdrawRequest({
        description: "",
        amount: "",
        recipient: "",
      });
      // Refresh campaign data
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCreatingRequest(false);
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      if (!contracts.campaign) {
        throw new Error("Contract not initialized");
      }

      const tx = await executeTx(contracts.campaign.approveRequest, [
        requestId,
      ]);

      await tx.wait();
      // Refresh campaign data
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFinalizeRequest = async (requestId) => {
    try {
      if (!contracts.campaign) {
        throw new Error("Contract not initialized");
      }

      const tx = await executeTx(contracts.campaign.finalizeRequest, [
        requestId,
      ]);

      await tx.wait();
      // Refresh campaign data
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Failed to load campaign details</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Campaigns
      </button>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 mb-8">
        <div className="h-64 w-full overflow-hidden">
          <img
            src={campaign.image}
            onError={(e) => {
              e.target.src = "/assets/localart.jpg";
              e.target.onerror = null;
            }}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {campaign.title}
          </h1>
          <p className="text-gray-600 mb-6">{campaign.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <CurrencyDollarIcon className="h-5 w-5 text-indigo-500 mr-2" />
                <span className="font-medium">Raised</span>
              </div>
              <p className="text-2xl font-bold">{campaign.currentAmount} ETH</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <CurrencyDollarIcon className="h-5 w-5 text-indigo-500 mr-2" />
                <span className="font-medium">Goal</span>
              </div>
              <p className="text-2xl font-bold">{campaign.goal} ETH</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <ClockIcon className="h-5 w-5 text-indigo-500 mr-2" />
                <span className="font-medium">Deadline</span>
              </div>
              <p className="text-2xl font-bold">{campaign.deadline}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <CurrencyDollarIcon className="h-5 w-5 text-indigo-500 mr-2" />
                <span className="font-medium">Escrow Balance</span>
              </div>
              <p className="text-2xl font-bold">{escrow.balance || "0"} ETH</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Escrow Status
            </h2>
            <p className="text-lg font-medium mb-4">
              Current Status: {EscrowState[escrow.status] || "Loading..."}
            </p>
            {account === campaign?.owner &&
              escrow.status === EscrowState.ACTIVE && (
                <button
                  onClick={async () => {
                    try {
                      await requestFundsRelease(id);
                      const newStatus = await getEscrowStatus(id);
                      setEscrow((prev) => ({ ...prev, status: newStatus }));
                    } catch (err) {
                      setError(err.message);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2"
                >
                  Request Funds Release
                </button>
              )}
            {escrow.status === EscrowState.PENDING_RELEASE && (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">
                  Escrow Approval Status
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    Approval Progress:
                  </p>
                  <ProgressBar
                    current={escrow.currentApprovals}
                    total={escrow.requiredApprovals}
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    {escrow.currentApprovals} of {escrow.requiredApprovals}{" "}
                    required approvals
                  </p>
                  {escrow.isUserApprover && (
                    <button
                      onClick={async () => {
                        try {
                          await approveFundsRelease(id);
                          const newStatus = await getEscrowStatus(id);
                          const newApprovals = await getCurrentApprovals(id);
                          setEscrow((prev) => ({
                            ...prev,
                            status: newStatus,
                            currentApprovals: newApprovals,
                          }));
                        } catch (err) {
                          setError(err.message);
                        }
                      }}
                      className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Approve Release
                    </button>
                  )}
                </div>
              </div>
            )}
            {account === campaign?.owner &&
              escrow.status === EscrowState.RELEASED && (
                <button
                  onClick={async () => {
                    try {
                      await releaseFunds(id);
                      const newStatus = await getEscrowStatus(id);
                      const newBalance = await getEscrowBalance(id);
                      setEscrow((prev) => ({
                        ...prev,
                        status: newStatus,
                        balance: formatEther(newBalance),
                      }));
                    } catch (err) {
                      setError(err.message);
                    }
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 mr-2"
                >
                  Release Funds
                </button>
              )}
            {escrow.status === EscrowState.REFUNDED && (
              <button
                onClick={async () => {
                  try {
                    await claimRefund(id);
                    const newBalance = await getEscrowBalance(id);
                    setEscrow((prev) => ({
                      ...prev,
                      balance: formatEther(newBalance),
                    }));
                  } catch (err) {
                    setError(err.message);
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Claim Refund
              </button>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Support this Campaign
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
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
              </div>
              <button
                onClick={handleDonate}
                disabled={isDonating}
                className={`px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
                  isDonating ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isDonating ? "Processing..." : "Donate Now"}
              </button>
            </div>
          </div>

          {account === campaign.owner && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Create Withdrawal Request
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={withdrawRequest.description}
                    onChange={(e) =>
                      setWithdrawRequest({
                        ...withdrawRequest,
                        description: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="What is this payment for?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (ETH)
                  </label>
                  <input
                    type="number"
                    value={withdrawRequest.amount}
                    onChange={(e) =>
                      setWithdrawRequest({
                        ...withdrawRequest,
                        amount: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    value={withdrawRequest.recipient}
                    onChange={(e) =>
                      setWithdrawRequest({
                        ...withdrawRequest,
                        recipient: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="0x..."
                  />
                </div>
                <button
                  onClick={handleCreateRequest}
                  disabled={isCreatingRequest}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    isCreatingRequest ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isCreatingRequest ? "Creating..." : "Create Request"}
                </button>
              </div>
            </div>
          )}

          {campaign.requests.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Withdrawal Requests
              </h2>
              <div className="space-y-4">
                {campaign.requests.map((request, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{request.description}</h3>
                      <span className="text-sm font-medium">
                        {formatEther(request.amount)} ETH
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-3">
                      Recipient: {request.recipient}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          request.complete
                            ? "bg-green-100 text-green-800"
                            : request.approvalCount >=
                              campaign.contributorsCount / 2
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {request.complete
                          ? "Completed"
                          : `${request.approvalCount} approvals`}
                      </span>
                    </div>
                    {account === campaign.owner && !request.complete && (
                      <button
                        onClick={() => handleFinalizeRequest(index)}
                        className="px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-2"
                      >
                        Finalize
                      </button>
                    )}
                    {!request.complete &&
                      account !== campaign.owner &&
                      campaign.contributors.includes(account) && (
                        <button
                          onClick={() => handleApproveRequest(index)}
                          disabled={request.approvers.includes(account)}
                          className={`px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                            request.approvers.includes(account)
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-indigo-600 hover:bg-indigo-700"
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                        >
                          {request.approvers.includes(account) ? (
                            <span className="flex items-center">
                              <CheckIcon className="h-4 w-4 mr-1" />
                              Approved
                            </span>
                          ) : (
                            "Approve"
                          )}
                        </button>
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
