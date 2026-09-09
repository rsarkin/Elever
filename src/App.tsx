import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './pages/Dashboard';
import { SurveyList } from './pages/SurveyList';
import { NewSurvey } from './pages/NewSurvey';
import { AnalysisWorkspace } from './pages/AnalysisWorkspace';
import { LocationPage } from './pages/Location';
import { Reports } from './pages/Reports';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="surveys" element={<SurveyList />} />
          <Route path="surveys/new" element={<NewSurvey />} />
          <Route path="surveys/:id" element={<AnalysisWorkspace />} />
          <Route path="location" element={<LocationPage />} />
          <Route path="reports" element={<Reports />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
