import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './store/AuthContext';
import { AppShell } from './components/layout/AppShell';

// Pages
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ExaminationsPage } from './pages/examinations/ExaminationsPage';
import { PapersPage } from './pages/papers/PapersPage';
import { PaperDetailPage } from './pages/papers/PaperDetailPage';
import { VerifyIntegrityPage } from './pages/papers/VerifyIntegrityPage';
import { TimeLockReleasePage } from './pages/papers/TimeLockReleasePage';
import { ChainOfCustodyPage } from './pages/papers/ChainOfCustodyPage';
import { BlockchainExplorerPage } from './pages/blockchain/BlockchainExplorerPage';
import { CentresPage } from './pages/centres/CentresPage';
import { IncidentsPage } from './pages/incidents/IncidentsPage';
import { SecurityOpsPage } from './pages/security/SecurityOpsPage';
import { AuditorPortalPage } from './pages/audit/AuditorPortalPage';

const queryClient = new QueryClient();

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" richColors theme="dark" closeButton />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Shell Routes */}
            <Route
              path="/*"
              element={
                <AppShell>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/examinations" element={<ExaminationsPage />} />
                    <Route path="/papers" element={<PapersPage />} />
                    <Route path="/papers/:id" element={<PaperDetailPage />} />
                    <Route path="/verify" element={<VerifyIntegrityPage />} />
                    <Route path="/release" element={<TimeLockReleasePage />} />
                    <Route path="/custody" element={<ChainOfCustodyPage />} />
                    <Route path="/blockchain" element={<BlockchainExplorerPage />} />
                    <Route path="/centres" element={<CentresPage />} />
                    <Route path="/incidents" element={<IncidentsPage />} />
                    <Route path="/security" element={<SecurityOpsPage />} />
                    <Route path="/audit" element={<AuditorPortalPage />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </AppShell>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
