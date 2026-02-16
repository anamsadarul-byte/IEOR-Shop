import * as XLSX from "xlsx";
import { ForecastedDemand, CurrentInventory, ShelfLife, DeliverySchedule } from "@/types/data";

export function parseForecastedDemand(file: File): Promise<ForecastedDemand[]> {
  return readFile(file).then((wb) => {
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    // First row is header, first column is item name, rest are daily demand
    const result: ForecastedDemand[] = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || !row[0]) continue;
      result.push({
        item: String(row[0]).trim(),
        dailyDemand: row.slice(1).map((v: any) => Number(v) || 0),
      });
    }
    return result;
  });
}

export function parseCurrentInventory(file: File): Promise<CurrentInventory[]> {
  return readFile(file).then((wb) => {
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const result: CurrentInventory[] = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || !row[0]) continue;
      result.push({
        item: String(row[0]).trim(),
        openingStock: Number(row[1]) || 0,
      });
    }
    return result;
  });
}

export function parseShelfLife(file: File): Promise<ShelfLife[]> {
  return readFile(file).then((wb) => {
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const result: ShelfLife[] = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || !row[0]) continue;
      result.push({
        item: String(row[0]).trim(),
        shelfLifeDays: Number(row[1]) || 1,
      });
    }
    return result;
  });
}

export function parseDeliverySchedule(file: File): Promise<DeliverySchedule[]> {
  return readFile(file).then((wb) => {
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const result: DeliverySchedule[] = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || !row[0]) continue;
      result.push({
        item: String(row[0]).trim(),
        deliveryDays: row.slice(1).filter((v: any) => v !== null && v !== undefined && v !== "").map((v: any) => Number(v) || 0),
      });
    }
    return result;
  });
}

function readFile(file: File): Promise<XLSX.WorkBook> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        resolve(wb);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
