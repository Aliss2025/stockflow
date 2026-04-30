import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { useState, useEffect } from "react";
import { Save, User, Building2, Bell, Shield } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const { data: company } = trpc.company.get.useQuery();
  const updateCompany = trpc.company.update.useMutation();

  const [form, setForm] = useState({
    name: "",
    taxId: "",
    address: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (company) {
      setForm({
        name: company.name || "",
        taxId: company.taxId || "",
        address: company.address || "",
        phone: company.phone || "",
        email: company.email || "",
      });
    }
  }, [company]);

  const handleSave = () => {
    if (company) {
      updateCompany.mutate({ id: company.id, ...form });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold text-[#1E293B]">ตั้งค่า</h1>

        {/* Company Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#3B5BF7]/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#3B5BF7]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#1E293B]">
                ข้อมูลบริษัท
              </h2>
              <p className="text-sm text-[#64748B]">
                จัดการข้อมูลธุรกิจของคุณ
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-1">
                ชื่อบริษัท
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-1">
                เลขประจำตัวผู้เสียภาษี
              </label>
              <input
                value={form.taxId}
                onChange={(e) => setForm({ ...form, taxId: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[#1E293B] mb-1">
                ที่อยู่
              </label>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-1">
                โทรศัพท์
              </label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-1">
                อีเมล
              </label>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BF7]/20 focus:border-[#3B5BF7]"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B5BF7] text-white rounded-lg hover:bg-[#2A4AE0] transition-colors"
            >
              <Save className="w-4 h-4" />
              บันทึก
            </button>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <User className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#1E293B]">
                ข้อมูลผู้ใช้
              </h2>
              <p className="text-sm text-[#64748B]">
                จัดการข้อมูลส่วนตัวของคุณ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#3B5BF7] text-white flex items-center justify-center text-2xl font-medium">
              {user?.name?.[0] || "U"}
            </div>
            <div>
              <p className="font-medium text-[#1E293B]">{user?.name || "ผู้ใช้งาน"}</p>
              <p className="text-sm text-[#64748B]">{user?.email || "-"}</p>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <Bell className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#1E293B]">
                การแจ้งเตือน
              </h2>
              <p className="text-sm text-[#64748B]">
                ตั้งค่าการแจ้งเตือนต่างๆ
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              "แจ้งเตือนสินค้าใกล้หมด",
              "แจ้งเตือนเอกสารเกินกำหนด",
              "แจ้งเตือนรายงานประจำวัน",
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <span className="text-sm text-[#1E293B]">{item}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B5BF7]"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#1E293B]">
                ความปลอดภัย
              </h2>
              <p className="text-sm text-[#64748B]">
                จัดการการตั้งค่าความปลอดภัย
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-[#1E293B]">
                  การยืนยันตัวตนสองชั้น
                </p>
                <p className="text-xs text-[#94A3B8]">
                  เพิ่มความปลอดภัยด้วย OTP
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B5BF7]"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
