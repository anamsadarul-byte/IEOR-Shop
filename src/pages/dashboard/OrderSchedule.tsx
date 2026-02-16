import { useState } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = [
  "hsl(210, 80%, 45%)", "hsl(35, 90%, 55%)", "hsl(160, 50%, 40%)",
  "hsl(280, 60%, 55%)", "hsl(0, 72%, 50%)", "hsl(190, 70%, 45%)",
  "hsl(50, 80%, 50%)", "hsl(320, 60%, 50%)", "hsl(100, 50%, 40%)", "hsl(240, 50%, 55%)",
];

const OrderSchedule = () => {
  const { dashboardData } = useData();
  const [selectedItem, setSelectedItem] = useState<string>("all");

  if (!dashboardData) return <p className="text-muted-foreground">No data loaded.</p>;

  const items = dashboardData.items;
  const filteredItems = selectedItem === "all" ? items : items.filter((i) => i.item === selectedItem);

  // Build chart data: for each day, show order quantities per item
  const numDays = items[0]?.dailyBreakdown.length || 28;
  const chartData = [];
  for (let day = 1; day <= numDays; day++) {
    const entry: any = { day: `Day ${day}` };
    for (const item of filteredItems) {
      const order = item.orderSchedule.find((o) => o.day === day);
      entry[item.item] = order ? order.quantity : 0;
    }
    chartData.push(entry);
  }

  // Order summary table
  const allOrders = filteredItems.flatMap((item) =>
    item.orderSchedule.map((o) => ({ item: item.item, day: o.day, quantity: o.quantity }))
  ).sort((a, b) => a.day - b.day);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Order Schedule & Timeline</h1>

      <div className="mb-4">
        <select
          className="border rounded-md px-3 py-2 text-sm bg-card"
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
        >
          <option value="all">All Items</option>
          {items.map((item) => (
            <option key={item.item} value={item.item}>{item.item}</option>
          ))}
        </select>
      </div>

      <Card className="bg-card/90 backdrop-blur-sm mb-6">
        <CardHeader><CardTitle style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Order Timeline</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              {filteredItems.map((item, idx) => (
                <Bar key={item.item} dataKey={item.item} fill={COLORS[idx % COLORS.length]} stackId="orders" />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-card/90 backdrop-blur-sm">
        <CardHeader><CardTitle style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Order Summary</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-auto max-h-80">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Item</th>
                  <th className="text-right py-2 px-3 font-medium text-muted-foreground">Day</th>
                  <th className="text-right py-2 px-3 font-medium text-muted-foreground">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {allOrders.map((o, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-2 px-3">{o.item}</td>
                    <td className="text-right py-2 px-3">Day {o.day}</td>
                    <td className="text-right py-2 px-3 font-medium">{o.quantity}</td>
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

export default OrderSchedule;
