import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './store/AuthContext';
import { ThemeProvider } from './store/ThemeContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RoleGuard } from './components/auth/RoleGuard';
import { AppShell } from './components/layout/AppShell';

const LandingPage = lazy(() => import('./pages/landing/LandingPage').then((m) => ({ default: m.LandingPage })));
const SignInPage = lazy(() => import('./pages/auth/SignInPage').then((m) => ({ default: m.SignInPage })));
const SignUpPage = lazy(() => import('./pages/auth/SignUpPage').then((m) => ({ default: m.SignUpPage })));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })));
const UnauthorizedPage = lazy(() => import('./pages/auth/UnauthorizedPage').then((m) => ({ default: m.UnauthorizedPage })));
const LogoutPage = lazy(() => import('./pages/auth/LogoutPage').then((m) => ({ default: m.LogoutPage })));

const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const SuperAdminDashboard = lazy(() => import('./pages/dashboard/roles/SuperAdminDashboard').then((m) => ({ default: m.SuperAdminDashboard })));
const PaperSetterDashboard = lazy(() => import('./pages/dashboard/roles/PaperSetterDashboard').then((m) => ({ default: m.PaperSetterDashboard })));
const CentreAdminDashboard = lazy(() => import('./pages/dashboard/roles/CentreAdminDashboard').then((m) => ({ default: m.CentreAdminDashboard })));
const InvigilatorDashboard = lazy(() => import('./pages/dashboard/roles/InvigilatorDashboard').then((m) => ({ default: m.InvigilatorDashboard })));
const ExaminationsPage = lazy(() => import('./pages/examinations/ExaminationsPage').then((m) => ({ default: m.ExaminationsPage })));
const PapersPage = lazy(() => import('./pages/papers/PapersPage').then((m) => ({ default: m.PapersPage })));
const PaperDetailPage = lazy(() => import('./pages/papers/PaperDetailPage').then((m) => ({ default: m.PaperDetailPage })));
const VerifyIntegrityPage = lazy(() => import('./pages/papers/VerifyIntegrityPage').then((m) => ({ default: m.VerifyIntegrityPage })));
const TimeLockReleasePage = lazy(() => import('./pages/papers/TimeLockReleasePage').then((m) => ({ default: m.TimeLockReleasePage })));
const ChainOfCustodyPage = lazy(() => import('./pages/papers/ChainOfCustodyPage').then((m) => ({ default: m.ChainOfCustodyPage })));
const BlockchainExplorerPage = lazy(() => import('./pages/blockchain/BlockchainExplorerPage').then((m) => ({ default: m.BlockchainExplorerPage })));
const CentresPage = lazy(() => import('./pages/centres/CentresPage').then((m) => ({ default: m.CentresPage })));
const IncidentsPage = lazy(() => import('./pages/incidents/IncidentsPage').then((m) => ({ default: m.IncidentsPage })));
const SecurityOpsPage = lazy(() => import('./pages/security/SecurityOpsPage').then((m) => ({ default: m.SecurityOpsPage })));
const AuditorPortalPage = lazy(() => import('./pages/audit/AuditorPortalPage').then((m) => ({ default: m.AuditorPortalPage })));

const queryClient = new QueryClient();

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Toaster position="top-right" richColors closeButton />
            <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-sm text-neutral-500">Loading VeriQ…</div>}>
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
                          <Route
                            path="/papers"
                            element={
                              <RoleGuard allowedRoles={['SUPER_ADMIN', 'PAPER_SETTER', 'CENTRE_ADMIN']}>
                                <PapersPage />
                              </RoleGuard>
                            }
                          />
                          <Route
                            path="/papers/:id"
                            element={
                              <RoleGuard allowedRoles={['SUPER_ADMIN', 'PAPER_SETTER', 'CENTRE_ADMIN']}>
                                <PaperDetailPage />
                              </RoleGuard>
                            }
                          />
                          <Route path="/verify" element={<VerifyIntegrityPage />} />
                          <Route path="/timelock" element={<TimeLockReleasePage />} />
                          <Route path="/release" element={<Navigate to="/timelock" replace />} />
                          <Route
                            path="/custody"
                            element={
                              <RoleGuard allowedRoles={['SUPER_ADMIN', 'PAPER_SETTER']}>
                                <ChainOfCustodyPage />
                              </RoleGuard>
                            }
                          />
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
            </Suspense>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
