import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Customer Health Platform</h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Leverage AI to analyze customer data and reduce churn
        </p>
      </div>

      <div className="flex gap-4">
        <Button size="lg" onClick={() => navigate("/dashboard")}>
          Go to Dashboard
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => navigate("/data-integration")}
        >
          Data Integration Hub
        </Button>
        <Button
          size="lg"
          variant="secondary"
          onClick={() => navigate("/scorecard-optimizer")}
        >
          Scorecard Optimizer
        </Button>
      </div>
    </div>
  );
}

export default Home;
