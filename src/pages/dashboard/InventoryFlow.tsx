import { useState } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";

const InventoryFlow = () => {
  const { dashboardData } = useData();
  const [selectedItem, setSelectedItem] = useState<string>("");

  if (!dashboardData) return <p className="text-muted-foreground">No data loaded.</p>;

  const items = dashboardData.items;
  const currentItem = selectedItem || items[0]?.item || "";
  const itemData = items.find((i) => i.item === currentItem);

  if (!itemData) return <p className="text-muted-foreground">No item data found.</p>;

  const chartData = itemData.dailyBreakdown.map((d) => ({
    day: `Day ${d.day}`,
    "Opening Stock": d.openingStock,
    Delivery: d.delivery,
    Demand: d.demand,
    Expired: d.expired,
    "Closing Stock": d.closingStock,
    "Unmet Demand": d.unmetDemand,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Inventory Flow Analysis</h1>

      <div className="mb-4">
        <select
          className="border rounded-md px-3 py-2 text-sm bg-card"
          value={currentItem}
          onChange={(e) => setSelectedItem(e.target.value)}
        >
          {items.map((item) => (
            <option key={item.item} value={item.item}>{item.item}</option>
          ))}
        </select>
      </div>

      <Card className="bg-card/90 backdrop-blur-sm mb-6">
        <CardHeader><CardTitle style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Daily Inventory Levels — {currentItem}</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="Opening Stock" fill="hsl(210, 80%, 45%)" stroke="hsl(210, 80%, 45%)" fillOpacity={0.2} />
              <Area type="monotone" dataKey="Closing Stock" fill="hsl(160, 50%, 40%)" stroke="hsl(160, 50%, 40%)" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-card/90 backdrop-blur-sm">
        <CardHeader><CardTitle style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Daily Events — {currentItem}</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Delivery" stroke="hsl(35, 90%, 55%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Demand" stroke="hsl(210, 80%, 45%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Expired" stroke="hsl(0, 72%, 50%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Unmet Demand" stroke="hsl(280, 60%, 55%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryFlow;
