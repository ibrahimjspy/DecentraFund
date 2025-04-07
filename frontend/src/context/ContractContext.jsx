import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useContract } from "../hooks/useContract";

const ContractContext = createContext();

function ContractProvider({ children }) {
  const {
    provider,
    signer,
    contracts,
    txStatus,
    initProvider,
    getContract,
    executeTx,
    readContract,
    initContracts,
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
  } = useContract();

  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [txHistory, setTxHistory] = useState([]);
  const [campaignContract, setCampaignContract] = useState(null);

  // Initialize provider and listen for account/chain changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      setAccount(accounts[0] || null);
      if (accounts[0]) initContracts();
    };

    const handleChainChanged = (chainId) => {
      const newChainId = parseInt(chainId, 16);
      setChainId(newChainId);
      initContracts();
    };

    const init = async () => {
      try {
        await initProvider();
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const chainId = await window.ethereum.request({
            method: "eth_chainId",
          });
          setChainId(parseInt(chainId, 16));
          await initContracts();
        }
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    init();

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [initProvider]);

  // Add transaction to history
  const addTxToHistory = useCallback((tx) => {
    setTxHistory((prev) => [
      {
        hash: tx.hash,
        timestamp: new Date().toISOString(),
        status: "pending",
        blockNumber: null,
        gasUsed: null,
        value: tx.value?.toString() || "0",
      },
      ...prev,
    ]);
  }, []);

  // Update transaction status in history
  const updateTxStatus = useCallback((hash, status, blockNumber, gasUsed) => {
    setTxHistory((prev) =>
      prev.map((tx) =>
        tx.hash === hash
          ? {
              ...tx,
              status,
              ...(blockNumber && { blockNumber }),
              ...(gasUsed && { gasUsed }),
            }
          : tx
      )
    );
  }, []);

  // Enhanced executeTx with history tracking
  const executeTxWithTracking = useCallback(
    async (txFunction, args, options = {}) => {
      try {
        const tx = await txFunction(...args);
        addTxToHistory(tx);
        const receipt = await tx.wait();
        updateTxStatus(
          tx.hash,
          "success",
          receipt.blockNumber,
          receipt.gasUsed
        );
        return receipt;
      } catch (error) {
        console.error("Transaction failed:", error);
        updateTxStatus(error.receipt?.transactionHash, "failed");
        throw error;
      }
    },
    [addTxToHistory, updateTxStatus]
  );

  const value = {
    provider,
    signer,
    account,
    chainId,
    contracts,
    txStatus,
    txHistory,
    getContract,
    executeTx: executeTxWithTracking,
    readContract,
    initContracts,
    campaignContract,
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

  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
}

function useContractContext() {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error(
      "useContractContext must be used within a ContractProvider"
    );
  }
  return context;
}

export { ContractProvider, useContractContext };
