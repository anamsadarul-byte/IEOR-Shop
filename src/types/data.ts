// Types for uploaded Excel data and computed analytics

export interface ForecastedDemand {
  item: string;
  dailyDemand: number[]; // 28 days
}

export interface CurrentInventory {
  item: string;
  openingStock: number;
}

export interface ShelfLife {
  item: string;
  shelfLifeDays: number;
}

export interface DeliverySchedule {
  item: string;
  deliveryDays: number[]; // which days deliveries can happen (1-indexed)
}

export interface UploadedData {
  forecastedDemand: ForecastedDemand[];
  currentInventory: CurrentInventory[];
  shelfLife: ShelfLife[];
  deliverySchedule: DeliverySchedule[];
}

export interface DailyInventory {
  day: number;
  openingStock: number;
  delivery: number;
  demand: number;
  expired: number;
  closingStock: number;
  unmetDemand: number;
}

export interface ItemAnalytics {
  item: string;
  shelfLifeDays: number;
  deliveryDays: number[];
  totalDemand: number;
  totalOrdered: number;
  totalWaste: number;
  totalUnmetDemand: number;
  serviceLevel: number;
  leftoverInventory: number;
  dailyBreakdown: DailyInventory[];
  orderSchedule: { day: number; quantity: number }[];
}

export interface DashboardData {
  items: ItemAnalytics[];
  totalOrders: number;
  totalWaste: number;
  totalUnmetDemand: number;
  overallServiceLevel: number;
  totalLeftover: number;
}
