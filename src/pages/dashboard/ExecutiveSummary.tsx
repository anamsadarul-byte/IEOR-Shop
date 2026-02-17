import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle, TrendingUp, BarChart3, Archive } from "lucide-react";
import { useLocation } from "react-router-dom";

const ExecutiveSummary = () => {
  var { dashboardData } = useData();
  const location = useLocation();
  console.log(dashboardData.items)

  if (!dashboardData) return <p className="text-muted-foreground">No data loaded. Please upload files first.</p>;

  const kpis = [
    { title: "Total Orders", value: dashboardData.totalOrders, icon: Package, color: "text-primary" },
    { title: "Total Waste", value: dashboardData.totalWaste, icon: AlertTriangle, color: "text-destructive" },
    { title: "Unmet Demand", value: dashboardData.totalUnmetDemand, icon: BarChart3, color: "text-secondary" },
    // { title: "Service Level", value: `${result.overallServiceLevel.toFixed(1)}%`, icon: TrendingUp, color: "text-accent" },
    // { title: "Leftover Inventory", value: result.totalLeftover.toLocaleString(), icon: Archive, color: "text-muted-foreground" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Executive Summary</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="bg-card/90 backdrop-blur-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Per-item summary table */}
      <Card className="bg-card/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Item Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Item</th>
                  {/* <th className="text-right py-2 px-3 font-medium text-muted-foreground">Demand</th> */}
                  <th className="text-right py-2 px-3 font-medium text-muted-foreground">Ordered</th>
                  <th className="text-right py-2 px-3 font-medium text-muted-foreground">Waste</th>
                  <th className="text-right py-2 px-3 font-medium text-muted-foreground">Unmet</th>
                  {/* <th className="text-right py-2 px-3 font-medium text-muted-foreground">Service %</th> */}
                </tr>
              </thead>
              <tbody>
                {dashboardData.items.map((item) => (
                  <tr key={item.item} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-2 px-3 font-medium">{item.item}</td>
                    <td className="text-right py-2 px-3">{item.totalDemand}</td>
                    <td className="text-right py-2 px-3">{item.order}</td>
                    <td className="text-right py-2 px-3 text-destructive">{item.totalWaste}</td>
                    <td className="text-right py-2 px-3 text-secondary">{item.totalUnmetDemand}</td>
                    {/* <td className="text-right py-2 px-3">{item.serviceLevel.toFixed(1)}%</td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveSummary;
