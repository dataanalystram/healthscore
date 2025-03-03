import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DatabaseIcon, KeyIcon, ServerIcon, ShieldIcon } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// Form schema for validation
const formSchema = z.object({
  // Connection Details
  connectorName: z.string().min(2, { message: "Connector name is required" }),
  connectorType: z.string().min(1, { message: "Connector type is required" }),
  description: z.string().optional(),

  // Authentication
  authType: z.string().min(1, { message: "Authentication type is required" }),
  apiKey: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  oauthClientId: z.string().optional(),
  oauthClientSecret: z.string().optional(),

  // Data Schema
  schemaType: z.string().min(1, { message: "Schema type is required" }),
  customSchema: z.string().optional(),

  // Advanced Settings
  pollingInterval: z.string().optional(),
  enableWebhooks: z.boolean().default(false),
  webhookUrl: z.string().optional(),
  enableLogging: z.boolean().default(true),
});

interface ConnectorFormProps {
  onSubmit?: (data: z.infer<typeof formSchema>) => void;
  onCancel?: () => void;
  initialData?: z.infer<typeof formSchema>;
  isOpen?: boolean;
}

const ConnectorForm = ({
  onSubmit = () => {},
  onCancel = () => {},
  initialData = {
    connectorName: "",
    connectorType: "salesforce",
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
  },
  isOpen = true,
}: ConnectorFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    // In a real implementation, this would validate the connection before saving
    console.log("Form data submitted:", data);
    onSubmit(data);
  };

  const connectorTypes = [
    { value: "salesforce", label: "Salesforce" },
    { value: "zendesk", label: "Zendesk" },
    { value: "hubspot", label: "HubSpot" },
    { value: "jira", label: "Jira" },
    { value: "custom", label: "Custom API" },
  ];

  const authTypes = [
    { value: "apiKey", label: "API Key" },
    { value: "basic", label: "Basic Auth" },
    { value: "oauth2", label: "OAuth 2.0" },
  ];

  const schemaTypes = [
    { value: "predefined", label: "Use Predefined Schema" },
    { value: "custom", label: "Custom Schema" },
    { value: "auto", label: "Auto-detect Schema" },
  ];

  const pollingIntervals = [
    { value: "5", label: "5 minutes" },
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "60", label: "1 hour" },
    { value: "360", label: "6 hours" },
    { value: "720", label: "12 hours" },
    { value: "1440", label: "24 hours" },
  ];

  return (
    <Card className="w-full max-w-4xl bg-white">
      <CardHeader>
        <CardTitle>Configure Data Source Connection</CardTitle>
        <CardDescription>
          Set up a new data source connection for your customer health scoring
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <Tabs defaultValue="connection" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="connection">
                  <ServerIcon className="mr-2 h-4 w-4" />
                  Connection
                </TabsTrigger>
                <TabsTrigger value="authentication">
                  <KeyIcon className="mr-2 h-4 w-4" />
                  Authentication
                </TabsTrigger>
                <TabsTrigger value="schema">
                  <DatabaseIcon className="mr-2 h-4 w-4" />
                  Data Schema
                </TabsTrigger>
                <TabsTrigger value="advanced">
                  <ShieldIcon className="mr-2 h-4 w-4" />
                  Advanced
                </TabsTrigger>
              </TabsList>

              {/* Connection Details Tab */}
              <TabsContent value="connection" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="connectorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Connector Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="My Salesforce Connector"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A unique name to identify this connector
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="connectorType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Connector Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select connector type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {connectorTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The type of data source to connect to
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Description of this connector's purpose"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Additional details about this connector
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Authentication Tab */}
              <TabsContent value="authentication" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="authType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Authentication Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select authentication type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {authTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose how to authenticate with this data source
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("authType") === "apiKey" && (
                  <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter API key"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The API key for authenticating with this service
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {form.watch("authType") === "basic" && (
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {form.watch("authType") === "oauth2" && (
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="oauthClientId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>OAuth Client ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter client ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="oauthClientSecret"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>OAuth Client Secret</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter client secret"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </TabsContent>

              {/* Data Schema Tab */}
              <TabsContent value="schema" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="schemaType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Schema Configuration</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select schema type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {schemaTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose how to define the data schema for this connector
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("schemaType") === "custom" && (
                  <FormField
                    control={form.control}
                    name="customSchema"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Schema Definition</FormLabel>
                        <FormControl>
                          <textarea
                            className="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Enter JSON schema definition"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Define your custom schema in JSON format
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {form.watch("schemaType") === "predefined" && (
                  <div className="rounded-md border p-4 bg-muted/20">
                    <p className="text-sm font-medium mb-2">
                      Predefined Schema Fields
                    </p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Customer ID (String)</li>
                      <li>• Customer Name (String)</li>
                      <li>• Subscription Status (String)</li>
                      <li>• Subscription Tier (String)</li>
                      <li>• Last Activity Date (Date)</li>
                      <li>• Total Spend (Number)</li>
                      <li>• Support Tickets (Number)</li>
                      <li>• Feature Usage (Object)</li>
                    </ul>
                  </div>
                )}

                {form.watch("schemaType") === "auto" && (
                  <div className="rounded-md border p-4 bg-muted/20">
                    <p className="text-sm text-muted-foreground">
                      The system will automatically detect and map fields from
                      your data source. You'll be able to review and adjust the
                      schema after the connection is established.
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Advanced Settings Tab */}
              <TabsContent value="advanced" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="pollingInterval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Polling Interval</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select polling interval" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {pollingIntervals.map((interval) => (
                            <SelectItem
                              key={interval.value}
                              value={interval.value}
                            >
                              {interval.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How often to fetch new data from this source
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enableWebhooks"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Enable Webhooks
                        </FormLabel>
                        <FormDescription>
                          Receive real-time updates when data changes
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("enableWebhooks") && (
                  <FormField
                    control={form.control}
                    name="webhookUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Webhook URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://your-app.com/webhooks/data-source"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          URL where webhook events will be sent
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="enableLogging"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Enable Detailed Logging
                        </FormLabel>
                        <FormDescription>
                          Log detailed information about data sync operations
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <CardFooter className="flex justify-between px-0">
              <Button variant="outline" type="button" onClick={onCancel}>
                Cancel
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline" type="button">
                  Test Connection
                </Button>
                <Button type="submit">Save Connector</Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ConnectorForm;
