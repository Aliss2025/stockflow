import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className={`text-xl font-bold ${scrolled ? "text-[#3B5BF7]" : "text-white"}`}>
            StockFlow
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {["ฟีเจอร์", "วิธีใช้", "ราคา", "รีวิว"].map((item) => (
              <button
                key={item}
                onClick={() =>
                  scrollTo(
                    item === "ฟีเจอร์"
                      ? "features"
                      : item === "วิธีใช้"
                      ? "how-it-works"
                      : item === "ราคา"
                      ? "pricing"
                      : "testimonials"
                  )
                }
                className={`text-sm font-medium transition-colors ${
                  scrolled
                    ? "text-gray-600 hover:text-[#3B5BF7]"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className={`text-sm font-medium px-4 py-2 rounded-lg border transition-all ${
                scrolled
                  ? "border-gray-300 text-gray-700 hover:border-[#3B5BF7] hover:text-[#3B5BF7]"
                  : "border-white/30 text-white hover:bg-white/10"
              }`}
            >
              เข้าสู่ระบบ
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium px-4 py-2 rounded-lg bg-[#3B5BF7] text-white hover:bg-[#2A4AE0] transition-colors"
            >
              ทดลองใช้ฟรี
            </Link>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className={scrolled ? "text-gray-700" : "text-white"} />
            ) : (
              <Menu className={scrolled ? "text-gray-700" : "text-white"} />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-3 space-y-2">
            {["ฟีเจอร์", "วิธีใช้", "ราคา", "รีวิว"].map((item) => (
              <button
                key={item}
                onClick={() =>
                  scrollTo(
                    item === "ฟีเจอร์"
                      ? "features"
                      : item === "วิธีใช้"
                      ? "how-it-works"
                      : item === "ราคา"
                      ? "pricing"
                      : "testimonials"
                  )
                }
                className="block w-full text-left px-3 py-2 text-gray-600 hover:text-[#3B5BF7] hover:bg-gray-50 rounded-lg"
              >
                {item}
              </button>
            ))}
            <div className="pt-2 space-y-2 border-t border-gray-100">
              <Link
                to="/login"
                className="block text-center px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                to="/login"
                className="block text-center px-4 py-2 rounded-lg bg-[#3B5BF7] text-white"
              >
                ทดลองใช้ฟรี
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
