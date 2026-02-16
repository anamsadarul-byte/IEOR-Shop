import { UploadedData, DashboardData, ItemAnalytics, DailyInventory } from "@/types/data";

export function computeAnalytics(data: UploadedData): DashboardData {
  const { forecastedDemand, currentInventory, shelfLife, deliverySchedule } = data;
  const items: ItemAnalytics[] = [];

  for (const fd of forecastedDemand) {
    const itemName = fd.item;
    const inv = currentInventory.find((i) => i.item === itemName);
    const sl = shelfLife.find((i) => i.item === itemName);
    const ds = deliverySchedule.find((i) => i.item === itemName);

    if (!inv || !sl || !ds) continue;

    const shelfLifeDays = sl.shelfLifeDays;
    const deliveryDays = ds.deliveryDays;
    const dailyDemand = fd.dailyDemand;
    const numDays = dailyDemand.length;

    // Track inventory batches with expiry: { quantity, expiresOnDay }
    type Batch = { quantity: number; expiresOnDay: number };
    let batches: Batch[] = [{ quantity: inv.openingStock, expiresOnDay: shelfLifeDays + 1 }];

    const dailyBreakdown: DailyInventory[] = [];
    const orderSchedule: { day: number; quantity: number }[] = [];
    let totalWaste = 0;
    let totalUnmetDemand = 0;
    let totalOrdered = 0;
    let totalDemandSum = 0;
    let totalFulfilled = 0;

    for (let day = 1; day <= numDays; day++) {
      const openingStock = batches.reduce((s, b) => s + b.quantity, 0);

      // Check for deliveries — simple heuristic: order enough to cover next few days
      let delivery = 0;
      if (deliveryDays.includes(day)) {
        // Order enough for demand until next delivery day
        const nextDeliveryIdx = deliveryDays.indexOf(day);
        const nextDelivery = nextDeliveryIdx < deliveryDays.length - 1
          ? deliveryDays[nextDeliveryIdx + 1]
          : numDays + 1;
        const daysUntilNext = Math.min(nextDelivery - day, numDays - day + 1);
        let futureDemand = 0;
        for (let d = day; d < day + daysUntilNext && d <= numDays; d++) {
          futureDemand += dailyDemand[d - 1];
        }
        delivery = Math.max(0, futureDemand - openingStock);
        if (delivery > 0) {
          batches.push({ quantity: delivery, expiresOnDay: day + shelfLifeDays });
          orderSchedule.push({ day, quantity: delivery });
          totalOrdered += delivery;
        }
      }

      // Expire old batches
      let expired = 0;
      batches = batches.filter((b) => {
        if (b.expiresOnDay <= day) {
          expired += b.quantity;
          return false;
        }
        return true;
      });
      totalWaste += expired;

      // Fulfill demand (FIFO)
      const demand = dailyDemand[day - 1] || 0;
      totalDemandSum += demand;
      let remaining = demand;
      for (const batch of batches) {
        if (remaining <= 0) break;
        const take = Math.min(batch.quantity, remaining);
        batch.quantity -= take;
        remaining -= take;
      }
      batches = batches.filter((b) => b.quantity > 0);
      const unmet = remaining;
      totalUnmetDemand += unmet;
      totalFulfilled += demand - unmet;

      const closingStock = batches.reduce((s, b) => s + b.quantity, 0);

      dailyBreakdown.push({
        day,
        openingStock,
        delivery,
        demand,
        expired,
        closingStock,
        unmetDemand: unmet,
      });
    }

    const serviceLevel = totalDemandSum > 0 ? (totalFulfilled / totalDemandSum) * 100 : 100;
    const leftoverInventory = batches.reduce((s, b) => s + b.quantity, 0);

    items.push({
      item: itemName,
      shelfLifeDays,
      deliveryDays,
      totalDemand: totalDemandSum,
      totalOrdered,
      totalWaste,
      totalUnmetDemand,
      serviceLevel,
      leftoverInventory,
      dailyBreakdown,
      orderSchedule,
    });
  }

  const totalOrders = items.reduce((s, i) => s + i.totalOrdered, 0);
  const totalWaste = items.reduce((s, i) => s + i.totalWaste, 0);
  const totalUnmetDemand = items.reduce((s, i) => s + i.totalUnmetDemand, 0);
  const totalDemand = items.reduce((s, i) => s + i.totalDemand, 0);
  const totalFulfilled = totalDemand - totalUnmetDemand;
  const overallServiceLevel = totalDemand > 0 ? (totalFulfilled / totalDemand) * 100 : 100;
  const totalLeftover = items.reduce((s, i) => s + i.leftoverInventory, 0);

  return { items, totalOrders, totalWaste, totalUnmetDemand, overallServiceLevel, totalLeftover };
}
