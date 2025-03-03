import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import DashboardLayout from "./components/layout/DashboardLayout";

// Lazy load components for better performance
const DashboardOverview = lazy(
  () => import("./components/dashboard/DashboardOverview"),
);
const DataIntegrationHub = lazy(
  () => import("./components/data-integration/DataIntegrationHub"),
);
const ScorecardOptimizer = lazy(
  () => import("./components/scorecard/ScorecardOptimizer"),
);

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <DashboardLayout>
                <DashboardOverview username="John Doe" />
              </DashboardLayout>
            }
          />

          {/* Data Integration Routes */}
          <Route
            path="/data-integration"
            element={
              <DashboardLayout>
                <DataIntegrationHub />
              </DashboardLayout>
            }
          />

          {/* Scorecard Optimizer Routes */}
          <Route
            path="/scorecard-optimizer"
            element={
              <DashboardLayout>
                <ScorecardOptimizer />
              </DashboardLayout>
            }
          />

          {/* Add Tempo routes before the catch-all route */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
