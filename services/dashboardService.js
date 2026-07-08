// backend/services/dashboardService.js

import {
  getCounts,
  getSalaryStats,
  getPaymentStats,
  getRecentTransactions,
  getMonthlyIncomeChart,
  getRecentActivity,
} from '../models/dashboardModel.js';

export async function getDashboardOverview() {
  const [counts, salaryStats, paymentStats, recentTransactions, incomeChart, recentActivity] = await Promise.all([
    getCounts(),
    getSalaryStats(),
    getPaymentStats(),
    getRecentTransactions(5),
    getMonthlyIncomeChart(6),
    getRecentActivity(10),
  ]);

  return {
    stats: { ...counts, ...salaryStats, ...paymentStats },
    recentTransactions,
    incomeChart,
    recentActivity,
  };
}
