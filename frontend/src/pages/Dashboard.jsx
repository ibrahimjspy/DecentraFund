import { useState } from "react";
import TransactionHistory from "../components/common/TransactionHistory";
import { Tab } from "@headlessui/react";
import {
  PlusIcon,
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import CampaignCard from "../components/campaign/CampaignCard";
import { useContractContext } from "../context/ContractContext";
import { EscrowState } from "../utils/enums";

const mockCreatedCampaigns = [
  {
    id: 1,
    title: "Eco-Friendly Water Bottles",
    description: "Sustainable water bottles made from 100% recycled materials",
    progress: 65,
    target: 5000,
    daysLeft: 12,
    category: "Environment",
    image: "/assets/waterbottle.jpg",
    status: "active",
  },
  {
    id: 2,
    title: "Urban Garden Initiative",
    description: "Creating community gardens in food desert neighborhoods",
    progress: 42,
    target: 10000,
    daysLeft: 25,
    category: "Community",
    image: "/assets/commgarden.jpg",
    status: "active",
  },
];

const mockBackedCampaigns = [
  {
    id: 3,
    title: "Solar Panel Project",
    description: "Bringing solar energy to low-income households",
    progress: 89,
    target: 15000,
    daysLeft: 5,
    category: "Environment",
    pledgeAmount: 50,
    reward: "Special thank you package",
    image: "/assets/ai.jpg",
    status: "funded",
  },
  {
    id: 4,
    title: "Children's Coding Camp",
    description: "Free programming classes for underprivileged youth",
    progress: 120,
    target: 8000,
    daysLeft: 0,
    category: "Education",
    pledgeAmount: 100,
    reward: "Early access to curriculum",
    image: "/assets/childreneducation.jpg",
    status: "completed",
  },
];

export default function Dashboard() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    account,
    getEscrowStatus,
    getEscrowBalance,
    approveFundsRelease,
    releaseFunds,
    claimRefund,
  } = useContractContext();
  const [campaignId, setCampaignId] = useState("");
  const [escrowInfo, setEscrowInfo] = useState(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const tabTitles = [
    "My Campaigns",
    "Backed Projects",
    "Transaction History",
    "Escrow Management",
    "Account Settings",
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage your campaigns and contributions
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            {/* Mobile Tab Selector */}
            <div className="md:hidden border-b border-gray-200">
              <button
                onClick={toggleMobileMenu}
                className="flex justify-between items-center w-full px-6 py-4 text-left text-sm font-medium text-gray-700 focus:outline-none"
              >
                <span>{tabTitles[selectedIndex]}</span>
                {mobileMenuOpen ? (
                  <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {mobileMenuOpen && (
                <div className="px-2 pb-2 space-y-1">
                  {tabTitles.map((title, index) => (
                    <button
                      key={title}
                      onClick={() => {
                        setSelectedIndex(index);
                        setMobileMenuOpen(false);
                      }}
                      className={`block w-full px-4 py-2 text-left text-sm rounded-md ${
                        selectedIndex === index
                          ? "bg-indigo-100 text-indigo-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Tab List */}
            <Tab.List className="hidden md:flex border-b border-gray-200 overflow-x-auto">
              <Tab
                className={({ selected }) =>
                  `px-6 py-4 text-sm font-medium whitespace-nowrap focus:outline-none ${
                    selected
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`
                }
              >
                My Campaigns
              </Tab>
              <Tab
                className={({ selected }) =>
                  `px-6 py-4 text-sm font-medium whitespace-nowrap focus:outline-none ${
                    selected
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`
                }
              >
                Backed Projects
              </Tab>
              <Tab
                className={({ selected }) =>
                  `px-6 py-4 text-sm font-medium whitespace-nowrap focus:outline-none ${
                    selected
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`
                }
              >
                Transaction History
              </Tab>
              <Tab
                className={({ selected }) =>
                  `px-6 py-4 text-sm font-medium whitespace-nowrap focus:outline-none ${
                    selected
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`
                }
              >
                Escrow Management
              </Tab>
              <Tab
                className={({ selected }) =>
                  `px-6 py-4 text-sm font-medium whitespace-nowrap focus:outline-none ${
                    selected
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`
                }
              >
                Account Settings
              </Tab>
            </Tab.List>

            <Tab.Panels className="p-4 sm:p-6">
              {/* My Campaigns Panel */}
              <Tab.Panel>
                <div className="mb-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Your Campaigns
                    </h2>
                    <a
                      href="/create-campaign"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto justify-center"
                    >
                      <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                      New Campaign
                    </a>
                  </div>

                  {mockCreatedCampaigns.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {mockCreatedCampaigns.map((campaign) => (
                        <div key={campaign.id} className="relative">
                          <CampaignCard campaign={campaign} isOwner={true} />
                          <div className="mt-2 flex space-x-2">
                            <a
                              href={`/campaigns/${campaign.id}/edit`}
                              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex-1 justify-center"
                            >
                              Edit
                            </a>
                            <a
                              href={`/campaigns/${campaign.id}`}
                              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex-1 justify-center"
                            >
                              View
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <h3 className="mt-2 text-lg font-medium text-gray-900">
                        No campaigns
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Get started by creating a new campaign.
                      </p>
                      <div className="mt-6">
                        <a
                          href="/create-campaign"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                          New Campaign
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </Tab.Panel>

              {/* Backed Projects Panel */}
              <Tab.Panel>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Projects You've Backed
                  </h2>

                  {mockBackedCampaigns.length > 0 ? (
                    <div className="space-y-4">
                      {mockBackedCampaigns.map((campaign) => (
                        <div
                          key={campaign.id}
                          className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex flex-col sm:flex-row sm:items-start space-x-0 sm:space-x-4 space-y-2 sm:space-y-0">
                              <img
                                src={campaign.image}
                                alt={campaign.title}
                                className="h-16 w-16 rounded-lg object-cover"
                              />
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  {campaign.title}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                  {campaign.description}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      campaign.status === "funded"
                                        ? "bg-green-100 text-green-800"
                                        : campaign.status === "completed"
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    {campaign.status === "funded"
                                      ? "Funded"
                                      : campaign.status === "completed"
                                      ? "Completed"
                                      : "Active"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="sm:text-right">
                              <div className="text-sm text-gray-900">
                                <span className="font-medium">
                                  ${campaign.pledgeAmount}
                                </span>{" "}
                                pledged
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {campaign.reward}
                              </div>
                              <a
                                href={`/campaigns/${campaign.id}`}
                                className="mt-2 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                              >
                                View project{" "}
                                <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <h3 className="mt-2 text-lg font-medium text-gray-900">
                        No backed projects
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Support a project to see it appear here.
                      </p>
                      <div className="mt-6">
                        <a
                          href="/campaigns"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Browse Projects
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </Tab.Panel>

              {/* Transaction History Panel */}
              <Tab.Panel>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Your Transaction History
                  </h2>
                  <TransactionHistory />
                </div>
              </Tab.Panel>

              {/* Escrow Management Panel */}
              <Tab.Panel>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Escrow Management
                  </h2>
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Your Escrow Actions
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="campaign-id"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Campaign ID
                        </label>
                        <input
                          type="text"
                          name="campaign-id"
                          id="campaign-id"
                          value={campaignId}
                          onChange={(e) => setCampaignId(e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                          placeholder="Enter campaign ID"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                        <button
                          onClick={async () => {
                            const status = await getEscrowStatus(campaignId);
                            setEscrowInfo((prev) => ({ ...prev, status }));
                          }}
                          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Get Escrow Status
                        </button>
                        <button
                          onClick={async () => {
                            const balance = await getEscrowBalance(campaignId);
                            setEscrowInfo((prev) => ({ ...prev, balance }));
                          }}
                          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Get Escrow Balance
                        </button>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                        <button
                          onClick={() => approveFundsRelease(campaignId)}
                          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Approve Funds Release
                        </button>
                        <button
                          onClick={() => releaseFunds(campaignId)}
                          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Release Funds
                        </button>
                        <button
                          onClick={() => claimRefund(campaignId)}
                          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Claim Refund
                        </button>
                      </div>
                      {escrowInfo && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Escrow Info
                          </h4>
                          {escrowInfo.status !== undefined && (
                            <p className="text-sm">
                              <span className="font-medium">Status:</span>{" "}
                              {EscrowState[escrowInfo.status]}
                            </p>
                          )}
                          {escrowInfo.balance !== undefined && (
                            <p className="text-sm">
                              <span className="font-medium">Balance:</span>{" "}
                              {escrowInfo.balance} ETH
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Tab.Panel>

              {/* Account Settings Panel */}
              <Tab.Panel>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Account Settings
                  </h2>
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Profile Information
                        </h3>
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-3">
                            <label
                              htmlFor="first-name"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              First name
                            </label>
                            <input
                              type="text"
                              name="first-name"
                              id="first-name"
                              autoComplete="given-name"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label
                              htmlFor="last-name"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Last name
                            </label>
                            <input
                              type="text"
                              name="last-name"
                              id="last-name"
                              autoComplete="family-name"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                            />
                          </div>

                          <div className="sm:col-span-4">
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Email address
                            </label>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              autoComplete="email"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Security
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="current-password"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Current password
                            </label>
                            <input
                              type="password"
                              name="current-password"
                              id="current-password"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="new-password"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              New password
                            </label>
                            <input
                              type="password"
                              name="new-password"
                              id="new-password"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-6 border-t border-gray-200">
                        <button
                          type="button"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
}
