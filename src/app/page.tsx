import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Heart,
  Menu,
  Play,
} from "lucide-react";
import InvitationCatalog from "./components/InvitationCatalog";

const features = [
  {
    number: "01",
    title: "Một chiếc thiệp thật là bạn",
    text: "Chọn mẫu, phối màu, kể câu chuyện tình yêu — từng chi tiết đều mang dấu ấn riêng của hai bạn.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85",
    alt: "Cô dâu chú rể trong lễ cưới ngoài trời",
  },
  {
    number: "02",
    title: "Gửi lời mời, nhận hồi âm",
    text: "Chia sẻ thiệp chỉ bằng một đường link. Khách mời xác nhận tham dự để bạn an tâm chuẩn bị.",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=85",
    alt: "Bàn tiệc cưới được trang trí ấm cúng",
  },
  {
    number: "03",
    title: "Ngày vui ở gần hơn",
    text: "Địa điểm, bản đồ, lịch trình và những lời nhắn thương — tất cả gói gọn trong chiếc thiệp nhỏ.",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=85",
    alt: "Hoa cưới và không gian tiệc tinh tế",
  },
];

const samples = [
  {
    title: "Mùa thương",
    tag: "TỐI GIẢN · ẤM ÁP",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Nắng qua hiên",
    tag: "THƠ MỘNG · TỰ NHIÊN",
    image:
      "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Ngày mình chung đôi",
    tag: "THANH LỊCH · CỔ ĐIỂN",
    image:
      "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1000&q=85",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Mơ — về đầu trang">
          mơ<span>✳</span>
        </a>
        <nav className="nav-links" aria-label="Điều hướng chính">
          <a href="#cach-mo-hoat-dong">Mơ có gì</a>
          <a href="#mau-thiep">Mẫu thiệp</a>
          <a href="#danh-sach-thiep">Thiệp cưới</a>
          <a href="#loi-thuong">Lời thương</a>
        </nav>
        <a className="nav-cta" href="#bat-dau">
          Tạo thiệp của bạn <ArrowRight size={15} />
        </a>
        <details className="mobile-menu">
          <summary aria-label="Mở menu"><Menu size={22} /></summary>
          <nav aria-label="Điều hướng di động"><a href="#cach-mo-hoat-dong">Mơ có gì</a><a href="#mau-thiep">Mẫu thiệp</a><a href="#danh-sach-thiep">Thiệp cưới</a><a href="#loi-thuong">Lời thương</a><a href="#bat-dau">Tạo thiệp của bạn</a></nav>
        </details>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span /> NGÀY MÌNH CHUNG ĐÔI</div>
          <h1>Gửi một lời mời,<br />kể một <em>chuyện tình.</em></h1>
          <p className="hero-lead">
            Thiệp cưới online mang câu chuyện của hai bạn đến gần hơn với những người thương.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#bat-dau">Bắt đầu tạo thiệp <ArrowRight size={16} /></a>
            <a className="watch-link" href="#mau-thiep"><span><Play size={13} fill="currentColor" /></span> Xem thiệp mẫu</a>
          </div>
          <div className="hero-proof"><div className="avatar-stack"><span>H</span><span>M</span><span>♡</span></div><span>Hơn <b>2.400 cặp đôi</b> đã gửi lời thương cùng Mơ</span></div>
          <div className="hero-note"><span>✳</span> Chạm để bắt đầu <ArrowDown size={13} /></div>
        </div>
        <div className="hero-visual">
          <div className="hero-photo">
            <Image
              src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=90"
              alt="Cô dâu chú rể nắm tay trong ngày cưới"
              fill
              priority
              sizes="(max-width: 800px) 100vw, 52vw"
            />
            <div className="photo-shade" />
            <div className="photo-caption"><span>THÁNG 11 · 2025</span><strong>Mai Anh <i>&</i> Đức Minh</strong><span>HÀ NỘI, VIỆT NAM</span></div>
          </div>
          <div className="floating-card"><span className="tiny-flower">✿</span><div><small>ĐẾN NGÀY VUI CÒN</small><b>24 <small>ngày</small></b></div><span className="card-heart">♡</span></div>
          <div className="hero-stamp"><Heart size={13} fill="currentColor" /><span>made with love</span></div>
          <div className="hero-index">01 — 04</div>
        </div>
      </section>

      <section className="ticker" aria-label="Mơ cùng ngày vui">
        <div className="ticker-track">MỘT NGÀY CỦA HAI TA <span>✳</span> MỘT LỜI MỜI THẬT RIÊNG <span>✳</span> MỘT NGÀY CỦA HAI TA <span>✳</span> MỘT LỜI MỜI THẬT RIÊNG <span>✳</span></div>
      </section>

      <section className="intro section-wrap" id="cach-mo-hoat-dong">
        <div className="section-kicker">THIỆP NHỎ, THƯƠNG LỚN</div>
        <div className="intro-grid">
          <h2>Chuyện của hai bạn<br />xứng đáng được <em>kể thật đẹp.</em></h2>
          <div className="intro-aside"><span className="asterisk">✳</span><p>Mơ giúp ngày trọng đại bắt đầu từ một lời mời chỉn chu — để bạn dành thêm thời gian cho những điều quan trọng nhất.</p></div>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.number}>
              <div className="feature-image"><Image src={feature.image} alt={feature.alt} fill sizes="(max-width: 700px) 100vw, 33vw" /></div>
              <div className="feature-meta"><span>{feature.number} / 03</span><span>✳</span></div>
              <h3>{feature.title}</h3><p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="quote-band" id="loi-thuong">
        <div className="quote-mark">“</div>
        <blockquote>Ngày vui sẽ trọn vẹn hơn khi có<br />những người thương <em>ở cạnh bên.</em></blockquote>
        <div className="quote-credit"><span /> MỘT LỜI NHẮN TỪ MƠ <span /></div>
      </section>

      <section className="samples section-wrap" id="mau-thiep">
        <div className="samples-heading"><div><div className="section-kicker">GÓC NHỎ THAM KHẢO</div><h2>Mỗi chiếc thiệp,<br /><em>một sắc thái yêu.</em></h2></div><a className="text-link" href="#bat-dau">Khám phá tất cả mẫu <ArrowRight size={16} /></a></div>
        <div className="sample-grid">
          {samples.map((sample, index) => (
            <article className={`sample-card sample-${index + 1}`} key={sample.title}>
              <div className="sample-image"><Image src={sample.image} alt={`Mẫu thiệp cưới ${sample.title}`} fill sizes="(max-width: 700px) 100vw, 33vw" /><span className="sample-arrow"><ArrowRight size={17} /></span></div>
              <div className="sample-caption"><div><span>{sample.tag}</span><h3>{sample.title}</h3></div><span className="sample-index">0{index + 1}</span></div>
            </article>
          ))}
        </div>
      </section>

      <InvitationCatalog />

      <section className="start-cta" id="bat-dau">
        <div className="cta-flower">✳</div><div className="section-kicker">MỘT CHƯƠNG MỚI SẮP MỞ RA</div>
        <h2>Ngày vui của bạn,<br />để Mơ <em>cùng kể nhé.</em></h2>
        <p>Tạo chiếc thiệp đầu tiên trong vài phút.</p>
        <a className="button button-light" href="mailto:hello@mo.wedding">Tạo thiệp miễn phí <ArrowRight size={16} /></a>
        <div className="cta-perks"><span><Check size={14} /> Dễ dàng tùy chỉnh</span><span><Check size={14} /> Chia sẻ tiện lợi</span><span><Check size={14} /> Lưu giữ thật lâu</span></div>
      </section>

      <footer className="footer"><a className="brand footer-brand" href="#top">mơ<span>✳</span></a><span>Gửi lời thương, lưu ngày vui.</span><div><a href="#cach-mo-hoat-dong">Về Mơ</a><a href="mailto:hello@mo.wedding">Liên hệ</a><span>© 2025 Mơ Wedding</span></div></footer>
    </main>
  );
}
