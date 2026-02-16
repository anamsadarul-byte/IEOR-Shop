import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["hsl(160, 50%, 40%)", "hsl(0, 72%, 50%)", "hsl(35, 90%, 55%)"];

const WasteShortage = () => {
  const { dashboardData } = useData();

  if (!dashboardData) return <p className="text-muted-foreground">No data loaded.</p>;

  const items = dashboardData.items;

  const barData = items.map((item) => ({
    name: item.item,
    Waste: item.totalWaste,
    "Unmet Demand": item.totalUnmetDemand,
  }));

  const totalDemand = items.reduce((s, i) => s + i.totalDemand, 0);
  const totalFulfilled = totalDemand - dashboardData.totalUnmetDemand;
  const pieData = [
    { name: "Fulfilled", value: totalFulfilled },
    { name: "Waste", value: dashboardData.totalWaste },
    { name: "Shortage", value: dashboardData.totalUnmetDemand },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Waste & Shortage Analysis</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="bg-card/90 backdrop-blur-sm">
          <CardHeader><CardTitle style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Per-Item Waste & Shortage</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Waste" fill="hsl(0, 72%, 50%)" />
                <Bar dataKey="Unmet Demand" fill="hsl(35, 90%, 55%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/90 backdrop-blur-sm">
          <CardHeader><CardTitle style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Overall Breakdown</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={120} innerRadius={60} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/90 backdrop-blur-sm">
        <CardHeader><CardTitle style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Per-Item Service Level</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.item} className="flex items-center gap-4">
                <span className="w-32 text-sm font-medium truncate">{item.item}</span>
                <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${item.serviceLevel}%`,
                      backgroundColor: item.serviceLevel >= 90 ? "hsl(160, 50%, 40%)" : item.serviceLevel >= 70 ? "hsl(35, 90%, 55%)" : "hsl(0, 72%, 50%)",
                    }}
                  />
                </div>
                <span className="text-sm font-mono w-16 text-right">{item.serviceLevel.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WasteShortage;
