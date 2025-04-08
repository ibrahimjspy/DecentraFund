import { useState, useEffect, useCallback } from "react";
import { Contract, BrowserProvider } from "ethers";

import CampaignFactoryABI from "../contracts/CrowdfundingFactory.json";
import CampaignABI from "../contracts/CrowdfundingCampaign.json";
import EscrowManagerABI from "../contracts/EscrowManager.json";

export function useContract() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contracts, setContracts] = useState({
    factory: null,
    campaign: null,
    escrow: null,
  });
  const [txStatus, setTxStatus] = useState({
    pending: false,
    success: false,
    error: null,
  });

  // Initialize provider and signer
  const initProvider = useCallback(async () => {
    if (window.ethereum) {
      try {
        const newProvider = new BrowserProvider(window.ethereum);
        setProvider(newProvider);
        const newSigner = await newProvider.getSigner();
        setSigner(newSigner);
        return { provider: newProvider, signer: newSigner };
      } catch (error) {
        console.error("Error initializing provider:", error);
        throw error;
      }
    }
    throw new Error("Ethereum provider not found");
  }, []);

  // Get contract instance
  const getContract = useCallback(
    async (address, abi) => {
      if (!signer) {
        const { signer: newSigner } = await initProvider();
        return new Contract(address, abi, newSigner);
      }
      return new Contract(address, abi, signer);
    },
    [signer, initProvider]
  );

  // Initialize contracts
  const initContracts = useCallback(async () => {
    if (!signer) return;

    try {
      const factoryAddress = "0xF1c7c57f8437057084dB9770584Fb8e6681B586b"; // Hardcoded factory address
      const escrowAddress = "0x3E5e9111Ae8eB78Fe1CC3bb8915d5D461F3Ef9A9"; // EscrowManager contract address
      if (!factoryAddress || !escrowAddress) {
        throw new Error("Contract addresses not configured");
      }

      const factoryContract = new Contract(
        factoryAddress,
        CampaignFactoryABI.abi,
        signer
      );
      const escrowContract = new Contract(
        escrowAddress,
        EscrowManagerABI.abi,
        signer
      );

      setContracts((prev) => ({
        ...prev,
        factory: factoryContract,
        escrow: escrowContract,
      }));
    } catch (error) {
      console.error("Error initializing contracts:", error);
      throw error;
    }
  }, [signer]);

  // Execute contract write function
  const executeTx = useCallback(async (txFunction, args, options = {}) => {
    setTxStatus({ pending: true, success: false, error: null });
    try {
      const tx = await txFunction(...args);
      const receipt = await tx.wait();
      setTxStatus({ pending: false, success: true, error: null });
      return receipt;
    } catch (error) {
      console.error("Transaction failed:", error);
      setTxStatus({ pending: false, success: false, error });
      throw error;
    }
  }, []);

  // Read contract data
  const readContract = useCallback(async (contract, method, args = []) => {
    try {
      return await contract[method](...args);
    } catch (error) {
      console.error("Read operation failed:", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    if (signer) {
      initContracts().catch(console.error);
    }
  }, [signer, initContracts]);

  const setCampaignContract = useCallback(
    (address) => {
      if (!signer) return;
      const campaignContract = new Contract(address, CampaignABI.abi, signer);
      setContracts((prev) => ({
        ...prev,
        campaign: campaignContract,
      }));
    },
    [signer]
  );

  const getEscrowStatus = useCallback(
    async (campaignAddress) => {
      if (!contracts.escrow) return;
      return await contracts.escrow.getEscrowStatus(campaignAddress);
    },
    [contracts.escrow]
  );

  const getEscrowBalance = useCallback(
    async (campaignAddress) => {
      if (!contracts.escrow) return;
      return await contracts.escrow.getTotalDeposited(campaignAddress);
    },
    [contracts.escrow]
  );

  const getRequiredApprovals = useCallback(
    async (campaignAddress) => {
      if (!contracts.escrow) return;
      return await contracts.escrow.requiredApprovals(campaignAddress);
    },
    [contracts.escrow]
  );

  const getCurrentApprovals = useCallback(
    async (campaignAddress) => {
      if (!contracts.escrow) return;
      return await contracts.escrow.getApprovalCount(campaignAddress);
    },
    [contracts.escrow]
  );

  const isApprover = useCallback(
    async (campaignAddress, userAddress) => {
      if (!contracts.escrow) return false;
      return await contracts.escrow.isApprover(campaignAddress, userAddress);
    },
    [contracts.escrow]
  );

  // Escrow transaction functions
  const depositToEscrow = useCallback(
    async (campaignAddress, amount) => {
      if (!contracts.escrow) throw new Error("Escrow contract not initialized");
      return executeTx(contracts.escrow.deposit, [campaignAddress], {
        value: amount,
      });
    },
    [contracts.escrow, executeTx]
  );

  const requestFundsRelease = useCallback(
    async (campaignAddress) => {
      if (!contracts.escrow) throw new Error("Escrow contract not initialized");
      return executeTx(contracts.escrow.requestReleaseFunds, [campaignAddress]);
    },
    [contracts.escrow, executeTx]
  );

  const approveFundsRelease = useCallback(
    async (campaignAddress) => {
      if (!contracts.escrow) throw new Error("Escrow contract not initialized");
      return executeTx(contracts.escrow.approveReleaseFunds, [campaignAddress]);
    },
    [contracts.escrow, executeTx]
  );

  const releaseFunds = useCallback(
    async (campaignAddress) => {
      if (!contracts.escrow) throw new Error("Escrow contract not initialized");
      return executeTx(contracts.escrow.releaseFunds, [campaignAddress]);
    },
    [contracts.escrow, executeTx]
  );

  const claimRefund = useCallback(
    async (campaignAddress) => {
      if (!contracts.escrow) throw new Error("Escrow contract not initialized");
      return executeTx(contracts.escrow.claimRefund, [campaignAddress]);
    },
    [contracts.escrow, executeTx]
  );

  return {
    provider,
    signer,
    contracts,
    txStatus,
    initProvider,
    getContract,
    executeTx,
    readContract,
    initContracts,
    setCampaignContract,
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
  };
}
