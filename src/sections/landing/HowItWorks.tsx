import { UserPlus, Settings, Rocket } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "สมัครใช้งาน",
    description: "สมัครฟรี ไม่ต้องใช้บัตรเครดิต ใช้งานได้ทันที",
  },
  {
    icon: Settings,
    title: "ตั้งค่าธุรกิจ",
    description: "เพิ่มสินค้า ตั้งค่าบริษัท ปรับแต่งเอกสารตามต้องการ",
  },
  {
    icon: Rocket,
    title: "เริ่มใช้งาน",
    description: "ออกเอกสาร จัดการสต๊อก ดูรายงานได้ทันที",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B]">
            เริ่มต้นใช้งานใน 3 ขั้นตอน
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection lines */}
          <div className="hidden md:block absolute top-1/4 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-[#3B5BF7]/20 via-[#3B5BF7] to-[#3B5BF7]/20" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="text-center relative">
                <div className="relative inline-block">
                  <div className="w-20 h-20 rounded-2xl bg-[#3B5BF7]/10 flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-10 h-10 text-[#3B5BF7]" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#3B5BF7] text-white text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-[#1E293B] mb-2">
                  {step.title}
                </h3>
                <p className="text-[#64748B] max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
