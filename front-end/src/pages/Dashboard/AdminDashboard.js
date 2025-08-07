import React, { useEffect, useState } from 'react';
import {
  getTopSellingProducts,
  getUnsoldProducts,
  getExpiredProducts,
  getTotalRevenue,
  getMonthlyRevenue
} from '../../services/api/DashboardService';

import MonthlyRevenueChart from '../../components/Dashboard/MonthlyRevenueChart';

const AdminDashboard = () => {
  const [topSelling, setTopSelling] = useState([]);
  const [unsold, setUnsold] = useState([]);
  const [expired, setExpired] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  useEffect(() => {
    getTopSellingProducts().then(res => setTopSelling(res.data.data));
    getUnsoldProducts().then(res => setUnsold(res.data.data));
    getExpiredProducts().then(res => setExpired(res.data.data));
    getTotalRevenue().then(res => setRevenue(res.data.totalRevenue));
    getMonthlyRevenue().then(res => setMonthlyRevenue(res.data.data));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-10 drop-shadow-lg">Admin Dashboard</h1>
        {/* Biểu đồ doanh thu theo tháng */}
        <MonthlyRevenueChart data={monthlyRevenue} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-purple-400">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">Tổng doanh thu</h2>
            <span className="text-3xl font-bold text-green-600 drop-shadow">{revenue.toLocaleString()} <span className="text-base font-medium text-gray-500">VND</span></span>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-blue-400">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">Top 10 sản phẩm bán chạy</h2>
            <ol className="list-decimal pl-5 space-y-2">
              {topSelling.length === 0 ? (
                <li className="text-gray-400">Không có dữ liệu</li>
              ) : (
                topSelling.map((item, idx) => (
                  <li key={item.product?._id || idx} className="flex justify-between items-center bg-blue-50 rounded px-3 py-1">
                    <span className="font-medium text-blue-700">{item.product?.name || 'N/A'}</span>
                    <span className="text-sm text-gray-500">Đã bán: <span className="font-semibold text-blue-600">{item.totalSold}</span></span>
                  </li>
                ))
              )}
            </ol>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-pink-400">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">Sản phẩm không bán được</h2>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {unsold.length === 0 ? (
                <li className="text-gray-400">Không có sản phẩm nào</li>
              ) : (
                unsold.map(product => (
                  <li key={product._id} className="flex items-center gap-2 bg-pink-50 rounded px-3 py-1">
                    <span className="font-medium text-pink-700">{product.name}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-yellow-400">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">Sản phẩm hết hạn</h2>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {expired.length === 0 ? (
                <li className="text-gray-400">Không có sản phẩm nào</li>
              ) : (
                expired.map(product => (
                  <li key={product._id} className="flex items-center gap-2 bg-yellow-50 rounded px-3 py-1">
                    <span className="font-medium text-yellow-700">{product.name}</span>
                    <span className="text-xs text-gray-500">(HSD: {new Date(product.expiryDate).toLocaleDateString()})</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;