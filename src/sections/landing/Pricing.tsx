import { Check } from "lucide-react";
import { Link } from "react-router";

const plans = [
  {
    name: "Starter",
    price: "ฟรี",
    period: "",
    features: [
      "สินค้า 50 รายการ",
      "เอกสาร 20 ฉบับ/เดือน",
      "ผู้ใช้ 1 คน",
      "รายงานพื้นฐาน",
    ],
    cta: "เริ่มต้นใช้งาน",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "490",
    period: "/เดือน",
    badge: "แนะนำ",
    features: [
      "สินค้าไม่จำกัด",
      "เอกสารไม่จำกัด",
      "ผู้ใช้ 3 คน",
      "รายงานขั้นสูง",
      "e-Tax Invoice",
      "สำรองข้อมูล",
    ],
    cta: "เลือกแพ็คเกจนี้",
    highlighted: true,
  },
  {
    name: "Business",
    price: "990",
    period: "/เดือน",
    features: [
      "ทุกอย่างใน Professional",
      "ผู้ใช้ 10 คน",
      "เชื่อมต่อ e-Commerce",
      "API Access",
      "สนับสนุน 24/7",
    ],
    cta: "ติดต่อเรา",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B]">
            เลือกแพ็คเกจที่เหมาะกับธุรกิจคุณ
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-8 transition-all hover:-translate-y-1 ${
                plan.highlighted
                  ? "bg-white border-2 border-[#3B5BF7] shadow-xl shadow-[#3B5BF7]/10 scale-105"
                  : "bg-white border border-gray-200 shadow-sm"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#FF7A45] text-white text-xs font-semibold px-4 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <h3 className="text-xl font-semibold text-[#1E293B] text-center">
                {plan.name}
              </h3>

              <div className="text-center mt-4 mb-6">
                <span className="text-4xl font-bold text-[#1E293B]">
                  {plan.price}
                </span>
                <span className="text-[#64748B]">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-[#64748B] text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/login"
                className={`block text-center py-3 rounded-xl font-medium transition-all ${
                  plan.highlighted
                    ? "bg-[#3B5BF7] text-white hover:bg-[#2A4AE0]"
                    : "border border-gray-300 text-[#1E293B] hover:border-[#3B5BF7] hover:text-[#3B5BF7]"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
