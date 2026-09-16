import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './store/AuthContext';
import { ThemeProvider } from './store/ThemeContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RoleGuard } from './components/auth/RoleGuard';
import { AppShell } from './components/layout/AppShell';

// Public & Authentication Pages
import { LandingPage } from './pages/landing/LandingPage';
import { SignInPage } from './pages/auth/SignInPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { UnauthorizedPage } from './pages/auth/UnauthorizedPage';
import { LogoutPage } from './pages/auth/LogoutPage';

// Dashboard & Domain Pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { SuperAdminDashboard } from './pages/dashboard/roles/SuperAdminDashboard';
import { PaperSetterDashboard } from './pages/dashboard/roles/PaperSetterDashboard';
import { CentreAdminDashboard } from './pages/dashboard/roles/CentreAdminDashboard';
import { InvigilatorDashboard } from './pages/dashboard/roles/InvigilatorDashboard';
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
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Toaster position="top-right" richColors closeButton />
            <Routes>
              {/* Public Standalone Pages (No Shell) */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/login" element={<Navigate to="/signin" replace />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/logout" element={<LogoutPage />} />

              {/* Protected Internal Dashboard Shell */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <Routes>
                        {/* Auto-Routing Dashboard */}
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route
                          path="/dashboard/admin"
                          element={
                            <RoleGuard allowedRoles={['SUPER_ADMIN']}>
                              <SuperAdminDashboard />
                            </RoleGuard>
                          }
                        />
                        <Route
                          path="/dashboard/paper-setter"
                          element={
                            <RoleGuard allowedRoles={['PAPER_SETTER']}>
                              <PaperSetterDashboard />
                            </RoleGuard>
                          }
                        />
                        <Route
                          path="/dashboard/centre"
                          element={
                            <RoleGuard allowedRoles={['CENTRE_ADMIN']}>
                              <CentreAdminDashboard />
                            </RoleGuard>
                          }
                        />
                        <Route
                          path="/dashboard/invigilator"
                          element={
                            <RoleGuard allowedRoles={['INVIGILATOR']}>
                              <InvigilatorDashboard />
                            </RoleGuard>
                          }
                        />

                        {/* Domain Modules */}
                        <Route path="/examinations" element={<ExaminationsPage />} />
                        <Route path="/papers" element={<PapersPage />} />
                        <Route path="/papers/:id" element={<PaperDetailPage />} />
                        <Route path="/verify" element={<VerifyIntegrityPage />} />
                        <Route path="/timelock" element={<TimeLockReleasePage />} />
                        <Route path="/release" element={<Navigate to="/timelock" replace />} />
                        <Route path="/custody" element={<ChainOfCustodyPage />} />
                        <Route
                          path="/blockchain"
                          element={
                            <RoleGuard allowedRoles={['SUPER_ADMIN']}>
                              <BlockchainExplorerPage />
                            </RoleGuard>
                          }
                        />
                        <Route
                          path="/centres"
                          element={
                            <RoleGuard allowedRoles={['SUPER_ADMIN', 'CENTRE_ADMIN']}>
                              <CentresPage />
                            </RoleGuard>
                          }
                        />
                        <Route path="/incidents" element={<IncidentsPage />} />
                        <Route
                          path="/security-ops"
                          element={
                            <RoleGuard allowedRoles={['SUPER_ADMIN']}>
                              <SecurityOpsPage />
                            </RoleGuard>
                          }
                        />
                        <Route path="/security" element={<Navigate to="/security-ops" replace />} />
                        <Route
                          path="/audit"
                          element={
                            <RoleGuard allowedRoles={['SUPER_ADMIN']}>
                              <AuditorPortalPage />
                            </RoleGuard>
                          }
                        />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                      </Routes>
                    </AppShell>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
