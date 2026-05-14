import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { SettingsProvider } from './contexts/SettingsContext'
import ERPLayout from './layouts/ERPLayout'
import PortalLayout from './layouts/PortalLayout'

import HomePage from './pages/public/HomePage'
import LoginPage from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'
import PrivacyPage from './pages/public/PrivacyPage'
import TermsPage from './pages/public/TermsPage'
import SupportPage from './pages/public/SupportPage'

import DashboardPage from './pages/erp/DashboardPage'
import CRMPage from './pages/erp/CRMPage'
import ProjectsPage from './pages/erp/ProjectsPage'
import BriefPage from './pages/erp/BriefPage'
import TasksPage from './pages/erp/TasksPage'
import TeamPage from './pages/erp/TeamPage'
import FinancePage from './pages/erp/FinancePage'
import TemplatesPage from './pages/erp/TemplatesPage'
import SettingsPage from './pages/erp/SettingsPage'
import InvoicePDFPage from './pages/shared/InvoicePDFPage'

import PortalDashboardPage from './pages/portal/PortalDashboardPage'
import PortalProjectsPage from './pages/portal/PortalProjectsPage'
import PortalBriefPage from './pages/portal/PortalBriefPage'
import PortalInvoicesPage from './pages/portal/PortalInvoicesPage'

export default function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/support" element={<SupportPage />} />

            <Route path="/app" element={<ERPLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="crm" element={<CRMPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="projects/:projectId/brief" element={<BriefPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="team" element={<TeamPage />} />
              <Route path="finance" element={<FinancePage />} />
              <Route path="finance/invoices/:invoiceId/pdf" element={<InvoicePDFPage />} />
              <Route path="templates" element={<TemplatesPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path="/portal" element={<PortalLayout />}>
              <Route index element={<PortalDashboardPage />} />
              <Route path="projects" element={<PortalProjectsPage />} />
              <Route path="briefs/:projectId" element={<PortalBriefPage />} />
              <Route path="invoices" element={<PortalInvoicesPage />} />
              <Route path="invoices/:invoiceId/pdf" element={<InvoicePDFPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </SettingsProvider>
    </BrowserRouter>
  )
}
