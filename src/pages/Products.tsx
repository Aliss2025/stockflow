import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/providers/trpc";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  AlertTriangle,
  X,
} from "lucide-react";

export default function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    sku: "",
    name: "",
    category: "",
    description: "",
    costPrice: "",
    sellingPrice: "",
    quantity: "",
    unit: "ชิ้น",
    reorderPoint: "10",
  });

  const { data, refetch } = trpc.product.list.useQuery({
    search: search || undefined,
    category: category || undefined,
    page,
    limit: 20,
  });

  const { data: stats } = trpc.product.getStats.useQuery();
  const utils = trpc.useUtils();

  const createProduct = trpc.product.create.useMutation({
    onSuccess: () => {
      refetch();
      utils.product.getStats.invalidate();
      utils.product.getLowStock.invalidate();
      closeModal();
    },
  });

  const updateProduct = trpc.product.update.useMutation({
    onSuccess: () => {
      refetch();
      utils.product.getStats.invalidate();
      utils.product.getLowStock.invalidate();
      closeModal();
    },
  });

  const deleteProduct = trpc.product.delete.useMutation({
    onSuccess: () => {
      refetch();
      utils.product.getStats.invalidate();
      utils.product.getLowStock.invalidate();
    },
  });

  type ProductItem = NonNullable<typeof data>["products"][number];
  const openModal = (product?: ProductItem) => {
    if (product) {
      setEditingId(product.id);
      setForm({
        sku: product.sku,
        name: product.name,
        category: product.category || "",
        description: product.description || "",
        costPrice: product.costPrice?.toString() || "",
        sellingPrice: product.sellingPrice?.toString() || "",
        quantity: product.quantity?.toString() || "",
        unit: product.unit || "ชิ้น",
        reorderPoint: product.reorderPoint?.toString() || "10",
      });
    } else {
      setEditingId(null);
      setForm({
        sku: "",
        name: "",
        category: "",
        description: "",
        costPrice: "",
        sellingPrice: "",
        quantity: "",
        unit: "ชิ้น",
        reorderPoint: "10",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      sku: form.sku,
      name: form.name,
      category: form.category || undefined,
      description: form.description || undefined,
      costPrice: form.costPrice ? Number(form.costPrice) : undefined,
      sellingPrice: form.sellingPrice ? Number(form.sellingPrice) : undefined,
      quantity: form.quantity ? Number(form.quantity) : undefined,
      unit: form.unit || undefined,
      reorderPoint: form.reorderPoint ? Number(form.reorderPoint) : undefined,
    };
    if (editingId) {
      updateProduct.mutate({ id: editingId, ...data });
    } else {
      createProduct.mutate(data);
    }
  };

  const getStatusColor = (qty: number, reorder: number) => {
    if (qty <= 0) return "bg-red-100 text-red-700";
    if (qty <= reorder) return "bg-orange-100 text-orange-700";
    return "bg-green-100 text-green-700";
  };

  const getStatusText = (qty: number, reorder: number) => {
    if (qty <= 0) return "หมด";
    if (qty <= reorder) return "ใกล้หมด";
    return "ปกติ";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-[#1E293B]">จัดการสินค้า</h1>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B5BF7] text-white rounded-lg hover:bg-[#2A4AE0] transition-colors"
          >
            <Plus className="w-4 h-4" />
            เพิ่มสินค้า
          </button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Package className="w-5 h-5 text-[#3B5BF7]" />
              </div>
              <div>
                <p className="text-sm text-[#64748B]">สินค้าทั้งหมด</p>
                <p className="text-xl font-bold text-[#1E293B]">
                  {stats?.total || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-[#64748B]">ใกล้หมด</p>
                <p className="text-xl font-bold text-orange-600">
                  {stats?.lowStock || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <Package className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-[#64748B]">หมดสต๊อก</p>
                <p className="text-xl font-bold text-red-600">
                  {stats?.outOfStock || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาสินค้า..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
          >
            <option value="">ทุกหมวดหมู่</option>
            <option value="อิเล็กทรอนิกส์">อิเล็กทรอนิกส์</option>
            <option value="ทั่วไป">ทั่วไป</option>
            <option value="เสื้อผ้า">เสื้อผ้า</option>
            <option value="อาหาร">อาหาร</option>
            <option value="เครื่องสำอาง">เครื่องสำอาง</option>
          </select>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#64748B] uppercase">
                    รหัส
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#64748B] uppercase">
                    ชื่อสินค้า
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#64748B] uppercase">
                    หมวดหมู่
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-[#64748B] uppercase">
                    ราคาทุน
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-[#64748B] uppercase">
                    ราคาขาย
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-[#64748B] uppercase">
                    คงเหลือ
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-[#64748B] uppercase">
                    สถานะ
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-[#64748B] uppercase">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50"
                  >
                    <td className="px-6 py-4 text-sm text-[#1E293B]">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-[#1E293B]">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#64748B]">
                      {product.category || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-[#1E293B]">
                      ฿{Number(product.costPrice).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-[#1E293B]">
                      ฿{Number(product.sellingPrice).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-[#1E293B]">
                      {product.quantity} {product.unit}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          product.quantity || 0,
                          product.reorderPoint || 10
                        )}`}
                      >
                        {getStatusText(
                          product.quantity || 0,
                          product.reorderPoint || 10
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openModal(product)}
                          className="p-1.5 text-gray-400 hover:text-[#3B5BF7] hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("ต้องการลบสินค้านี้?")) {
                              deleteProduct.mutate({ id: product.id });
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
          {/* Pagination */}
          {data && data.total > 20 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <p className="text-sm text-[#64748B]">
                แสดง {data.products.length} จาก {data.total} รายการ
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50"
                >
                  ก่อนหน้า
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page * 20 >= data.total}
                  className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50"
                >
                  ถัดไป
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-[#1E293B]">
                {editingId ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1">
                    รหัสสินค้า *
                  </label>
                  <input
                    required
                    value={form.sku}
                    onChange={(e) =>
                      setForm({ ...form, sku: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1">
                    ชื่อสินค้า *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1">
                    หมวดหมู่
                  </label>
                  <input
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1">
                    หน่วยนับ
                  </label>
                  <input
                    value={form.unit}
                    onChange={(e) =>
                      setForm({ ...form, unit: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1">
                  รายละเอียด
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1">
                    ราคาทุน
                  </label>
                  <input
                    type="number"
                    value={form.costPrice}
                    onChange={(e) =>
                      setForm({ ...form, costPrice: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1">
                    ราคาขาย
                  </label>
                  <input
                    type="number"
                    value={form.sellingPrice}
                    onChange={(e) =>
                      setForm({ ...form, sellingPrice: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1">
                    จำนวนเริ่มต้น
                  </label>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm({ ...form, quantity: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1">
                  จุดสั่งซื้อต่ำสุด
                </label>
                <input
                  type="number"
                  value={form.reorderPoint}
                  onChange={(e) =>
                    setForm({ ...form, reorderPoint: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
                />
              </div>
              <div className="flex gap-3 pt-4">
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
