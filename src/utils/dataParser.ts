import Papa from 'papaparse';
import type { 
  SuperstoreRow, 
  DashboardData, 
  KPIData, 
  MonthlyTrend, 
  CategoryData, 
  TopProduct, 
  StateData, 
  ScatterPoint 
} from '../types/data';

// Helper to parse dates like "11/8/2016" (M/D/YYYY)
const parseDate = (dateStr: string): Date => {
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    return new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
  }
  return new Date(dateStr); // Fallback
};

export const loadData = async (csvText: string): Promise<SuperstoreRow[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse<SuperstoreRow>(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<SuperstoreRow>) => {
        resolve(results.data);
      },
      error: (error: Error) => {
        reject(error);
      }
    });
  });
};

export const processDashboardData = (
  rawData: SuperstoreRow[], 
  filterYear: string | 'All',
  filterRegion: string | 'All',
  filterCategory: string | 'All'
): DashboardData => {
  
  // 1. Filter data based on selections
  const filteredData = rawData.filter(row => {
    const rowDate = parseDate(row['Order Date']);
    const passYear = filterYear === 'All' || rowDate.getFullYear().toString() === filterYear;
    const passRegion = filterRegion === 'All' || row['Region'] === filterRegion;
    const passCategory = filterCategory === 'All' || row['Category'] === filterCategory;
    return passYear && passRegion && passCategory;
  });

  // 2. Extract unique filter options (from all data)
  const yearsSet = new Set<number>();
  const regionsSet = new Set<string>();
  const categoriesSet = new Set<string>();
  
  rawData.forEach(row => {
    if (row['Order Date']) {
      yearsSet.add(parseDate(row['Order Date']).getFullYear());
    }
    if (row['Region']) regionsSet.add(row['Region']);
    if (row['Category']) categoriesSet.add(row['Category']);
  });

  const years = Array.from(yearsSet).sort((a, b) => b - a);
  const regions = Array.from(regionsSet).sort();
  const categories = Array.from(categoriesSet).sort();

  // 3. Compute KPIs
  let totalSales = 0;
  let totalProfit = 0;
  let totalUnits = 0;
  const orderIds = new Set<string>();

  filteredData.forEach(row => {
    totalSales += row['Sales'] || 0;
    totalProfit += row['Profit'] || 0;
    totalUnits += row['Quantity'] || 0;
    if (row['Order ID']) orderIds.add(row['Order ID']);
  });

  const kpi: KPIData = {
    totalSales,
    totalProfit,
    totalUnits,
    averageOrderValue: orderIds.size > 0 ? totalSales / orderIds.size : 0,
    profitMargin: totalSales > 0 ? (totalProfit / totalSales) * 100 : 0
  };

  // 4. Monthly Trends
  const monthMap = new Map<string, MonthlyTrend>();
  
  filteredData.forEach(row => {
    if (!row['Order Date']) return;
    const date = parseDate(row['Order Date']);
    // Format: "YYYY-MM"
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, {
        month: monthKey, // e.g., '2016-11'
        date: new Date(date.getFullYear(), date.getMonth(), 1), // 1st of the month for sorting
        sales: 0,
        profit: 0
      });
    }
    
    const curr = monthMap.get(monthKey)!;
    curr.sales += row['Sales'] || 0;
    curr.profit += row['Profit'] || 0;
  });

  const monthlyTrends = Array.from(monthMap.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Format month string for display "Nov 16"
  monthlyTrends.forEach(item => {
    item.month = item.date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  });

  // 5. Category Sales
  const categoryMap = new Map<string, CategoryData>();
  filteredData.forEach(row => {
    const cat = row['Category'];
    if (!cat) return;
    if (!categoryMap.has(cat)) {
      categoryMap.set(cat, { category: cat, sales: 0, profit: 0 });
    }
    const curr = categoryMap.get(cat)!;
    curr.sales += row['Sales'] || 0;
    curr.profit += row['Profit'] || 0;
  });
  const categorySales = Array.from(categoryMap.values()).sort((a, b) => b.sales - a.sales);

  // 6. Top Products
  const productMap = new Map<string, TopProduct>();
  filteredData.forEach(row => {
    const prod = row['Product Name'];
    if (!prod) return;
    if (!productMap.has(prod)) {
      productMap.set(prod, { name: prod, sales: 0, profit: 0 });
    }
    const curr = productMap.get(prod)!;
    curr.sales += row['Sales'] || 0;
    curr.profit += row['Profit'] || 0;
  });
  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5); // Top 5 for cleaner display

  // 7. State Sales
  const stateMap = new Map<string, StateData>();
  filteredData.forEach(row => {
    const state = row['State'];
    if (!state) return;
    if (!stateMap.has(state)) {
      stateMap.set(state, { state, sales: 0, profit: 0 });
    }
    const curr = stateMap.get(state)!;
    curr.sales += row['Sales'] || 0;
    curr.profit += row['Profit'] || 0;
  });
  const stateSales = Array.from(stateMap.values()).sort((a, b) => b.sales - a.sales);

  // 8. Scatter Data (Discount vs Profit)
  // Take a sample to avoid overloading the browser if many rows
  // Group by Order ID to make it more meaningful, or use raw rows
  const maxScatterPoints = 500;
  let scatterData: ScatterPoint[] = [];
  
  // Let's use raw rows for the scatter plot, but sample them if > 500
  const step = Math.ceil(filteredData.length / maxScatterPoints) || 1;
  for (let i = 0; i < filteredData.length; i += step) {
    const row = filteredData[i];
    if (row['Discount'] !== undefined && row['Profit'] !== undefined) {
      scatterData.push({
        orderId: row['Order ID'],
        discount: row['Discount'],
        profit: row['Profit'],
        sales: row['Sales'],
        category: row['Category']
      });
    }
  }

  return {
    raw: filteredData,
    kpi,
    monthlyTrends,
    categorySales,
    topProducts,
    stateSales,
    scatterData,
    years,
    regions,
    categories
  };
};
