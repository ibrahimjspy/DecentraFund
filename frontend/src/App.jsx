import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ContractProvider } from "./context/ContractContext";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import LandingPage from "./pages/LandingPage";
import CampaignBrowser from "./pages/CampaignBrowser";
import CampaignDetails from "./pages/CampaignDetails";
import Dashboard from "./pages/Dashboard";
import CreateCampaign from "./pages/CreateCampaign";
import SingleCampaignPage from './pages/SingleCampaignPage';
import { WalletProvider } from "./context/WalletContext";

function App() {
  return (
    <WalletProvider>
      <ContractProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/campaigns" element={<CampaignBrowser />} />
                <Route path="/campaigns/:id" element={<CampaignDetails />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-campaign" element={<CreateCampaign />} />
                <Route
                  path="/campaign/:address"
                  element={<SingleCampaignPage />}
                />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </ContractProvider>
    </WalletProvider>
  );
}

export default App;
