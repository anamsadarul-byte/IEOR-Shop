import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Package, Upload, FileSpreadsheet, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { parseForecastedDemand, parseCurrentInventory, parseShelfLife, parseDeliverySchedule } from "@/lib/parseExcel";
import { UploadedData } from "@/types/data";

const steps = [
  {
    title: "Upload Forecasted Demand",
    description: "Excel file with daily demand forecasts per item. First column: item name, remaining columns: daily demand (Day 1, Day 2, ... Day 28).",
    icon: "📊",
  },
  {
    title: "Upload Current Inventory",
    description: "Excel file with opening inventory levels. Two columns: Item Name and Opening Stock.",
    icon: "📦",
  },
  {
    title: "Upload Shelf Life of Products",
    description: "Excel file with shelf life in days per item. Two columns: Item Name and Shelf Life (days).",
    icon: "⏳",
  },
  {
    title: "Upload Delivery Schedule",
    description: "Excel file with allowed delivery days per item. First column: Item Name, remaining columns: delivery day numbers.",
    icon: "🚚",
  },
];

const UploadWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [files, setFiles] = useState<(File | null)[]>([null, null, null, null]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setUploadedData } = useData();
  const navigate = useNavigate();
  const { setDashboardData } = useData();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const newFiles = [...files];
      newFiles[currentStep] = file;
      setFiles(newFiles);
      setError("");
    }
  };

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // All files uploaded — parse and process
      setLoading(true);
      setError("");
      try {
        const [forecastedDemand, currentInventory, shelfLife, deliverySchedule] = await Promise.all([
          parseForecastedDemand(files[0]!),
          parseCurrentInventory(files[1]!),
          parseShelfLife(files[2]!),
          parseDeliverySchedule(files[3]!),
        ]);

        const data: UploadedData = { forecastedDemand, currentInventory, shelfLife, deliverySchedule };
        setUploadedData(data);
        const form = new FormData();
        form.append("forecast", files[0]);
        form.append("inventory", files[1]);
        form.append("shelf", files[2]);
        form.append("delivery", files[3]);

        const response = await fetch("http://127.0.0.1:8000/run-model", {
          method: "POST",
          body: form,
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText || "API request failed");
        }
        const result = await response.json();
        console.log("Optimization result:", result);
        setDashboardData({
          status: result.status,
          items: result.results ?? [],
          totalOrders: result.TotalOrders ?? 0,
          totalWaste: result.TotalWaste ?? 0,
          totalUnmetDemand: result.totalUnmetDemand ?? 0,
          overallServiceLevel: result.serviceLevel ?? 0,
          totalLeftover: result.leftover ?? 0
        });
        navigate("/dashboard");
      } catch (err) {
        setError("Failed to parse Excel files. Please check the format and try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const progress = ((currentStep + (files[currentStep] ? 1 : 0)) / 4) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center ieor-bg ieor-grid-bg relative overflow-hidden">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[20vw] font-bold tracking-wider text-primary/[0.04]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          IEOR
        </span>
      </div>

      {/* Header */}
      <div className="absolute top-8 left-8 flex items-center gap-3 text-primary/60">
        <Package className="h-8 w-8" />
        <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>IEOR</span>
      </div>

      <div className="w-full max-w-lg mx-4 relative z-10">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {currentStep + 1} of 4</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-3">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  i < currentStep
                    ? "bg-accent text-accent-foreground"
                    : i === currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i < currentStep ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-2xl border-border/50 backdrop-blur-sm bg-card/95">
          <CardHeader className="text-center">
            <div className="text-4xl mb-2">{steps[currentStep].icon}</div>
            <CardTitle className="text-xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleFileSelect}
              />
              {files[currentStep] ? (
                <div className="flex flex-col items-center gap-2">
                  <FileSpreadsheet className="h-10 w-10 text-accent" />
                  <p className="font-medium text-sm">{files[currentStep]!.name}</p>
                  <p className="text-xs text-muted-foreground">Click to change file</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="font-medium text-sm">Click to upload Excel file</p>
                  <p className="text-xs text-muted-foreground">.xlsx, .xls, or .csv</p>
                </div>
              )}
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">{error}</p>
            )}

            <div className="flex gap-3">
              {currentStep > 0 && (
                <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!files[currentStep] || loading}
                className="flex-1"
              >
                {loading
                  ? "Processing..."
                  : currentStep === 3
                  ? "Generate Analytics"
                  : "Next"}
                {!loading && <ArrowRight className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadWizard;
