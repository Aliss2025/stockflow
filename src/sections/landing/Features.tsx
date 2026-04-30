import {
  Package,
  FileText,
  Calculator,
  BarChart3,
  ShoppingCart,
  Cloud,
} from "lucide-react";

const features = [
  {
    icon: Package,
    color: "#3B5BF7",
    title: "จัดการสินค้าและสต๊อก",
    description:
      "ติดตามสต๊อกสินค้าแบบ real-time รู้ต้นทุน รู้กำไร ตั้งค่าระดับสต๊อกต่ำสุด แจ้งเตือนอัตโนมัติ",
  },
  {
    icon: FileText,
    color: "#00C9A7",
    title: "ออกเอกสารครบวงจร",
    description:
      "ใบเสนอราคา ใบแจ้งหนี้ ใบเสร็จรับเงิน ใบกำกับภาษี/อิเล็กทรอนิกส์ ออกเอกสารได้อย่างมืออาชีพ",
  },
  {
    icon: Calculator,
    color: "#FF7A45",
    title: "บัญชีอัจฉริยะ",
    description:
      "บันทึกรายรับรายจ่ายอัตโนมัติ จัดทำงบการเงิน งบกำไรขาดทุน งบดุลได้ทันที",
  },
  {
    icon: BarChart3,
    color: "#3B5BF7",
    title: "รายงานและวิเคราะห์",
    description:
      "ดูภาพรวมธุรกิจแบบ real-time รายงานยอดขาย กำไร สต๊อก พร้อมกราฟวิเคราะห์",
  },
  {
    icon: ShoppingCart,
    color: "#00C9A7",
    title: "เชื่อมต่อ e-Commerce",
    description:
      "เชื่อมต่อร้านค้าออนไลน์ Shopee Lazada นำเข้าข้อมูลออเดอร์ได้อัตโนมัติ",
  },
  {
    icon: Cloud,
    color: "#FF7A45",
    title: "ทำงานบน Cloud",
    description:
      "เข้าถึงข้อมูลได้ทุกที่ทุกเวลา ปลอดภัยด้วยการเข้ารหัส SSL สำรองข้อมูลอัตโนมัติ",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B]">
            ฟีเจอร์ครบครัน ตอบโจทย์ทุกธุรกิจ
          </h2>
          <p className="mt-4 text-lg text-[#64748B]">
            ระบบที่ออกแบบมาเพื่อธุรกิจไทยโดยเฉพาะ
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <Icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>
                <h3 className="text-xl font-semibold text-[#1E293B] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#64748B] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
