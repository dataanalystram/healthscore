import React, { useState } from "react";
import ConnectorsList from "./ConnectorsList";
import ConnectorForm from "./ConnectorForm";
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowLeft } from "lucide-react";

const DataIntegrationHub = () => {
  const [showConnectorForm, setShowConnectorForm] = useState(false);
  const [selectedConnectorId, setSelectedConnectorId] = useState<string | null>(
    null,
  );

  const handleAddConnector = () => {
    setSelectedConnectorId(null);
    setShowConnectorForm(true);
  };

  const handleConfigureConnector = (id: string) => {
    setSelectedConnectorId(id);
    setShowConnectorForm(true);
  };

  const handleRefreshConnector = (id: string) => {
    console.log(`Refreshing connector ${id}`);
    // In a real app, this would trigger a refresh of the connector data
  };

  const handleFormSubmit = (data: any) => {
    console.log("Form submitted:", data);
    // In a real app, this would save the connector configuration
    setShowConnectorForm(false);
  };

  const handleFormCancel = () => {
    setShowConnectorForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Data Integration Hub
        </h1>
        {!showConnectorForm && (
          <Button onClick={handleAddConnector}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Data Source
          </Button>
        )}
        {showConnectorForm && (
          <Button variant="outline" onClick={handleFormCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Connectors
          </Button>
        )}
      </div>

      {showConnectorForm ? (
        <ConnectorForm
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          initialData={
            selectedConnectorId
              ? {
                  // This would be populated with the selected connector's data in a real app
                  connectorName: selectedConnectorId === "3" ? "HubSpot" : "",
                  connectorType:
                    selectedConnectorId === "3" ? "hubspot" : "salesforce",
                  description: "",
                  authType: "apiKey",
                  apiKey: "",
                  username: "",
                  password: "",
                  oauthClientId: "",
                  oauthClientSecret: "",
                  schemaType: "predefined",
                  customSchema: "",
                  pollingInterval: "15",
                  enableWebhooks: false,
                  webhookUrl: "",
                  enableLogging: true,
                }
              : undefined
          }
        />
      ) : (
        <>
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">Integration Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">4</div>
                <div className="text-sm font-medium">Connected Sources</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-green-600">3</div>
                <div className="text-sm font-medium">Active Syncs</div>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-amber-600">1</div>
                <div className="text-sm font-medium">Pending Setup</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-red-600">1</div>
                <div className="text-sm font-medium">Connection Errors</div>
              </div>
            </div>
          </div>

          <ConnectorsList
            onAddConnector={handleAddConnector}
            onConfigureConnector={handleConfigureConnector}
            onRefreshConnector={handleRefreshConnector}
          />
        </>
      )}
    </div>
  );
};

export default DataIntegrationHub;
