import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  RefreshCw,
  Settings,
} from "lucide-react";

interface ConnectorStatus {
  id: string;
  name: string;
  type: string;
  status: "connected" | "error" | "pending";
  lastSync?: string;
  error?: string;
}

interface ConnectorsListProps {
  connectors?: ConnectorStatus[];
  onAddConnector?: () => void;
  onRefreshConnector?: (id: string) => void;
  onConfigureConnector?: (id: string) => void;
}

const ConnectorsList = ({
  connectors = [
    {
      id: "1",
      name: "Salesforce",
      type: "CRM",
      status: "connected",
      lastSync: "2023-06-15T14:30:00Z",
    },
    {
      id: "2",
      name: "Zendesk",
      type: "Support",
      status: "connected",
      lastSync: "2023-06-14T09:15:00Z",
    },
    {
      id: "3",
      name: "HubSpot",
      type: "Marketing",
      status: "error",
      error: "Authentication failed. Please check your API credentials.",
    },
    {
      id: "4",
      name: "Stripe",
      type: "Billing",
      status: "pending",
    },
  ],
  onAddConnector = () => {},
  onRefreshConnector = () => {},
  onConfigureConnector = () => {},
}: ConnectorsListProps) => {
  const getStatusIcon = (status: ConnectorStatus["status"]) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "pending":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: ConnectorStatus["status"]) => {
    switch (status) {
      case "connected":
        return (
          <Badge variant="default" className="bg-green-500">
            Connected
          </Badge>
        );
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-500 text-yellow-950">
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Data Connectors</h2>
        <Button onClick={onAddConnector}>
          <Plus className="mr-2 h-4 w-4" /> Add Connector
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connectors.map((connector) => (
          <Card key={connector.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{connector.name}</CardTitle>
                  <CardDescription>{connector.type}</CardDescription>
                </div>
                <div>{getStatusBadge(connector.status)}</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 text-sm">
                <span className="font-medium">Status:</span>
                <div className="flex items-center">
                  {getStatusIcon(connector.status)}
                  <span className="ml-1">
                    {connector.status === "connected"
                      ? "Active"
                      : connector.status === "error"
                        ? "Failed"
                        : "Setting up"}
                  </span>
                </div>
              </div>

              {connector.status === "connected" && (
                <div className="mt-2 text-sm">
                  <span className="font-medium">Last synced:</span>{" "}
                  {formatDate(connector.lastSync)}
                </div>
              )}

              {connector.status === "error" && connector.error && (
                <div className="mt-2 text-sm text-red-600">
                  <span className="font-medium">Error:</span> {connector.error}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end space-x-2 bg-gray-50 pt-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRefreshConnector(connector.id)}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh connection</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onConfigureConnector(connector.id)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Configure connector</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ConnectorsList;
