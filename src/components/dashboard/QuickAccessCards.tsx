import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, BarChart4, Brain, FlaskConical, Users } from "lucide-react";

interface QuickAccessCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const QuickAccessCard = ({
  title = "Feature",
  description = "Access this feature",
  icon = <Database size={24} />,
  onClick = () => {},
}: QuickAccessCardProps) => {
  return (
    <Card className="flex flex-col h-full bg-white hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          className="w-full justify-start text-primary"
          onClick={onClick}
        >
          Access now
        </Button>
      </CardFooter>
    </Card>
  );
};

interface QuickAccessCardsProps {
  cards?: QuickAccessCardProps[];
}

const QuickAccessCards = ({
  cards = [
    {
      title: "Data Integration",
      description: "Connect and manage your data sources",
      icon: <Database size={24} />,
      onClick: () => console.log("Navigate to Data Integration"),
    },
    {
      title: "Scoring Interface",
      description: "Adjust and customize health scoring parameters",
      icon: <BarChart4 size={24} />,
      onClick: () => console.log("Navigate to Scoring Interface"),
    },
    {
      title: "AI Analysis",
      description: "Get AI-powered insights and recommendations",
      icon: <Brain size={24} />,
      onClick: () => console.log("Navigate to AI Analysis"),
    },
    {
      title: "Simulation",
      description: "Test changes in a sandbox environment",
      icon: <FlaskConical size={24} />,
      onClick: () => console.log("Navigate to Simulation"),
    },
    {
      title: "Collaboration",
      description: "Share and collaborate with your team",
      icon: <Users size={24} />,
      onClick: () => console.log("Navigate to Collaboration"),
    },
  ],
}: QuickAccessCardsProps) => {
  return (
    <div className="w-full bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card, index) => (
          <QuickAccessCard
            key={index}
            title={card.title}
            description={card.description}
            icon={card.icon}
            onClick={card.onClick}
          />
        ))}
      </div>
    </div>
  );
};

export default QuickAccessCards;
