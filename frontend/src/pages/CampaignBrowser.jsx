import { useState } from "react";
import CampaignCard from "../components/campaign/CampaignCard";
import SearchFilter from "../components/campaign/SearchFilter";

const mockCampaigns = [
  {
    id: 1,
    title: "Eco-Friendly Water Bottles",
    description:
      "Help us launch sustainable water bottles made from recycled materials",
    category: "Environment",
    progress: 65,
    target: 5000,
    daysLeft: 12,
    image: "/assets/waterbottle.jpg",
    featured: true,
  },
  {
    id: 2,
    title: "Community Garden Project",
    description:
      "Support our initiative to create urban gardens in food deserts",
    category: "Community",
    progress: 40,
    target: 10000,
    daysLeft: 25,
    image: "/assets/commgarden.jpg",
    featured: false,
  },
  {
    id: 3,
    title: "AI for Good Hackathon",
    description:
      "Funding for student teams developing AI solutions for social impact",
    category: "Technology",
    progress: 85,
    target: 15000,
    daysLeft: 5,
    image: "/assets/ai.jpg",
    featured: true,
  },
  {
    id: 4,
    title: "Local Art Exhibition",
    description: "Support emerging artists in our annual downtown exhibition",
    category: "Arts",
    progress: 30,
    target: 8000,
    daysLeft: 18,
    image: "/assets/localart.jpg",
    featured: false,
  },
  {
    id: 5,
    title: "Children's Education Fund",
    description: "Providing school supplies for underprivileged children",
    category: "Education",
    progress: 90,
    target: 12000,
    daysLeft: 3,
    image: "/assets/childreneducation.jpg",
    featured: true,
  },
  {
    id: 6,
    title: "Animal Shelter Renovation",
    description:
      "Help us renovate our facilities to accommodate more rescued animals",
    category: "Animals",
    progress: 55,
    target: 15000,
    daysLeft: 22,
    image: "/assets/animalshelter.jpg",
    featured: false,
  },
];

export default function CampaignBrowser() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("Most Recent");

  const categories = ["All", ...new Set(mockCampaigns.map((c) => c.category))];
  const sortOptions = [
    "Most Recent",
    "Most Funded",
    "Ending Soon",
    "Highest Goal",
  ];

  const filteredCampaigns = mockCampaigns
    .filter((campaign) => {
      const matchesSearch =
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || campaign.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "Most Funded":
          return b.progress - a.progress;
        case "Ending Soon":
          return a.daysLeft - b.daysLeft;
        case "Highest Goal":
          return b.target - a.target;
        default:
          return b.id - a.id; // Most Recent (assuming higher ID = more recent)
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Projects
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Support innovative ideas and be part of their success stories
          </p>
        </div>

        {/* Filters and Sorting */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <SearchFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-gray-500">
              Showing {filteredCampaigns.length}{" "}
              {filteredCampaigns.length === 1 ? "project" : "projects"}
            </div>
            <div className="flex items-center gap-2">
              <label
                htmlFor="sort"
                className="text-sm font-medium text-gray-700"
              >
                Sort by:
              </label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Campaigns Grid */}
        {filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No campaigns found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSortOption("Most Recent");
              }}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset all filters
            </button>
          </div>
        )}

        {/* Featured Section (optional) */}
        {selectedCategory === "All" && searchTerm === "" && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Featured Campaigns
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockCampaigns
                .filter((campaign) => campaign.featured)
                .map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
