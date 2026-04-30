import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/providers/trpc";
import { Plus, Search, TrendingUp, TrendingDown, Trash2, Pencil, X } from "lucide-react";

export default function Accounting() {
  const [activeTab, setActiveTab] = useState<"all" | "income" | "expense">("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    category: "",
    type: "income" as "income" | "expense",
    amount: "",
    reference: "",
    notes: "",
  });

  const typeFilter = activeTab === "all" ? undefined : activeTab;

  const { data, refetch } = trpc.transaction.list.useQuery({
    type: typeFilter,
    page: 1,
    limit: 20,
  });

  const { data: stats } = trpc.transaction.getStats.useQuery({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const createTransaction = trpc.transaction.create.useMutation({
    onSuccess: () => {
      refetch();
      closeModal();
    },
  });

  const updateTransaction = trpc.transaction.update.useMutation({
    onSuccess: () => {
      refetch();
      closeModal();
    },
  });

  const deleteTransaction = trpc.transaction.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({
      date: new Date().toISOString().split("T")[0],
      description: "",
      category: "",
      type: "income",
      amount: "",
      reference: "",
      notes: "",
    });
  };

  const openModal = (tx?: NonNullable<typeof data>["transactions"][0]) => {
    if (tx) {
      setEditingId(tx.id);
      setForm({
        date: new Date(tx.date).toISOString().split("T")[0],
        description: tx.description,
        category: tx.category || "",
        type: tx.type as "income" | "expense",
        amount: tx.amount?.toString() || "",
        reference: tx.reference || "",
        notes: tx.notes || "",
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      date: form.date,
      description: form.description,
      category: form.category || undefined,
      type: form.type,
      amount: Number(form.amount),
      reference: form.reference || undefined,
      notes: form.notes || undefined,
    };
    if (editingId) {
      updateTransaction.mutate({ id: editingId, ...payload });
    } else {
      createTransaction.mutate(payload);
    }
  };

  const summaryCards = [
    {
      title: "รายรับเดือนนี้",
      value: stats?.income || 0,
      icon: TrendingUp,
      color: "#10B981",
      bgColor: "#10B98115",
    },
    {
      title: "รายจ่ายเดือนนี้",
      value: stats?.expense || 0,
      icon: TrendingDown,
      color: "#EF4444",
      bgColor: "#EF444415",
    },
    {
      title: "ยอดคงเหลือ",
      value: stats?.balance || 0,
      icon: TrendingUp,
      color: "#3B5BF7",
      bgColor: "#3B5BF715",
    },
  ];

  const tabs = [
    { key: "all" as const, label: "ทั้งหมด" },
    { key: "income" as const, label: "รายรับ" },
    { key: "expense" as const, label: "รายจ่าย" },
  ];

  const filteredTransactions = data?.transactions.filter((tx) => {
    if (!search) return true;
    return tx.description.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[#1E293B]">บัญชีรายรับรายจ่าย</h1>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          {summaryCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-[#64748B]">{card.title}</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: card.color }}>
                      ฿{Number(card.value).toLocaleString()}
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

        {/* Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.key
                    ? "bg-white text-[#3B5BF7] shadow-sm"
                    : "text-[#64748B] hover:text-[#1E293B]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B5BF7] text-white rounded-lg hover:bg-[#2A4AE0] transition-colors"
          >
            <Plus className="w-4 h-4" />
            เพิ่มรายการ
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหารายการ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
          />
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#64748B] uppercase">
                    วันที่
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#64748B] uppercase">
                    รายการ
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#64748B] uppercase">
                    หมวดหมู่
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#64748B] uppercase">
                    ประเภท
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-[#64748B] uppercase">
                    จำนวนเงิน
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-[#64748B] uppercase">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions?.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50"
                  >
                    <td className="px-6 py-4 text-sm text-[#64748B]">
                      {new Date(tx.date).toLocaleDateString("th-TH")}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-[#1E293B]">
                      {tx.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#64748B]">
                      {tx.category || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tx.type === "income"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {tx.type === "income" ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {tx.type === "income" ? "รายรับ" : "รายจ่าย"}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 text-sm text-right font-medium ${
                        tx.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}฿
                      {Number(tx.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openModal(tx)}
                          className="p-1.5 text-gray-400 hover:text-[#3B5BF7] hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("ต้องการลบรายการนี้?")) {
                              deleteTransaction.mutate({ id: tx.id });
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-[#1E293B]">
                {editingId ? "แก้ไขรายการ" : "เพิ่มรายการ"}
              </h2>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1">
                    วันที่ *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1">
                    ประเภท *
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, type: "income" })}
                      className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                        form.type === "income"
                          ? "bg-green-50 border-green-300 text-green-700"
                          : "border-gray-200 text-gray-600"
                      }`}
                    >
                      รายรับ
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, type: "expense" })}
                      className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                        form.type === "expense"
                          ? "bg-red-50 border-red-300 text-red-700"
                          : "border-gray-200 text-gray-600"
                      }`}
                    >
                      รายจ่าย
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1">
                  รายการ *
                </label>
                <input
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1">
                    หมวดหมู่
                  </label>
                  <input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1">
                    จำนวนเงิน *
                  </label>
                  <input
                    type="number"
                    required
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1">
                  อ้างอิง
                </label>
                <input
                  value={form.reference}
                  onChange={(e) => setForm({ ...form, reference: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1">
                  หมายเหตุ
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#3B5BF7] text-white rounded-lg hover:bg-[#2A4AE0] transition-colors font-medium"
                >
                  {editingId ? "บันทึกการแก้ไข" : "บันทึก"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 border border-gray-200 text-[#1E293B] rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
