import React from "react";
import { HashRouter, Routes, Route, NavLink } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { CreatorDashboardPage } from "./pages/CreatorDashboardPage";
import { InvestorDashboardPage } from "./pages/InvestorDashboardPage";
import { AIAnalyzerPage } from "./pages/AIAnalyzerPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { GrantDetailPage } from "./pages/GrantDetailPage"; // Added import
import { ConnectWalletButton } from "/components/core/ConnectWalletButton"; // Import using alias
import {
  LayoutDashboard,
  Home,
  User,
  BarChartBig,
  BrainCircuit,
  Lightbulb,
  Store,
  Wallet,
} from "lucide-react";

const App: React.FC = () => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }): string =>
    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ease-in-out hover:bg-gray-700 ${
      isActive ? "bg-indigo-600 text-white" : "text-gray-300 hover:text-white"
    }`;

  return (
    <HashRouter>
      <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Lightbulb className="h-10 w-10 text-indigo-400" />
            <span className="text-2xl font-bold text-white">IPFlow</span>
          </div>
          <ConnectWalletButton />
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 bg-gray-800 p-6 space-y-6 border-r border-gray-700 overflow-y-auto">
            {/* App Logo/Name removed from here, moved to header */}
            <nav className="space-y-2">
              <NavLink to="/" className={navLinkClasses}>
                <Home className="mr-3 h-5 w-5" />
                Home
              </NavLink>
              <NavLink to="/creator" className={navLinkClasses}>
                <User className="mr-3 h-5 w-5" />
                Creator Studio
              </NavLink>
              <NavLink to="/investor" className={navLinkClasses}>
                <BarChartBig className="mr-3 h-5 w-5" />
                Investor Dashboard
              </NavLink>
              <NavLink to="/marketplace" className={navLinkClasses}>
                <Store className="mr-3 h-5 w-5" />
                Marketplace
              </NavLink>
              <NavLink to="/analyzer" className={navLinkClasses}>
                <BrainCircuit className="mr-3 h-5 w-5" />
                AI Project Analyzer
              </NavLink>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/creator" element={<CreatorDashboardPage />} />
              <Route path="/investor" element={<InvestorDashboardPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route
                path="/marketplace/:grantId"
                element={<GrantDetailPage />}
              />{" "}
              {/* Added route */}
              <Route path="/analyzer" element={<AIAnalyzerPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
