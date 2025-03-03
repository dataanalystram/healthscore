import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  Server,
  Database,
  Upload,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

import { mlBackend } from "@/api/mlBackend";

interface BackendIntegrationProps {
  onTrainingComplete?: (results: any) => void;
}

const BackendIntegration: React.FC<BackendIntegrationProps> = ({
  onTrainingComplete,
}) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [trainingJob, setTrainingJob] = useState<any>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [activeTab, setActiveTab] = useState("connection");
  const [uploadStatus, setUploadStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  // Connect to backend
  const connectToBackend = async () => {
    setIsConnecting(true);
    try {
      const connected = await mlBackend.initialize();
      setIsConnected(connected);

      if (connected) {
        // Try to get the latest training job
        const latestJob = await mlBackend.getLatestTrainingJob();
        if (latestJob) {
          setTrainingJob(latestJob);

          // If job is still running, start polling
          if (
            latestJob.status === "running" ||
            latestJob.status === "pending"
          ) {
            startPolling(latestJob.id);
          } else if (latestJob.status === "completed" && onTrainingComplete) {
            onTrainingComplete(latestJob.results);
          }
        }
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  // Start a new training job
  const startTrainingJob = async () => {
    try {
      // Create sample data for training
      const sampleData = Array(100)
        .fill(0)
        .map((_, i) => ({
          id: `customer_${i}`,
          features: {
            productUsageFrequency: Math.random(),
            supportTicketVolume: Math.random(),
            featureAdoptionRate: Math.random(),
            npsScore: Math.random(),
            contractValue: Math.random(),
            timeSinceLastLogin: Math.random(),
          },
          target: Math.random() > 0.7 ? 1 : 0,
        }));

      const job = await mlBackend.startTrainingJob(sampleData);
      if (job) {
        setTrainingJob(job);
        startPolling(job.id);
      }
    } catch (error) {
      console.error("Error starting training job:", error);
    }
  };

  // Poll for training job status
  const startPolling = (jobId: string) => {
    setIsPolling(true);
    const interval = setInterval(async () => {
      try {
        const updatedJob = await mlBackend.getTrainingJobStatus(jobId);
        if (updatedJob) {
          setTrainingJob(updatedJob);

          // Stop polling if job is completed or failed
          if (
            updatedJob.status === "completed" ||
            updatedJob.status === "failed"
          ) {
            clearInterval(interval);
            setIsPolling(false);

            if (updatedJob.status === "completed" && onTrainingComplete) {
              onTrainingComplete(updatedJob.results);
            }
          }
        }
      } catch (error) {
        console.error("Error polling training job status:", error);
        clearInterval(interval);
        setIsPolling(false);
      }
    }, 2000); // Poll every 2 seconds

    // Cleanup function
    return () => {
      clearInterval(interval);
      setIsPolling(false);
    };
  };

  // Handle file upload
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadStatus({ message: "Uploading..." });
      const result = await mlBackend.uploadCSV(file);
      setUploadStatus({
        success: result.success,
        message: result.message,
      });

      // If upload was successful and contains data, start training
      if (result.success && result.data) {
        // Start a new training job with the uploaded data
        const job = await mlBackend.startTrainingJob(result.data);
        if (job) {
          setTrainingJob(job);
          startPolling(job.id);
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus({
        success: false,
        message: `Error uploading file: ${error}`,
      });
    }
  };

  // Connect on component mount
  useEffect(() => {
    connectToBackend();

    // Cleanup polling on unmount
    return () => {
      setIsPolling(false);
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Server className="mr-2 h-5 w-5" />
            ML Backend Integration
          </div>
          {isConnected !== null && (
            <Badge
              variant={isConnected ? "default" : "destructive"}
              className={isConnected ? "bg-green-600" : ""}
            >
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="connection">
              <Server className="mr-2 h-4 w-4" />
              Connection
            </TabsTrigger>
            <TabsTrigger value="training">
              <Brain className="mr-2 h-4 w-4" />
              Training
            </TabsTrigger>
            <TabsTrigger value="data">
              <Database className="mr-2 h-4 w-4" />
              Data Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connection" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Backend Connection</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect to the FastAPI backend for ML processing
                  </p>
                </div>
                <Button
                  onClick={connectToBackend}
                  disabled={isConnecting}
                  variant={isConnected ? "outline" : "default"}
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : isConnected ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reconnect
                    </>
                  ) : (
                    <>
                      <Server className="mr-2 h-4 w-4" />
                      Connect
                    </>
                  )}
                </Button>
              </div>

              {isConnected === false && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Connection Failed</AlertTitle>
                  <AlertDescription>
                    Could not connect to the ML backend. Using local fallback
                    mode.
                  </AlertDescription>
                </Alert>
              )}

              {isConnected && (
                <div className="border rounded-md p-4 bg-gray-50">
                  <h4 className="font-medium mb-2">Backend Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Status:</div>
                    <div>Connected</div>
                    <div className="font-medium">URL:</div>
                    <div>http://localhost:8000</div>
                    <div className="font-medium">API Version:</div>
                    <div>v1.0</div>
                    <div className="font-medium">Mode:</div>
                    <div>Production</div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="training" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Model Training</h3>
                  <p className="text-sm text-muted-foreground">
                    Train ML models on the backend server
                  </p>
                </div>
                <Button
                  onClick={startTrainingJob}
                  disabled={
                    !isConnected ||
                    isPolling ||
                    trainingJob?.status === "running"
                  }
                >
                  <Brain className="mr-2 h-4 w-4" />
                  Start Training
                </Button>
              </div>

              {trainingJob && (
                <div className="border rounded-md p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Training Job Status</h4>
                    <Badge
                      variant={
                        {
                          completed: "default",
                          running: "secondary",
                          pending: "outline",
                          failed: "destructive",
                        }[trainingJob.status] as any
                      }
                      className={
                        {
                          completed: "bg-green-600",
                          running: "bg-blue-600",
                          pending: "",
                          failed: "",
                        }[trainingJob.status]
                      }
                    >
                      {
                        {
                          completed: <CheckCircle className="mr-1 h-3 w-3" />,
                          running: (
                            <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                          ),
                          pending: <Clock className="mr-1 h-3 w-3" />,
                          failed: <XCircle className="mr-1 h-3 w-3" />,
                        }[trainingJob.status]
                      }
                      {trainingJob.status.charAt(0).toUpperCase() +
                        trainingJob.status.slice(1)}
                    </Badge>
                  </div>

                  {(trainingJob.status === "running" ||
                    trainingJob.status === "pending") && (
                    <Progress
                      value={trainingJob.progress || 0}
                      className="h-2 mb-2"
                    />
                  )}

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Job ID:</div>
                    <div>{trainingJob.id}</div>
                    <div className="font-medium">Created:</div>
                    <div>
                      {new Date(trainingJob.created_at).toLocaleString()}
                    </div>
                    {trainingJob.completed_at && (
                      <>
                        <div className="font-medium">Completed:</div>
                        <div>
                          {new Date(trainingJob.completed_at).toLocaleString()}
                        </div>
                      </>
                    )}
                    {trainingJob.status === "failed" && trainingJob.error && (
                      <>
                        <div className="font-medium">Error:</div>
                        <div className="text-red-600">{trainingJob.error}</div>
                      </>
                    )}
                  </div>

                  {trainingJob.status === "completed" &&
                    trainingJob.results && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Training Results</h4>
                        <div className="text-sm">
                          <div>
                            <span className="font-medium">Accuracy:</span>{" "}
                            {(trainingJob.results.accuracy * 100).toFixed(2)}%
                          </div>
                          <div>
                            <span className="font-medium">F1 Score:</span>{" "}
                            {(trainingJob.results.f1_score * 100).toFixed(2)}%
                          </div>
                          <div>
                            <span className="font-medium">ROC AUC:</span>{" "}
                            {(trainingJob.results.roc_auc * 100).toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              )}

              {!trainingJob && isConnected && (
                <div className="text-center p-6 text-muted-foreground">
                  No training jobs found. Start a new training job to see
                  results.
                </div>
              )}

              {!isConnected && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Backend Not Connected</AlertTitle>
                  <AlertDescription>
                    Connect to the backend first to start training jobs.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Data Upload</h3>
                <p className="text-sm text-muted-foreground">
                  Upload CSV files to train models with your own data
                </p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-medium mb-2">
                  Drag and drop a CSV file or click to browse
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  CSV should contain customer features and a target column
                  (e.g., 'churn')
                </p>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  id="csv-upload"
                  onChange={handleFileUpload}
                  disabled={!isConnected}
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("csv-upload")?.click()}
                  disabled={!isConnected}
                >
                  Select CSV File
                </Button>
              </div>

              {uploadStatus && (
                <Alert
                  variant={uploadStatus.success ? "default" : "destructive"}
                >
                  {uploadStatus.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>
                    {uploadStatus.success
                      ? "Upload Successful"
                      : "Upload Failed"}
                  </AlertTitle>
                  <AlertDescription>{uploadStatus.message}</AlertDescription>
                </Alert>
              )}

              {!isConnected && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Backend Not Connected</AlertTitle>
                  <AlertDescription>
                    Connect to the backend first to upload data files.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BackendIntegration;
