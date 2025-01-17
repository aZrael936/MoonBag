import { Routes, Route, Navigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { Layout } from "./components/layout/Layout";
import { LandingPage } from "./pages/LandingPage";
import { Dashboard } from "./pages/Dashboard";
import { Profile } from "./pages/Profile";
import { Onboarding } from "./pages/Onboarding";
import { supabase } from "./lib/supabase";
import { useAgentWallet } from "./hooks/UseAgentWallet";
import { useEffect, useState } from "react";

function App() {
  const { isConnected, address } = useAccount();
  const { isLoading } = useAgentWallet();
  const [isCreated, setIsCreated] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("agent_wallets")
        .select("agent_address, encrypted_private_key")
        .eq("user_address", address?.toLowerCase())
        .single();

      if (data) {
        setIsCreated(true);
        console.log("daataa:", data);
      } else {
        console.log("error:", error);
      }
    };

    fetchData();
  }, [address]);

  // Show loading state while checking wallet status
  if (isConnected && isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={
            !isConnected ? (
              <LandingPage />
            ) : (
              <Navigate to={isCreated ? "/dashboard" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/onboarding"
          element={
            isConnected && !isCreated ? (
              <Onboarding />
            ) : (
              <Navigate to={isCreated ? "/dashboard" : "/"} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isConnected && isCreated ? (
              <Dashboard />
            ) : (
              <Navigate to={!isConnected ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/profile"
          element={
            isConnected && isCreated ? (
              <Profile />
            ) : (
              <Navigate to={!isConnected ? "/" : "/onboarding"} />
            )
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
