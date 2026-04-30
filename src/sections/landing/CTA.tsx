import { Link } from "react-router";

export default function CTA() {
  return (
    <section className="py-20 gradient-hero">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          พร้อมยกระดับการจัดการธุรกิจของคุณ?
        </h2>
        <p className="text-lg text-white/80 mb-8">
          สมัครใช้งานฟรีวันนี้ ไม่ต้องใช้บัตรเครดิต
        </p>
        <Link
          to="/login"
          className="inline-flex items-center justify-center px-10 py-4 text-lg font-medium rounded-xl bg-[#FF7A45] text-white hover:bg-[#E86A35] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          เริ่มต้นใช้งานฟรี
        </Link>
      </div>
    </section>
  );
}
