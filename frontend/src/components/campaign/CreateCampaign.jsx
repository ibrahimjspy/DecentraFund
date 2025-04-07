import React, { useState } from "react";
import { useContractContext } from "../../context/ContractContext";
import { parseEther } from "ethers";

const CreateCampaign = ({ onCampaignCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);
  const { account, contracts, executeTx } = useContractContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsCreating(true);

    try {
      if (!account) {
        throw new Error("Please connect your wallet first");
      }

      if (!title || !description || !goal) {
        throw new Error("Please fill all fields");
      }

      if (isNaN(goal) || parseFloat(goal) <= 0) {
        throw new Error("Please enter a valid goal amount");
      }

      if (!contracts.factory) {
        throw new Error("Contract not initialized");
      }

      const tx = await executeTx(contracts.factory.createCampaign, [
        title,
        description,
        parseEther(goal),
      ]);

      // Wait for transaction to be mined
      const receipt = await tx.wait();

      setTitle("");
      setDescription("");
      setGoal("");

      const campaignAddress = receipt.events[0].args[0]; // Assuming the campaign address is in the first event
      const { setContracts } = useContractContext();
      setContracts((prev) => ({
        ...prev,
        campaign: new Contract(campaignAddress, CampaignABI.abi, signer),
      }));
      if (receipt.status === 1) {
        onCampaignCreated();
      } else {
        throw new Error("Transaction failed");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Create New Campaign
      </h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Campaign title"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Describe your campaign"
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor="goal"
          >
            Funding Goal (ETH)
          </label>
          <input
            id="goal"
            type="number"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
            min="0.01"
            step="0.01"
          />
        </div>

        <button
          type="submit"
          disabled={isCreating}
          className={`w-full py-2 px-4 rounded text-white font-medium ${
            isCreating ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isCreating ? "Creating..." : "Create Campaign"}
        </button>
      </form>
    </div>
  );
};

export default CreateCampaign;
