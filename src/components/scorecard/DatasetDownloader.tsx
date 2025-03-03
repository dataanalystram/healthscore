import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { comprehensiveCustomerData } from "@/data/customerDataset";
import { largeCustomerData } from "@/data/largeCustomerDataset";

interface DatasetDownloaderProps {
  useLargeDataset?: boolean;
}

const DatasetDownloader = ({
  useLargeDataset = false,
}: DatasetDownloaderProps) => {
  const downloadDataset = () => {
    // Convert the dataset to CSV format
    const headers = [
      "id",
      "name",
      "company",
      "companySize",
      "industry",
      "productUsageFrequency",
      "supportTicketVolume",
      "featureAdoptionRate",
      "npsScore",
      "contractValue",
      "timeSinceLastLogin",
      "status",
      "churnProbability",
      "customerSince",
      "lastContact",
    ];

    const csvRows = [];
    csvRows.push(headers.join(","));

    const dataToUse = useLargeDataset
      ? largeCustomerData
      : comprehensiveCustomerData;

    for (const customer of dataToUse) {
      const values = [
        customer.id,
        `"${customer.name}"`,
        `"${customer.company}"`,
        `"${customer.companySize}"`,
        `"${customer.industry}"`,
        customer.metrics.productUsageFrequency,
        customer.metrics.supportTicketVolume,
        customer.metrics.featureAdoptionRate,
        customer.metrics.npsScore,
        customer.metrics.contractValue,
        customer.metrics.timeSinceLastLogin,
        `"${customer.status}"`,
        customer.churnProbability,
        `"${customer.customerSince}"`,
        `"${customer.lastContact}"`,
      ];
      csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute(
      "download",
      useLargeDataset
        ? "large_customer_health_dataset.csv"
        : "customer_health_dataset.csv",
    );
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Button onClick={downloadDataset} variant="outline">
      <Download className="mr-2 h-4 w-4" />
      Download Dataset CSV
    </Button>
  );
};

export default DatasetDownloader;
