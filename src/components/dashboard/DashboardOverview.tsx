import React from "react";
import MetricsGrid from "./MetricsGrid";
import QuickAccessCards from "./QuickAccessCards";

interface DashboardOverviewProps {
  username?: string;
}

const DashboardOverview = ({ username = "User" }: DashboardOverviewProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome, {username}
        </h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleString()}
          </span>
        </div>
      </div>

      {/* Metrics Overview */}
      <MetricsGrid />

      {/* Quick Access Cards */}
      <QuickAccessCards />

      {/* Additional Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 pb-4 border-b">
              <div className="rounded-full bg-blue-100 p-2">
                <div className="h-8 w-8 rounded-full bg-blue-500" />
              </div>
              <div>
                <p className="font-medium">Data source connected</p>
                <p className="text-sm text-muted-foreground">
                  Salesforce integration completed successfully
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  2 hours ago
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 pb-4 border-b">
              <div className="rounded-full bg-green-100 p-2">
                <div className="h-8 w-8 rounded-full bg-green-500" />
              </div>
              <div>
                <p className="font-medium">Health score improved</p>
                <p className="text-sm text-muted-foreground">
                  Acme Corp. score increased by 12 points
                </p>
                <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="rounded-full bg-amber-100 p-2">
                <div className="h-8 w-8 rounded-full bg-amber-500" />
              </div>
              <div>
                <p className="font-medium">At-risk customer identified</p>
                <p className="text-sm text-muted-foreground">
                  TechStart Inc. requires attention
                </p>
                <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 bg-primary/5 hover:bg-primary/10 rounded-md transition-colors">
              <span className="font-medium">Run Health Score Analysis</span>
              <span className="text-primary">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-primary/5 hover:bg-primary/10 rounded-md transition-colors">
              <span className="font-medium">Generate Monthly Report</span>
              <span className="text-primary">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-primary/5 hover:bg-primary/10 rounded-md transition-colors">
              <span className="font-medium">Schedule Team Review</span>
              <span className="text-primary">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-primary/5 hover:bg-primary/10 rounded-md transition-colors">
              <span className="font-medium">Configure Alerts</span>
              <span className="text-primary">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
