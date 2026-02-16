import { useState } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronRight } from "lucide-react";

const ItemDetails = () => {
  const { dashboardData } = useData();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<string>("item");
  const [sortAsc, setSortAsc] = useState(true);

  if (!dashboardData) return <p className="text-muted-foreground">No data loaded.</p>;

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sorted = [...dashboardData.items].sort((a, b) => {
    const av = (a as any)[sortKey];
    const bv = (b as any)[sortKey];
    if (typeof av === "string") return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    return sortAsc ? av - bv : bv - av;
  });

  const SortHeader = ({ label, keyName }: { label: string; keyName: string }) => (
    <th
      className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none"
      onClick={() => handleSort(keyName)}
    >
      {label} {sortKey === keyName ? (sortAsc ? "↑" : "↓") : ""}
    </th>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Item Details</h1>

      <Card className="bg-card/90 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="w-8"></th>
                  <SortHeader label="Item" keyName="item" />
                  <SortHeader label="Shelf Life" keyName="shelfLifeDays" />
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Delivery Days</th>
                  <SortHeader label="Total Demand" keyName="totalDemand" />
                  <SortHeader label="Ordered" keyName="totalOrdered" />
                  <SortHeader label="Waste" keyName="totalWaste" />
                  <SortHeader label="Shortage" keyName="totalUnmetDemand" />
                  <SortHeader label="Service %" keyName="serviceLevel" />
                </tr>
              </thead>
              <tbody>
                {sorted.map((item) => (
                  <>
                    <tr
                      key={item.item}
                      className="border-b hover:bg-muted/50 cursor-pointer"
                      onClick={() => setExpandedItem(expandedItem === item.item ? null : item.item)}
                    >
                      <td className="py-2 px-2">
                        {expandedItem === item.item ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </td>
                      <td className="py-2 px-3 font-medium">{item.item}</td>
                      <td className="py-2 px-3">{item.shelfLifeDays}d</td>
                      <td className="py-2 px-3 text-xs">{item.deliveryDays.join(", ")}</td>
                      <td className="py-2 px-3">{item.totalDemand}</td>
                      <td className="py-2 px-3">{item.totalOrdered}</td>
                      <td className="py-2 px-3 text-destructive">{item.totalWaste}</td>
                      <td className="py-2 px-3">{item.totalUnmetDemand}</td>
                      <td className="py-2 px-3">{item.serviceLevel.toFixed(1)}%</td>
                    </tr>
                    {expandedItem === item.item && (
                      <tr key={`${item.item}-detail`}>
                        <td colSpan={9} className="bg-muted/30 p-4">
                          <div className="overflow-auto max-h-60">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left py-1 px-2">Day</th>
                                  <th className="text-right py-1 px-2">Opening</th>
                                  <th className="text-right py-1 px-2">Delivery</th>
                                  <th className="text-right py-1 px-2">Demand</th>
                                  <th className="text-right py-1 px-2">Expired</th>
                                  <th className="text-right py-1 px-2">Closing</th>
                                  <th className="text-right py-1 px-2">Unmet</th>
                                </tr>
                              </thead>
                              <tbody>
                                {item.dailyBreakdown.map((d) => (
                                  <tr key={d.day} className="border-b last:border-0">
                                    <td className="py-1 px-2">Day {d.day}</td>
                                    <td className="text-right py-1 px-2">{d.openingStock}</td>
                                    <td className="text-right py-1 px-2">{d.delivery > 0 ? d.delivery : "-"}</td>
                                    <td className="text-right py-1 px-2">{d.demand}</td>
                                    <td className="text-right py-1 px-2 text-destructive">{d.expired > 0 ? d.expired : "-"}</td>
                                    <td className="text-right py-1 px-2">{d.closingStock}</td>
                                    <td className="text-right py-1 px-2">{d.unmetDemand > 0 ? d.unmetDemand : "-"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemDetails;
