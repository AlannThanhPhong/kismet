"use client";

import Image from "next/image";
import { Heart, MapPin, Quote, Star } from "lucide-react";

export default function TestimonialsSection() {
  const reviews = [
    {
      couple: "Huyền Vy & Anh Minh",
      location: "Buôn Ma Thuột, Đắk Lắk",
      templateName: "HONG KONG 1999",
      date: "Tháng 01 / 2026",
      avatar: "/wedding-invitations/20260110-NHVVAM/images/photo_2026-10-08_13-24-23.jpg",
      quote:
        "Tụi mình chọn mẫu Hong Kong 1999 vì yêu nét điện ảnh cổ điển. Bạn bè ai mở link thiệp cũng bất ngờ vì nhạc tự động phát và hiệu ứng hạt phim quá nghệ thuật. Bố mẹ và họ hàng ở xa cũng tấm tắc khen vì xem bản đồ chỉ đường rất rõ ràng.",
    },
    {
      couple: "Kim Hiên & Văn Tài",
      location: "Tân Lập, Tây Ninh",
      templateName: "NGÀY MÌNH CHUNG ĐÔI",
      date: "Tháng 10 / 2026",
      avatar: "/wedding-invitations/20261027-KHVT/images/0V7A7519-800.webp",
      quote:
        "Cực kỳ ấn tượng với tính năng RSVP xác nhận tham dự. Tụi mình tính toán chính xác được số lượng khách đi tiệc để đặt bàn cưới không bị lãng phí. Thiệp mở trên điện thoại vuốt siêu mượt, hình ảnh cưới sắc nét từng chi tiết.",
    },
  ];

  return (
    <section className="testimonials-section section-wrap" id="cam-nhan" aria-labelledby="testi-title">
      <div className="section-header-centered" data-reveal>
        <p className="section-kicker">07 / CHUYỆN TÌNH TỪ CÁC CẶP ĐÔI</p>
        <h2 id="testi-title">
          Những lời thương chân thành<br />
          <em>đã được gửi trao trọn vẹn.</em>
        </h2>
        <p className="section-subheading">
          Hạnh phúc lớn nhất của kIsmet love là được đồng hành cùng Dâu Rể trong thời khắc thiêng liêng nhất của cuộc đời.
        </p>
      </div>

      <div className="testimonials-grid" data-reveal>
        {reviews.map((rev, i) => (
          <article className="testimonial-card" key={i}>
            <div className="testimonial-top">
              <div className="couple-avatar-frame">
                <Image
                  src={rev.avatar}
                  alt={`Cặp đôi ${rev.couple}`}
                  fill
                  sizes="64px"
                  className="avatar-img"
                />
              </div>
              <div className="couple-meta-info">
                <h3 className="couple-names">{rev.couple}</h3>
                <p className="couple-geo">
                  <MapPin size={12} /> {rev.location}
                </p>
                <span className="template-tag-used">Mẫu: {rev.templateName}</span>
              </div>
              <Quote size={28} className="quote-watermark" aria-hidden="true" />
            </div>

            <div className="testimonial-stars" aria-label="Đánh giá 5 sao">
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} size={15} fill="#d4af37" color="#d4af37" />
              ))}
            </div>

            <p className="testimonial-quote-text">“{rev.quote}”</p>

            <div className="testimonial-footer">
              <span className="wedding-date-tag">{rev.date}</span>
              <span className="verified-badge">
                <Heart size={12} className="heart-pink" /> Đã chung đôi
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
