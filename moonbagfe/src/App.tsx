import { Routes, Route, Navigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Onboarding } from './pages/Onboarding';

function App() {
  const { isConnected } = useAccount();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={!isConnected ? <LandingPage /> : <Navigate to="/onboarding" />} />
        <Route
          path="/onboarding"
          element={isConnected ? <Onboarding /> : <Navigate to="/" />}
        />
        <Route
          path="/dashboard"
          element={isConnected ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={isConnected ? <Profile /> : <Navigate to="/" />}
        />
      </Routes>
    </Layout>
  );
}

export default App;