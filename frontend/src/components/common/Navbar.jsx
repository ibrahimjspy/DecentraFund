import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useContractContext } from "../../context/ContractContext";
import ConnectWalletButton from "./ConnectWalletButton";

export default function Navbar() {
  const { isConnected, address } = useContractContext();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => {
    setIsMenuOpen(false);
    setShowUserDropdown(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center space-x-8">
            <NavLink to="/" className="flex items-center" onClick={closeMenu}>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                DecentraFund
              </span>
            </NavLink>

            <div className="hidden md:flex space-x-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-indigo-600 font-semibold"
                      : "text-gray-700 hover:text-indigo-600"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/campaigns"
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-indigo-600 font-semibold"
                      : "text-gray-700 hover:text-indigo-600"
                  }`
                }
              >
                Browse Campaigns
              </NavLink>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-indigo-600 font-semibold"
                      : "text-gray-700 hover:text-indigo-600"
                  }`
                }
              >
                Dashboard
              </NavLink>
            </div>
          </div>

          {/* Right side - Wallet and User */}
          <div className="flex items-center space-x-4">
            <NavLink
              to="/create-campaign"
              className="hidden md:block px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-200"
            >
              Start a Campaign
            </NavLink>

            {isConnected ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <span className="text-xs font-mono">
                    {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
                  </span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                    <NavLink
                      to="/dashboard"
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm ${
                          isActive
                            ? "bg-gray-100 text-indigo-600"
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                      onClick={closeMenu}
                    >
                      My Dashboard
                    </NavLink>
                    <NavLink
                      to="/create-campaign"
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm ${
                          isActive
                            ? "bg-gray-100 text-indigo-600"
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                      onClick={closeMenu}
                    >
                      Create Campaign
                    </NavLink>
                    <ConnectWalletButton
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      variant="disconnect"
                      onClick={closeMenu}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:block">
                <ConnectWalletButton />
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              {isConnected && (
                <span className="mr-2 text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                  {`${address?.slice(0, 4)}...${address?.slice(-4)}`}
                </span>
              )}
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open menu</span>
                {isMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "max-h-screen opacity-100 visible"
            : "max-h-0 opacity-0 invisible"
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-1 bg-white border-t border-gray-200 shadow-sm">
          <NavLink
            to="/"
            onClick={closeMenu}
            className={({ isActive }) =>
              `block px-3 py-3 rounded-md text-base font-medium ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/campaigns"
            onClick={closeMenu}
            className={({ isActive }) =>
              `block px-3 py-3 rounded-md text-base font-medium ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            Browse Campaigns
          </NavLink>
          <NavLink
            to="/dashboard"
            onClick={closeMenu}
            className={({ isActive }) =>
              `block px-3 py-3 rounded-md text-base font-medium ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/create-campaign"
            onClick={closeMenu}
            className="block px-3 py-3 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Start a Campaign
          </NavLink>

          <div className="pt-2 border-t border-gray-200">
            {isConnected ? (
              <ConnectWalletButton
                className="w-full text-left px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                variant="disconnect"
                onClick={closeMenu}
              />
            ) : (
              <ConnectWalletButton
                className="w-full text-left px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                variant="connect"
                onClick={closeMenu}
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
