import Image from "next/image";
import { currencyForCountry } from "@/lib/pricing";
import { getVisitorCountry } from "@/lib/visitor-country";
import { ArrowDown, ArrowRight, Heart, Phone, Sparkles } from "lucide-react";
import TemplateShowcase from "./components/TemplateShowcase";
import Features50 from "./components/Features50";
import WhyChooseOnline from "./components/WhyChooseOnline";
import ComparisonSection from "./components/ComparisonSection";
import PricingSection from "./components/PricingSection";
import WorkflowSection from "./components/WorkflowSection";
import TestimonialsSection from "./components/TestimonialsSection";
import FloatingBar from "./components/FloatingBar";
import { HomeEffects, HomeNavigation, LoveEnvelope, Moodboard } from "./components/HomeInteractions";

const questions = [
  {
    question: "Thiệp cưới online là gì và khách mời xem như thế nào?",
    answer: "Thiệp cưới online (hay website đám cưới) là trang web dành riêng cho ngày trọng đại của hai bạn. Khách mời chỉ cần chạm vào đường link gửi qua Messenger hoặc SMS là có thể mở thiệp ngay lập tức trên điện thoại hoặc máy tính mà không cần tải bất kỳ ứng dụng nào.",
  },
  {
    question: "Thời gian hoàn thiện thiệp cưới là bao lâu?",
    answer: "Chỉ từ 12 đến 24 giờ sau khi hai bạn cung cấp đầy đủ thông tin ngày giờ, địa điểm và album ảnh cưới, kIsmet love sẽ gửi bản demo hoàn thiện để hai bạn trải nghiệm trực tiếp trước khi gửi chính thức cho khách quý.",
  },
  {
    question: "Khách mời lớn tuổi có dễ xem thiệp và tìm đường không?",
    answer: "Rất dễ dàng! Giao diện được thiết kế tối ưu với phông chữ to rõ, màu sắc trang nhã và nút bấm lớn. Đặc biệt, khách chỉ cần chạm 1 lần vào bản đồ là ứng dụng Google Maps tự động mở và chỉ đường chính xác đến tận sảnh tiệc cưới.",
  },
  {
    question: "Mình có thể tự chọn bài hát yêu thích và đổi ảnh sau khi gửi không?",
    answer: "Hoàn toàn được! Bạn có thể chọn bất kỳ bài hát tình yêu nào gắn liền với kỷ niệm của hai bạn. Nếu sau đó bạn muốn thay đổi bài hát, đổi ảnh cưới hoặc cập nhật giờ giấc, mọi thay đổi đều tự động cập nhật tức thì trên link mà không cần in lại hay gửi lại link mới.",
  },
  {
    question: "Tính năng RSVP xác nhận tham dự hoạt động như thế nào?",
    answer: "Khách mời có thể bấm xác nhận 'Sẽ tham dự' hoặc 'Tiếc quá không thể đến', nhập số người đi cùng và gửi lời chúc phúc. Hệ thống tự động ghi nhận giúp cô dâu chú rể tính toán chính xác số bàn tiệc, tránh thừa mứa hay thiếu chỗ.",
  },
  {
    question: "Tiền mừng cưới gửi qua mã QR về tài khoản của ai?",
    answer: "Tiền mừng cưới chuyển thẳng 100% về số tài khoản ngân hàng chính chủ của cô dâu hoặc chú rể. kIsmet love không giữ tiền và không thu bất kỳ khoản phí trung gian nào.",
  },
  {
    question: "Thiệp có xem mượt trên cả điện thoại và máy tính không?",
    answer: "Chắc chắn rồi! Tất cả các mẫu thiệp tại kIsmet love đều được thiết kế chuẩn Responsive, tối ưu hiển thị mượt mà trên mọi thiết bị: iPhone, điện thoại Android, iPad/Tablet và máy tính để bàn.",
  },
];

export default async function Home() {
  const currency = currencyForCountry(await getVisitorCountry());
  return (
    <main className="kismet-home" id="top">
      <HomeEffects />
      <FloatingBar />

      <a className="skip-link" href="#kho-mau-thiep">Đến kho mẫu thiệp cưới</a>

      {/* Top Promotion Announcement Bar */}
      <aside className="announcement-top-bar" aria-label="Thông báo ưu đãi mùa cưới">
        <div className="announcement-inner">
          <span>✧ <strong>ƯU ĐÃI MÙA CƯỚI 2026:</strong> Tặng thiết kế Monogram Logo Dâu & Rể{currency === "VND" ? " trị giá 200.000đ" : ""} khi đặt thiệp hôm nay!</span>
          <span className="pill-dot">·</span>
          <span>Hotline tư vấn: <a className="announcement-hotline" href="tel:0827274387">0827274387</a></span>
        </div>
      </aside>

      {/* Studio Header */}
      <header className="site-header">
        <a className="brand" href="#top" aria-label="kIsmet love — về đầu trang">
          kIsmet <span>love</span>
        </a>
        <HomeNavigation />
        <a className="header-contact" href="#bat-dau">
          Đặt thiệp cùng kIsmet love <ArrowRight size={15} />
        </a>
      </header>

      {/* Hero Section */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">
            <span /> THIỆP CƯỚI ĐIỆN TỬ & WEBSITE ĐÁM CƯỚI 5.0
          </p>
          <h1 id="hero-title">
            Một lời mời.<br />
            Một đời<br />
            <em>chung đôi.</em>
            <span className="title-star" aria-hidden="true">✧</span>
          </h1>
          <p className="hero-lead">
            Có những chuyện tình xứng đáng được kể thật đẹp.<br className="desktop-break" />
            kIsmet love gói câu chuyện của hai bạn vào một chiếc thiệp cưới online thông minh —<br className="desktop-break" />
            tích hợp âm nhạc du dương, album ảnh cưới HD, bản đồ chỉ đường và xác nhận tham dự tức thì.
          </p>

          <div className="hero-actions">
            <a className="button button-wine" href="#kho-mau-thiep">
              Khám phá kho mẫu thiệp <ArrowRight size={17} />
            </a>
            <a className="hero-secondary" href="/thiep/20260110-NHVVAM" target="_blank" rel="noopener noreferrer">
              Xem thiệp mẫu thực tế <span>↗</span>
            </a>
          </div>

          {/* Trust stats row */}
          <div className="hero-trust-row" aria-label="Thống kê nổi bật">
            <div className="trust-item">
              <span className="trust-num">2 Mẫu</span>
              <span className="trust-label">Thiệp cưới thực tế</span>
            </div>
            <div className="trust-item">
              <span className="trust-num">1 Chạm</span>
              <span className="trust-label">Gửi Zalo & Web muôn nơi</span>
            </div>
            <div className="trust-item">
              <span className="trust-num">{currency === "VND" ? "Tiết kiệm 80%" : "Giá trọn gói"}</span>
              <span className="trust-label">So với thiệp in giấy</span>
            </div>
          </div>

          <a className="hero-scroll" href="#kho-mau-thiep">
            <span><ArrowDown size={15} /></span> CUỘN XUỐNG ĐỂ KHÁM PHÁ
          </a>
        </div>

        {/* Hero Visual Art */}
        <div className="hero-art" aria-label="Cảm hứng cho một ngày cưới lãng mạn">
          <span className="hero-orbit" aria-hidden="true" />

          {/* Floating Interactive Badges */}
          <span className="hero-floating-badge badge-music" aria-hidden="true">
            🎵 Nhạc nền du dương
          </span>
          <span className="hero-floating-badge badge-rsvp" aria-hidden="true">
            💌 RSVP xác nhận tức thì
          </span>
          <span className="hero-floating-badge badge-maps" aria-hidden="true">
            🗺️ Google Maps 1 chạm
          </span>

          <figure className="hero-portrait">
            <Image
              src="/home/images/hero-couple.jpg"
              alt="Cô dâu và chú rể bên bờ biển, ảnh cảm hứng cưới"
              fill
              priority
              sizes="(max-width: 700px) 75vw, 35vw"
            />
            <figcaption>
              <span>THE BEGINNING OF FOREVER</span>
              <span>all you need<br /><i>is love.</i></span>
            </figcaption>
          </figure>

          <figure className="hero-polaroid">
            <div>
              <Image
                src="/home/images/wedding-moment.jpg"
                alt="Cô dâu chú rể thả bóng bay cùng khách mời trong lễ cưới"
                fill
                sizes="(max-width: 700px) 34vw, 17vw"
              />
            </div>
            <figcaption>mình, và một đời nhau.</figcaption>
          </figure>

          <div className="hero-seal" aria-hidden="true">
            <Heart size={23} strokeWidth={1} />
            <span>WITH LOVE</span>
            <small>kIsmet love</small>
          </div>

          <span className="hero-handwriting" aria-hidden="true">and so the story begins...</span>
          <span className="hero-sparkle hero-sparkle-one" aria-hidden="true">✧</span>
          <span className="hero-sparkle hero-sparkle-two" aria-hidden="true">✦</span>
        </div>

        <div className="hero-bottom">
          <span>CHỈ MỘT ĐƯỜNG LINK. CẢ MỘT CHUYỆN TÌNH.</span>
          <span>THIẾT KẾ BẰNG SỰ DỊU DÀNG <Heart size={11} /></span>
        </div>
      </section>

      {/* Romantic Ribbon */}
      <div className="love-ribbon" aria-label="Một ngày của hai ta, một lời mời thật riêng">
        <div className="ribbon-track">
          {[0, 1, 2, 3].map((i) => (
            <span className="ribbon-group" key={i} aria-hidden={i > 0 ? true : undefined}>
              một ngày của hai ta <span>✧</span> một lời mời thật riêng <span>✧</span> written in the stars, made with love <span>✧</span>
            </span>
          ))}
        </div>
      </div>

      {/* 01. Rich Filterable Template Showcase (Cinelove + Zenlove + Nhà Có Hỷ + TheSimple) */}
      <TemplateShowcase currency={currency} />

      {/* 02. Smart 5.0 Interactive Features (meWedding + Cinelove + Nhà Có Hỷ) */}
      <Features50 />

      {/* 03. Why Choose Online / Pain Points & Solutions (Zenlove + meWedding) */}
      <WhyChooseOnline currency={currency} />

      {/* 04. Side-by-side Comparison Table */}
      <ComparisonSection currency={currency} />

      {/* 05. Transparent Pricing Packages (Nhà Có Hỷ + meWedding) */}
      <PricingSection currency={currency} />

      {/* 06. 4-Step Simple Workflow */}
      <WorkflowSection />

      {/* Artistic Moodboard Palette */}
      <section className="mood-section" id="mau-thiep" aria-labelledby="mood-title">
        <div className="section-wrap">
          <div className="mood-intro" data-reveal>
            <p className="section-kicker">CẢM HỨNG SẮC MÀU</p>
            <h2 id="mood-title">
              Tình yêu của bạn<br />
              <em>mang sắc màu nào?</em>
            </h2>
            <p>
              Một chút hoài niệm điện ảnh. Một chút trong trẻo dịu dàng.<br />
              Chọn một cảm xúc, để kIsmet love cùng bạn viết tiếp.
            </p>
          </div>
          <div className="mood-reveal" data-reveal>
            <Moodboard />
          </div>
        </div>
      </section>

      {/* 07. Real Couples' Testimonials & Stories */}
      <TestimonialsSection />

      {/* Love Story Note */}
      <section className="love-story section-wrap" id="loi-thuong" aria-labelledby="story-title">
        <div className="story-photo" data-reveal>
          <Image
            src="/home/images/wedding-story.jpg"
            alt="Chi tiết trang trí Mr & Mrs trong không gian cưới ngoài trời"
            fill
            sizes="(max-width: 700px) 100vw, 50vw"
          />
          <span>the little moments, the big love.</span>
        </div>
        <div className="story-copy" data-reveal>
          <p className="section-kicker">MỘT LỜI NHẮN TỪ KISMET LOVE</p>
          <span className="story-quote" aria-hidden="true">“</span>
          <h2 id="story-title">
            Ngày vui đẹp nhất<br />
            là ngày có những<br />
            <em>người thương ở cạnh.</em>
          </h2>
          <p>
            Một chiếc thiệp không chỉ nói ngày nào, ở đâu.<br />
            Nó còn nói: “Bạn là một phần không thể thiếu trong câu chuyện này.<br className="desktop-break" />
            Và chúng mình mong được có bạn ở bên trong giây phút thiêng liêng nhất.”
          </p>
          <span className="story-signature">Thương, kIsmet love.</span>
        </div>
      </section>

      {/* 08. FAQ Section */}
      <section className="faq-section section-wrap" id="hoi-dap" aria-labelledby="faq-title">
        <div data-reveal>
          <p className="section-kicker">08 / TRƯỚC KHI MÌNH BẮT ĐẦU</p>
          <h2 id="faq-title">
            Giải đáp thắc mắc<br />
            <em>về thiệp cưới online.</em>
          </h2>
          <p style={{ fontSize: "11px", lineHeight: "1.9", color: "var(--muted)", marginTop: "18px" }}>
            Nếu bạn vẫn còn băn khoăn, đội ngũ kIsmet love luôn sẵn sàng lắng nghe và tư vấn miễn phí bất kỳ lúc nào.
          </p>
        </div>
        <div className="faq-list" data-reveal>
          {questions.map((item, i) => (
            <details className="faq-item" key={item.question}>
              <summary>
                <span className="faq-number">0{i + 1}</span>
                {item.question}
                <span className="faq-plus" aria-hidden="true">+</span>
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 09. Love Envelope & Call to Action */}
      <section className="start-cta" id="bat-dau" aria-labelledby="start-title">
        <div className="cta-inner" data-reveal>
          <p className="section-kicker">MỘT CHƯƠNG MỚI, MỘT LỜI HẸN</p>
          <h2 id="start-title">
            Mình cùng viết<br />
            <em>lời mời đầu tiên nhé?</em>
          </h2>
          <p>
            Đem câu chuyện của hai bạn đến đây.<br />
            kIsmet love sẽ cùng bạn kể bằng tất cả sự dịu dàng và lòng trân quý.
          </p>
          <LoveEnvelope />
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginTop: "16px" }}>
            <a className="cta-email" href="tel:0827274387">
              <Phone size={15} /> Gọi tư vấn: 0827274387
            </a>
            <a className="cta-email" href="#kho-mau-thiep">
              Xem lại kho mẫu thiệp <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* Studio Footer */}
      <footer className="footer section-wrap">
        <div className="footer-top">
          <a className="brand" href="#top">
            kIsmet <span>love</span>
          </a>
          <p>
            Gửi lời thương.<br />
            <em>Lưu một ngày, nhớ một đời.</em>
          </p>
          <a className="footer-top-link" href="#top">
            Về đầu trang <ArrowRight size={15} style={{ transform: "rotate(-90deg)" }} />
          </a>
        </div>

        <div className="footer-bottom">
          <span>© 2026 kIsmet love · Nền tảng thiệp cưới điện tử tinh tế</span>
          <span>MADE WITH A LITTLE <Heart size={11} /> & A LOT OF LOVE</span>
          <a href="#kho-mau-thiep">
            Kho mẫu thiệp 5.0 <Sparkles size={12} />
          </a>
        </div>
      </footer>
    </main>
  );
}
