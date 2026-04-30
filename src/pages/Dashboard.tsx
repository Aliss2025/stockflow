import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/providers/trpc";
import { Link } from "react-router";
import {
  TrendingUp,
  TrendingDown,
  FileText,
  Package,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#3B5BF7", "#00C9A7", "#FF7A45", "#F59E0B", "#EF4444"];

export default function Dashboard() {
  const { data: summary } = trpc.dashboard.getSummary.useQuery();
  const { data: activities } = trpc.dashboard.getRecentActivities.useQuery();
  const { data: salesChart } = trpc.dashboard.getSalesChart.useQuery();
  const { data: lowStock } = trpc.product.getLowStock.useQuery();
  const { data: invoiceStats } = trpc.invoice.getStats.useQuery();

  const kpiCards = [
    {
      title: "ยอดขายวันนี้",
      value: summary?.todaySales
        ? `฿${Number(summary.todaySales).toLocaleString()}`
        : "฿0",
      icon: TrendingUp,
      color: "#3B5BF7",
      bgColor: "#3B5BF715",
    },
    {
      title: "เอกสารเดือนนี้",
      value: summary?.monthlyInvoices?.toString() || "0",
      icon: FileText,
      color: "#00C9A7",
      bgColor: "#00C9A715",
    },
    {
      title: "สินค้าใกล้หมด",
      value: summary?.lowStockCount?.toString() || "0",
      icon: AlertTriangle,
      color: "#FF7A45",
      bgColor: "#FF7A4515",
    },
    {
      title: "กำไรสุทธิเดือนนี้",
      value: summary?.monthlyProfit
        ? `฿${Number(summary.monthlyProfit).toLocaleString()}`
        : "฿0",
      icon: BarChart3,
      color: "#F59E0B",
      bgColor: "#F59E0B15",
    },
  ];

  const pieData =
    invoiceStats?.byType?.map((item) => ({
      name:
        item.type === "quotation"
          ? "ใบเสนอราคา"
          : item.type === "invoice"
          ? "ใบแจ้งหนี้"
          : item.type === "receipt"
          ? "ใบเสร็จ"
          : "ใบกำกับภาษี",
      value: Number(item.total),
    })) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[#1E293B]">ภาพรวมธุรกิจ</h1>

        {/* KPI Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-[#64748B]">{card.title}</p>
                    <p className="text-2xl font-bold text-[#1E293B] mt-1">
                      {card.value}
                    </p>
                  </div>
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: card.bgColor }}
                  >
                    <Icon className="w-5 h-5" style={{ color: card.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-[#1E293B] mb-4">
              ยอดขายรายเดือน
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesChart || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "#64748B" }}
                />
                <YAxis tick={{ fontSize: 12, fill: "#64748B" }} />
                <Tooltip
                  formatter={(value: number) =>
                    `฿${value.toLocaleString()}`
                  }
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

          {/* Invoice Type Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-[#1E293B] mb-4">
              สัดส่วนเอกสาร
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `฿${value.toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-4 justify-center mt-2">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="text-sm text-[#64748B]">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-[#1E293B] mb-4">
              กิจกรรมล่าสุด
            </h3>
            <div className="space-y-3">
              {activities?.slice(0, 6).map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        activity.type === "invoice"
                          ? "bg-blue-50"
                          : activity.status === "income"
                          ? "bg-green-50"
                          : "bg-red-50"
                      }`}
                    >
                      {activity.type === "invoice" ? (
                        <FileText className="w-4 h-4 text-blue-500" />
                      ) : activity.status === "income" ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1E293B]">
                        {activity.description}
                      </p>
                      <p className="text-xs text-[#94A3B8]">
                        {new Date(activity.date).toLocaleDateString("th-TH")}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      activity.status === "income" ||
                      activity.status === "paid"
                        ? "text-green-600"
                        : activity.status === "expense"
                        ? "text-red-600"
                        : "text-[#1E293B]"
                    }`}
                  >
                    {activity.amount
                      ? `฿${Number(activity.amount).toLocaleString()}`
                      : ""}
                  </span>
                </div>
              ))}
              {!activities?.length && (
                <p className="text-sm text-[#94A3B8] text-center py-4">
                  ไม่มีกิจกรรมล่าสุด
                </p>
              )}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#1E293B]">
                สินค้าใกล้หมด
              </h3>
              <Link
                to="/products"
                className="text-sm text-[#3B5BF7] hover:underline"
              >
                ดูทั้งหมด
              </Link>
            </div>
            <div className="space-y-3">
              {lowStock?.slice(0, 6).map((product, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                      <Package className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1E293B]">
                        {product.name}
                      </p>
                      <p className="text-xs text-[#94A3B8]">
                        SKU: {product.sku}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-orange-600">
                      {product.quantity} {product.unit}
                    </p>
                    <p className="text-xs text-[#94A3B8]">
                      ต่ำสุด: {product.reorderPoint}
                    </p>
                  </div>
                </div>
              ))}
              {!lowStock?.length && (
                <p className="text-sm text-[#94A3B8] text-center py-4">
                  ไม่มีสินค้าใกล้หมด
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
