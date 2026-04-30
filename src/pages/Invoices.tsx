import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/providers/trpc";
import {
  Plus,
  Search,
  Trash2,
  Eye,
  X,
} from "lucide-react";

const typeLabels: Record<string, string> = {
  quotation: "ใบเสนอราคา",
  invoice: "ใบแจ้งหนี้",
  receipt: "ใบเสร็จรับเงิน",
  tax_invoice: "ใบกำกับภาษี",
};

const statusLabels: Record<string, { text: string; color: string }> = {
  draft: { text: "ร่าง", color: "bg-gray-100 text-gray-700" },
  sent: { text: "ส่งแล้ว", color: "bg-blue-100 text-blue-700" },
  paid: { text: "ชำระแล้ว", color: "bg-green-100 text-green-700" },
  overdue: { text: "เกินกำหนด", color: "bg-red-100 text-red-700" },
  cancelled: { text: "ยกเลิก", color: "bg-gray-100 text-gray-500" },
};

export default function Invoices() {
  const [activeTab, setActiveTab] = useState<string>("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<number | null>(null);
  const [items, setItems] = useState<
    { description: string; quantity: number; unitPrice: number; discount: number }[]
  >([{ description: "", quantity: 1, unitPrice: 0, discount: 0 }]);
  const [form, setForm] = useState({
    type: "invoice" as "quotation" | "invoice" | "receipt" | "tax_invoice",
    customerId: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    discount: "0",
    taxRate: "7",
    notes: "",
  });

  const { data, refetch } = trpc.invoice.list.useQuery({
    type: (activeTab as "quotation" | "invoice" | "receipt" | "tax_invoice") || undefined,
    page: 1,
    limit: 20,
  });

  const { data: customers } = trpc.customer.list.useQuery({ page: 1, limit: 100 });
  const { data: invoiceDetail } = trpc.invoice.getById.useQuery(
    { id: showDetail! },
    { enabled: !!showDetail }
  );

  const createInvoice = trpc.invoice.create.useMutation({
    onSuccess: () => {
      refetch();
      closeModal();
    },
  });

  const deleteInvoice = trpc.invoice.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const updateStatus = trpc.invoice.updateStatus.useMutation({
    onSuccess: () => refetch(),
  });

  const closeModal = () => {
    setShowModal(false);
    setItems([{ description: "", quantity: 1, unitPrice: 0, discount: 0 }]);
    setForm({
      type: "invoice",
      customerId: "",
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      discount: "0",
      taxRate: "7",
      notes: "",
    });
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0, discount: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotals = () => {
    let subtotal = 0;
    items.forEach((item) => {
      subtotal += item.quantity * item.unitPrice - item.discount;
    });
    const discount = Number(form.discount) || 0;
    const afterDiscount = subtotal - discount;
    const taxRate = form.type === "receipt" ? 0 : Number(form.taxRate) || 0;
    const taxAmount = afterDiscount * (taxRate / 100);
    const total = afterDiscount + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerId) return;
    createInvoice.mutate({
      type: form.type,
      customerId: Number(form.customerId),
      issueDate: form.issueDate,
      dueDate: form.dueDate || undefined,
      items: items.map((item) => ({
        description: item.description,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        discount: Number(item.discount),
      })),
      discount: Number(form.discount),
      taxRate: Number(form.taxRate),
      notes: form.notes,
    });
  };

  const { subtotal, taxAmount, total } = calculateTotals();

  const tabs = [
    { key: "", label: "ทั้งหมด" },
    { key: "quotation", label: "ใบเสนอราคา" },
    { key: "invoice", label: "ใบแจ้งหนี้" },
    { key: "receipt", label: "ใบเสร็จ" },
    { key: "tax_invoice", label: "ใบกำกับภาษี" },
  ];

  const filteredInvoices = data?.invoices.filter((inv) => {
    if (!search) return true;
    return inv.invoiceNumber.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-[#1E293B]">จัดการเอกสาร</h1>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B5BF7] text-white rounded-lg hover:bg-[#2A4AE0] transition-colors"
          >
            <Plus className="w-4 h-4" />
            สร้างเอกสาร
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? "bg-white text-[#3B5BF7] shadow-sm"
                  : "text-[#64748B] hover:text-[#1E293B]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาเลขที่เอกสาร..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
          />
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#64748B] uppercase">
                    เลขที่
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#64748B] uppercase">
                    ประเภท
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#64748B] uppercase">
                    ลูกค้า
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#64748B] uppercase">
                    วันที่
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-[#64748B] uppercase">
                    จำนวนเงิน
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
                {filteredInvoices?.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[#1E293B]">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#64748B]">
                      {typeLabels[inv.type] || inv.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1E293B]">
                      {inv.customerName || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#64748B]">
                      {new Date(inv.issueDate).toLocaleDateString("th-TH")}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-[#1E293B] font-medium">
                      ฿{Number(inv.total).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusLabels[inv.status as string]?.color || "bg-gray-100"
                        }`}
                      >
                        {statusLabels[inv.status as string]?.text || inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setShowDetail(inv.id)}
                          className="p-1.5 text-gray-400 hover:text-[#3B5BF7] hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("ต้องการลบเอกสารนี้?")) {
                              deleteInvoice.mutate({ id: inv.id });
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

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-[#1E293B]">
                สร้างเอกสาร
              </h2>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1">
                    ประเภท *
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as typeof form.type })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
                  >
                    <option value="quotation">ใบเสนอราคา</option>
                    <option value="invoice">ใบแจ้งหนี้</option>
                    <option value="receipt">ใบเสร็จรับเงิน</option>
                    <option value="tax_invoice">ใบกำกับภาษี</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1">
                    ลูกค้า *
                  </label>
                  <select
                    required
                    value={form.customerId}
                    onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
                  >
                    <option value="">เลือกลูกค้า</option>
                    {customers?.customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1">
                    วันที่เอกสาร *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.issueDate}
                    onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1">
                    วันครบกำหนด
                  </label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
                  />
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-[#1E293B]">
                    รายการสินค้า/บริการ
                  </label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-sm text-[#3B5BF7] hover:underline"
                  >
                    + เพิ่มรายการ
                  </button>
                </div>
                {items.map((item, i) => (
                  <div key={i} className="flex gap-2 mb-2 items-end">
                    <div className="flex-1">
                      <input
                        placeholder="รายการ"
                        value={item.description}
                        onChange={(e) => updateItem(i, "description", e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
                      />
                    </div>
                    <div className="w-20">
                      <input
                        type="number"
                        placeholder="จำนวน"
                        value={item.quantity}
                        onChange={(e) => updateItem(i, "quantity", Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
                      />
                    </div>
                    <div className="w-28">
                      <input
                        type="number"
                        placeholder="ราคาต่อหน่วย"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(i, "unitPrice", Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
                      />
                    </div>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(i)}
                        className="p-2 text-red-400 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
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

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">ยอดรวม</span>
                  <span className="text-[#1E293B]">฿{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">
                    ภาษีมูลค่าเพิ่ม ({form.taxRate}%)
                  </span>
                  <span className="text-[#1E293B]">฿{taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-semibold border-t border-gray-200 pt-2">
                  <span className="text-[#1E293B]">ยอดสุทธิ</span>
                  <span className="text-[#3B5BF7]">฿{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#3B5BF7] text-white rounded-lg hover:bg-[#2A4AE0] transition-colors font-medium"
                >
                  บันทึกเอกสาร
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

      {/* Detail Modal */}
      {showDetail && invoiceDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-[#1E293B]">
                {invoiceDetail.invoiceNumber}
              </h2>
              <button
                onClick={() => setShowDetail(null)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[#64748B]">ประเภท</p>
                  <p className="font-medium">{typeLabels[invoiceDetail.type as string] || invoiceDetail.type}</p>
                </div>
                <div>
                  <p className="text-[#64748B]">สถานะ</p>
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statusLabels[(invoiceDetail.status ?? "") as string]?.color || "bg-gray-100"
                    }`}
                  >
                    {statusLabels[(invoiceDetail.status ?? "") as string]?.text || invoiceDetail.status}
                  </span>
                </div>
                <div>
                  <p className="text-[#64748B]">ลูกค้า</p>
                  <p className="font-medium">{invoiceDetail.customer?.name || "-"}</p>
                </div>
                <div>
                  <p className="text-[#64748B]">วันที่</p>
                  <p className="font-medium">
                    {new Date(invoiceDetail.issueDate).toLocaleDateString("th-TH")}
                  </p>
                </div>
              </div>

              {invoiceDetail.items && invoiceDetail.items.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-[#1E293B] mb-2">รายการ</p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-2 text-[#64748B]">รายการ</th>
                        <th className="text-right py-2 text-[#64748B]">จำนวน</th>
                        <th className="text-right py-2 text-[#64748B]">ราคา</th>
                        <th className="text-right py-2 text-[#64748B]">รวม</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceDetail.items.map((item, i) => (
                        <tr key={i} className="border-b border-gray-50">
                          <td className="py-2">{item.description}</td>
                          <td className="text-right py-2">{item.quantity}</td>
                          <td className="text-right py-2">
                            ฿{Number(item.unitPrice).toLocaleString()}
                          </td>
                          <td className="text-right py-2">
                            ฿{Number(item.total).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">ยอดรวม</span>
                  <span>฿{Number(invoiceDetail.subtotal).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">ภาษี</span>
                  <span>฿{Number(invoiceDetail.taxAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-semibold border-t border-gray-200 pt-2">
                  <span>ยอดสุทธิ</span>
                  <span className="text-[#3B5BF7]">
                    ฿{Number(invoiceDetail.total).toLocaleString()}
                  </span>
                </div>
              </div>

              {invoiceDetail.notes && (
                <div>
                  <p className="text-sm text-[#64748B]">หมายเหตุ</p>
                  <p className="text-sm">{invoiceDetail.notes}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {invoiceDetail.status === "draft" && (
                  <button
                    onClick={() => {
                      updateStatus.mutate({ id: invoiceDetail.id, status: "sent" });
                      setShowDetail(null);
                    }}
                    className="flex-1 py-2 bg-[#3B5BF7] text-white rounded-lg hover:bg-[#2A4AE0] transition-colors text-sm font-medium"
                  >
                    ส่งเอกสาร
                  </button>
                )}
                {invoiceDetail.status === "sent" && (
                  <button
                    onClick={() => {
                      updateStatus.mutate({ id: invoiceDetail.id, status: "paid" });
                      setShowDetail(null);
                    }}
                    className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    mark ชำระแล้ว
                  </button>
                )}
                <button
                  onClick={() => setShowDetail(null)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
