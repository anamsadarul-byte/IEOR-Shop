import React, { createContext, useContext, useState, ReactNode } from "react";
import { UploadedData, DashboardData } from "@/types/data";
import { computeAnalytics } from "@/lib/analytics";

interface DataContextType {
  uploadedData: UploadedData | null;
  dashboardData: DashboardData | null;
  setUploadedData: (data: UploadedData) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [uploadedData, setUploadedDataState] = useState<UploadedData | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("ieor_auth") === "true";
  });

  const setUploadedData = (data: UploadedData) => {
    setUploadedDataState(data);
    const analytics = computeAnalytics(data);
    setDashboardData(analytics);
  };

  const login = (email: string, password: string): boolean => {
    if (email === "anamsadarul@gmail.com" && password === "T7") {
      setIsAuthenticated(true);
      localStorage.setItem("ieor_auth", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("ieor_auth");
    setUploadedDataState(null);
    setDashboardData(null);
  };

  return (
    <DataContext.Provider value={{ uploadedData, dashboardData, setUploadedData, isAuthenticated, login, logout }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
