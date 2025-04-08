import { Link } from "react-router-dom";
import CampaignCard from "../components/campaign/CampaignCard";
import ConnectWalletButton from "../components/common/ConnectWalletButton";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function LandingPage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: false,
      mirror: false,
    });
  }, []);

  const featuredCampaigns = [
    {
      id: 1,
      title: "Eco-Friendly Water Bottles",
      description:
        "Help us launch sustainable water bottles made from recycled materials",
      progress: 65,
      target: 5000,
      daysLeft: 12,
      image: "",
      category: "Environment",
    },
    {
      id: 2,
      title: "Community Garden Project",
      description:
        "Support our initiative to create urban gardens in food deserts",
      progress: 40,
      target: 10000,
      daysLeft: 25,
      image: "",
      category: "Community",
    },
    {
      id: 3,
      title: "AI for Good Hackathon",
      description:
        "Funding for student teams developing AI solutions for social impact",
      progress: 85,
      target: 15000,
      daysLeft: 5,
      image: "",
      category: "Technology",
    },
  ];

  const stats = [
    { value: "1,200+", label: "Projects Funded" },
    { value: "$5.8M", label: "Raised" },
    { value: "85,000+", label: "Backers" },
    { value: "92%", label: "Success Rate" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] bg-center opacity-10" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 sm:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div
              className="lg:w-1/2 space-y-8"
              data-aos="fade-right"
              data-aos-delay="100"
            >
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Welcome to{" "}
                <span className="relative inline-block">
                  <span className="relative  text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500 animate-text-shine">
                    DecentraFund
                  </span>
                  <span className="absolute inset-0 z-0 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 blur-lg rounded-full animate-pulse-slow"></span>
                </span>
              </h1>
              <p
                className="text-xl text-indigo-100 max-w-2xl"
                data-aos="fade-right"
                data-aos-delay="200"
              >
                The world's most trusted crowdfunding platform for innovators,
                creators, and changemakers.
              </p>
              <div
                className="flex flex-col sm:flex-row gap-4"
                data-aos="fade-right"
                data-aos-delay="300"
              >
                <Link
                  to="/campaigns"
                  className="bg-teal-500 hover:bg-teal-400 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-teal-500/30 text-center"
                >
                  Explore Projects
                </Link>
                <ConnectWalletButton variant="landing" />
              </div>
            </div>
            <div
              className="lg:w-1/2 relative"
              data-aos="fade-left"
              data-aos-delay="400"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                <img
                  src="/assets/landingimage.jpg"
                  alt="People collaborating on creative projects"
                  className="w-full h-auto object-cover"
                  data-aos="zoom-in"
                  data-aos-delay="500"
                />

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div
                    className="flex items-center"
                    data-aos="fade-up"
                    data-aos-delay="600"
                  >
                    <div className="bg-teal-400 rounded-full p-2 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <p className="text-white font-medium">
                      "This platform helped us raise $50k for our community
                      project"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <p className="text-4xl font-bold text-indigo-900">
                  {stat.value}
                </p>
                <p className="text-gray-600 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div
            className="text-center mb-16"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Campaigns
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover projects that are making a difference
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCampaigns.map((campaign, index) => (
              <div
                key={campaign.id}
                data-aos="fade-up"
                data-aos-delay={150 + index * 100}
              >
                <CampaignCard campaign={campaign} />
              </div>
            ))}
          </div>

          <div
            className="text-center mt-12"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <Link
              to="/campaigns"
              className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-indigo-500/30"
            >
              View All Campaigns
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-700 to-purple-700 text-white">
        <div
          className="max-w-7xl mx-auto px-6 lg:px-8 text-center"
          data-aos="zoom-in"
          data-aos-delay="100"
        >
          <h2 className="text-4xl font-bold mb-6">
            Ready to bring your idea to life?
          </h2>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-10">
            Join thousands of creators who've turned their dreams into reality
            with our platform.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-indigo-700 bg-white hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            Start Your Campaign Today
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
