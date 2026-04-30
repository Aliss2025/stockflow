import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/providers/trpc";
import {
  TrendingUp,
  PieChart,
  Package,
  Users,
  Scale,
  FileText,
  Download,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const reportTypes = [
  {
    id: "sales",
    icon: TrendingUp,
    title: "รายงานยอดขาย",
    color: "#3B5BF7",
    bgColor: "#3B5BF715",
  },
  {
    id: "profit",
    icon: PieChart,
    title: "รายงานกำไรขาดทุน",
    color: "#00C9A7",
    bgColor: "#00C9A715",
  },
  {
    id: "stock",
    icon: Package,
    title: "รายงานสต๊อกสินค้า",
    color: "#FF7A45",
    bgColor: "#FF7A4515",
  },
  {
    id: "debtors",
    icon: Users,
    title: "รายงานลูกหนี้",
    color: "#F59E0B",
    bgColor: "#F59E0B15",
  },
  {
    id: "balance",
    icon: Scale,
    title: "งบดุล",
    color: "#8B5CF6",
    bgColor: "#8B5CF615",
  },
  {
    id: "tax",
    icon: FileText,
    title: "รายงานภาษี",
    color: "#EF4444",
    bgColor: "#EF444415",
  },
];

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState("sales");
  const { data: salesChart } = trpc.dashboard.getSalesChart.useQuery();
  const { data: monthlyData } = trpc.transaction.getMonthly.useQuery({
    year: new Date().getFullYear(),
  });
  const { data: products } = trpc.product.list.useQuery({ page: 1, limit: 100 });

  const totalSales = salesChart?.reduce((sum, d) => sum + d.value, 0) || 0;
  const totalIncome = monthlyData?.reduce((sum, d) => sum + d.income, 0) || 0;
  const totalExpense = monthlyData?.reduce((sum, d) => sum + d.expense, 0) || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1E293B]">รายงานและวิเคราะห์</h1>
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-[#1E293B] rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            ส่งออก
          </button>
        </div>

        {/* Report Type Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`flex items-center gap-4 p-5 rounded-xl border transition-all text-left ${
                  selectedReport === report.id
                    ? "border-[#3B5BF7] bg-[#3B5BF7]/5 shadow-sm"
                    : "border-gray-100 bg-white hover:border-gray-200"
                }`}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: report.bgColor }}
                >
                  <Icon className="w-6 h-6" style={{ color: report.color }} />
                </div>
                <span className="font-medium text-[#1E293B]">{report.title}</span>
              </button>
            );
          })}
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-[#64748B]">ยอดขายรวม</p>
            <p className="text-2xl font-bold text-[#3B5BF7] mt-1">
              ฿{totalSales.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-[#64748B]">รายรับรวม</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              ฿{totalIncome.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-[#64748B]">รายจ่ายรวม</p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              ฿{totalExpense.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-[#1E293B] mb-4">
              ยอดขายรายเดือน
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesChart || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "#64748B" }}
                />
                <YAxis tick={{ fontSize: 12, fill: "#64748B" }} />
                <Tooltip
                  formatter={(value: number) => `฿${value.toLocaleString()}`}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="value" fill="#3B5BF7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Income vs Expense */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-[#1E293B] mb-4">
              รายรับ vs รายจ่าย
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(v) => `${v}`}
                  tick={{ fontSize: 12, fill: "#64748B" }}
                />
                <YAxis tick={{ fontSize: 12, fill: "#64748B" }} />
                <Tooltip
                  formatter={(value: number) => `฿${value.toLocaleString()}`}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="รายรับ"
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#EF4444"
                  strokeWidth={2}
                  name="รายจ่าย"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-[#1E293B] mb-4">
            สินค้าคงเหลือ
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#64748B] uppercase">
                    สินค้า
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#64748B] uppercase">
                    หมวดหมู่
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-[#64748B] uppercase">
                    ราคาทุน
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-[#64748B] uppercase">
                    ราคาขาย
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-[#64748B] uppercase">
                    คงเหลือ
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-[#64748B] uppercase">
                    มูลค่า
                  </th>
                </tr>
              </thead>
              <tbody>
                {products?.products.slice(0, 10).map((p) => {
                  const value =
                    Number(p.sellingPrice) * (p.quantity || 0);
                  return (
                    <tr
                      key={p.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-[#1E293B]">
                        {p.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#64748B]">
                        {p.category || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-[#1E293B]">
                        ฿{Number(p.costPrice).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-[#1E293B]">
                        ฿{Number(p.sellingPrice).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-[#1E293B]">
                        {p.quantity} {p.unit}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-[#3B5BF7]">
                        ฿{value.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
