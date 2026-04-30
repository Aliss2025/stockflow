import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "คุณสมชาย แสงวิทยา",
    role: "เจ้าของร้าน แสงวิทยา",
    image: "/assets/avatar-1.jpg",
    content:
      "ระบบ StockFlow ช่วยให้การจัดการสต๊อกสินค้าและเอกสารของร้านง่ายขึ้นมาก ประหยัดเวลาได้เยอะ แนะนำสำหรับธุรกิจ SMEs ทุกประเภท",
    rating: 5,
  },
  {
    name: "คุณวิทยา ปลีกยะ",
    role: "ผู้จัดการ บริษัท ปลีกยะ",
    image: "/assets/avatar-2.jpg",
    content:
      "ใช้งานง่ายมากครับ ระบบบัญชีครบถ้วน รายงานชัดเจน ช่วยให้ผมตัดสินใจทางธุรกิจได้ดีขึ้น ทีมสนับสนุนก็ดีมาก",
    rating: 5,
  },
  {
    name: "คุณสุทธิดา หวัญสี",
    role: "นักบัญชี บริษัท แอดวานซ์",
    image: "/assets/avatar-3.jpg",
    content:
      "ในฐานะนักบัญชี ผมประทับใจกับความสามารถในการออกเอกสารและจัดทำรายงานของ StockFlow ใช้งานสะดวก รวดเร็ว ถูกต้องตามกฎหมาย",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B]">
            เสียงจากผู้ใช้งานจริง
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, i) => (
            <div
              key={i}
              className="bg-[#F8FAFC] rounded-2xl p-8 relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-[#3B5BF7]/20" />

              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: item.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              <p className="text-[#1E293B] mb-6 leading-relaxed">
                "{item.content}"
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-[#1E293B]">{item.name}</p>
                  <p className="text-sm text-[#64748B]">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
