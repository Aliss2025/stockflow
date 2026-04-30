import { Link } from "react-router";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1E293B] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">StockFlow</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              ระบบจัดการสต๊อกสินค้าและบัญชีออนไลน์สำหรับธุรกิจ SMEs
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-white mb-4">ผลิตภัณฑ์</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  จัดการสินค้า
                </Link>
              </li>
              <li>
                <Link to="/invoices" className="hover:text-white transition-colors">
                  ออกเอกสาร
                </Link>
              </li>
              <li>
                <Link to="/accounting" className="hover:text-white transition-colors">
                  บัญชี
                </Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-white transition-colors">
                  รายงาน
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">บริษัท</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  เกี่ยวกับเรา
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  ติดต่อ
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  ร่วมงานกับเรา
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  บล็อก
                </span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">ติดต่อ</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                contact@stockflow.co.th
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                02-123-4567
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                123 ถนนสุขุมวิท กรุงเทพ 10110
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2024 StockFlow. สงวนลิขสิทธิ์.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="hover:text-gray-300 cursor-pointer">
              นโยบายความเป็นส่วนตัว
            </span>
            <span className="hover:text-gray-300 cursor-pointer">
              เงื่อนไขการใช้งาน
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
