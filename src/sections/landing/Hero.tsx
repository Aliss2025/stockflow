import { Link } from "react-router";
import { CheckCircle, TrendingUp, Users, FileText, Headphones } from "lucide-react";

const stats = [
  { icon: Users, value: "10,000+", label: "ธุรกิจที่ใช้งาน" },
  { icon: FileText, value: "5M+", label: "รายการเอกสาร/เดือน" },
  { icon: TrendingUp, value: "99.9%", label: "Uptime" },
  { icon: Headphones, value: "24/7", label: "การสนับสนุน" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen gradient-hero overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              จัดการสต๊อกและบัญชี
              <br />
              <span className="text-white/90">อย่างมืออาชีพ</span>
            </h1>
            <p className="mt-6 text-lg text-white/80 max-w-xl mx-auto lg:mx-0">
              ระบบ All-in-One สำหรับธุรกิจ SMEs จัดการสินค้า เอกสาร และบัญชีได้ในที่เดียว
              ประหยัดเวลา ลดความผิดพลาด
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium rounded-xl bg-[#FF7A45] text-white hover:bg-[#E86A35] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                เริ่มต้นใช้งานฟรี
              </Link>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium rounded-xl border-2 border-white/40 text-white hover:bg-white/10 transition-all"
              >
                ดูฟีเจอร์
              </button>
            </div>
            <div className="mt-8 flex items-center gap-6 justify-center lg:justify-start text-white/70 text-sm">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> ใช้งานฟรี 14 วัน
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> ไม่ต้องใช้บัตรเครดิต
              </span>
            </div>
          </div>

          <div className="relative">
            <img
              src="/assets/hero-dashboard.jpg"
              alt="StockFlow Dashboard"
              className="rounded-2xl shadow-2xl border border-white/20"
            />
            {/* Floating card */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">ยอดขายวันนี้</p>
                  <p className="text-lg font-bold text-gray-800">฿45,250</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20"
              >
                <Icon className="w-8 h-8 text-white/80 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/70 mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
