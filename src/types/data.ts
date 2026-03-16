export interface SuperstoreRow {
  "Row ID": number;
  "Order ID": string;
  "Order Date": string;
  "Ship Date": string;
  "Ship Mode": string;
  "Customer ID": string;
  "Customer Name": string;
  "Segment": string;
  "Country": string;
  "City": string;
  "State": string;
  "Postal Code": string;
  "Region": string;
  "Product ID": string;
  "Category": string;
  "Sub-Category": string;
  "Product Name": string;
  "Sales": number;
  "Quantity": number;
  "Discount": number;
  "Profit": number;
}

export interface KPIData {
  totalSales: number;
  totalProfit: number;
  totalUnits: number;
  averageOrderValue: number;
  profitMargin: number;
}

export interface MonthlyTrend {
  month: string;
  date: Date;
  sales: number;
  profit: number;
}

export interface CategoryData {
  category: string;
  sales: number;
  profit: number;
}

export interface TopProduct {
  name: string;
  sales: number;
  profit: number;
}

export interface StateData {
  state: string;
  sales: number;
  profit: number;
}

export interface ScatterPoint {
  orderId: string;
  discount: number;
  profit: number;
  sales: number;
  category: string;
}

export interface DashboardData {
  raw: SuperstoreRow[];
  kpi: KPIData;
  monthlyTrends: MonthlyTrend[];
  categorySales: CategoryData[];
  topProducts: TopProduct[];
  stateSales: StateData[];
  scatterData: ScatterPoint[];
  years: number[];
  regions: string[];
  categories: string[];
}
