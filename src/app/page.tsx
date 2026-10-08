import Image from "next/image";
import { ArrowDown, ArrowRight, Heart, MapPin, Music2, Sparkles } from "lucide-react";
import InvitationCatalog from "./components/InvitationCatalog";
import { HomeEffects, HomeNavigation, LoveEnvelope, Moodboard } from "./components/HomeInteractions";

const details = [
  { icon: Heart, number: "01", title: "Câu chuyện của riêng hai bạn", text: "Một tấm ảnh, một lời hẹn, một sắc màu yêu thích. Những điều rất riêng làm nên một chiếc thiệp rất bạn." },
  { icon: Music2, number: "02", title: "Có hình, có nhạc, có cảm xúc", text: "Ảnh cưới và giai điệu quen thuộc cùng những chuyển động nhỏ, để lời mời có cả không khí của ngày vui." },
  { icon: MapPin, number: "03", title: "Gửi đi một lời mời thật gần", text: "Ngày giờ, địa điểm và lời mời được đặt cùng nhau. Chỉ một đường link để gửi đến những người bạn thương." },
];

const questions = [
  { question: "Mình có thể xem thiệp thật trước không?", answer: "Có chứ. Bạn mở HONG KONG 1999 hoặc NGÀY MÌNH CHUNG ĐÔI trong bộ sưu tập phía trên để xem toàn bộ thiệp, hình ảnh và các hiệu ứng." },
  { question: "Thiệp có xem được trên điện thoại không?", answer: "Có. Thiệp mở trực tiếp trên trình duyệt điện thoại và máy tính. Bạn có thể gửi đường link qua Zalo, Messenger hoặc bất kỳ nơi nào thuận tiện." },
  { question: "Mỗi cặp đôi có một phong cách riêng được không?", answer: "Được nhé. Ảnh cưới, màu sắc, câu chữ và âm nhạc là điểm bắt đầu để cùng tạo nên không khí riêng cho lời mời của hai bạn." },
  { question: "Bắt đầu tìm phong cách của mình như thế nào?", answer: "Ghé bộ sưu tập để mở các thiệp thật, rồi thử chuyển giữa hai bảng cảm hứng Hoài niệm và Trong trẻo. Bạn có thể bắt đầu từ màu sắc, hình ảnh hoặc một cảm xúc mà hai bạn cùng yêu thích." },
];

export default function Home() {
  return (
    <main className="kismet-home" id="top">
      <HomeEffects />
      <a className="skip-link" href="#danh-sach-thiep">Đến bộ sưu tập thiệp</a>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="kIsmet love — về đầu trang">kIsmet <span>love</span></a>
        <HomeNavigation />
        <a className="header-contact" href="#bat-dau">Kể chuyện cùng kIsmet love <ArrowRight size={15} /></a>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span /> THIỆP CƯỚI & NHỮNG CHUYỆN TÌNH</p>
          <h1 id="hero-title">Một lời mời.<br />Một đời<br /><em>chung đôi.</em><span className="title-star" aria-hidden="true">✧</span></h1>
          <p className="hero-lead">Có những chuyện tình xứng đáng được kể thật đẹp.<br className="desktop-break" /> kIsmet love gói câu chuyện của hai bạn vào một chiếc thiệp —<br className="desktop-break" /> để ngày vui bắt đầu từ một lời thương.</p>
          <div className="hero-actions">
            <a className="button button-wine" href="#danh-sach-thiep">Mở những lời thương <ArrowRight size={17} /></a>
            <a className="hero-secondary" href="#bat-dau">Thiệp của chúng mình <span>↗</span></a>
          </div>
          <a className="hero-scroll" href="#danh-sach-thiep"><span><ArrowDown size={15} /></span> CUỘN XUỐNG, KHÁM PHÁ LỜI THƯƠNG</a>
        </div>
        <div className="hero-art" aria-label="Cảm hứng cho một ngày cưới lãng mạn">
          <span className="hero-orbit" aria-hidden="true" />
          <figure className="hero-portrait">
            <Image src="/home/images/hero-couple.jpg" alt="Cô dâu và chú rể bên bờ biển, ảnh cảm hứng cưới" fill priority sizes="(max-width: 700px) 75vw, 35vw" />
            <figcaption><span>THE BEGINNING OF FOREVER</span><span>all you need<br /><i>is love.</i></span></figcaption>
          </figure>
          <figure className="hero-polaroid">
            <div><Image src="/home/images/wedding-moment.jpg" alt="Cô dâu chú rể thả bóng bay cùng khách mời trong lễ cưới" fill sizes="(max-width: 700px) 34vw, 17vw" /></div>
            <figcaption>mình, và một đời nhau.</figcaption>
          </figure>
          <div className="hero-seal" aria-hidden="true"><Heart size={23} strokeWidth={1} /><span>WITH LOVE</span><small>kIsmet love</small></div>
          <span className="hero-handwriting" aria-hidden="true">and so the story begins...</span>
          <span className="hero-sparkle hero-sparkle-one" aria-hidden="true">✧</span>
          <span className="hero-sparkle hero-sparkle-two" aria-hidden="true">✦</span>
        </div>
        <div className="hero-bottom"><span>CHỈ MỘT ĐƯỜNG LINK. CẢ MỘT CHUYỆN TÌNH.</span><span>THIẾT KẾ BẰNG SỰ DỊU DÀNG <Heart size={11} /></span></div>
      </section>

      <div className="love-ribbon" aria-label="Một ngày của hai ta, một lời mời thật riêng">
        <div className="ribbon-track">
          {[0, 1, 2, 3].map((i) => <span className="ribbon-group" key={i} aria-hidden={i > 0 ? true : undefined}>một ngày của hai ta <span>✧</span> một lời mời thật riêng <span>✧</span> written in the stars, made with love <span>✧</span></span>)}
        </div>
      </div>

      <InvitationCatalog />

      <section className="little-details section-wrap" id="cach-mo-hoat-dong" aria-labelledby="details-title">
        <div className="section-heading" data-reveal>
          <div><p className="section-kicker">02 / NHỮNG ĐIỀU LÀM NÊN KISMET LOVE</p><h2 id="details-title">Thiệp nhỏ thôi.<br /><em>Thương thì thật nhiều.</em></h2></div>
          <p>Từ lần chạm đầu tiên đến khi lời mời được mở,<br />mỗi chi tiết đều dành cho một ngày thật đặc biệt.</p>
        </div>
        <div className="details-grid">
          {details.map(({ icon: Icon, number, title, text }) => <article className="detail-card" key={number} data-reveal>
            <div className="detail-top"><span className="detail-icon"><Icon size={27} strokeWidth={1.15} /></span><span>{number}</span></div>
            <h3>{title}</h3><p>{text}</p><span className="detail-flourish" aria-hidden="true">✧</span>
          </article>)}
        </div>
      </section>

      <section className="mood-section" id="mau-thiep" aria-labelledby="mood-title">
        <div className="section-wrap">
          <div className="mood-intro" data-reveal><p className="section-kicker">03 / MỘT CHÚT CẢM HỨNG</p><h2 id="mood-title">Tình yêu của bạn<br /><em>mang sắc màu nào?</em></h2><p>Một chút hoài niệm. Một chút trong trẻo.<br />Chọn một cảm xúc, để kIsmet love kể tiếp.</p></div>
          <div className="mood-reveal" data-reveal><Moodboard /></div>
        </div>
      </section>

      <section className="love-story section-wrap" id="loi-thuong" aria-labelledby="story-title">
        <div className="story-photo" data-reveal><Image src="/home/images/wedding-story.jpg" alt="Chi tiết trang trí Mr & Mrs trong không gian cưới ngoài trời" fill sizes="(max-width: 700px) 100vw, 50vw" /><span>the little moments, the big love.</span></div>
        <div className="story-copy" data-reveal><p className="section-kicker">MỘT LỜI NHẮN TỪ KISMET LOVE</p><span className="story-quote" aria-hidden="true">“</span><h2 id="story-title">Ngày vui đẹp nhất<br />là ngày có những<br /><em>người thương ở cạnh.</em></h2><p>Một chiếc thiệp không chỉ nói ngày nào, ở đâu.<br />Nó còn nói: “Bạn là một phần trong câu chuyện này.<br className="desktop-break" /> Và chúng mình mong được có bạn ở bên.”</p><span className="story-signature">Thương, kIsmet love.</span></div>
      </section>

      <section className="faq-section section-wrap" aria-labelledby="faq-title">
        <div data-reveal><p className="section-kicker">04 / TRƯỚC KHI MÌNH BẮT ĐẦU</p><h2 id="faq-title">Có thể bạn<br /><em>đang tự hỏi.</em></h2></div>
        <div className="faq-list" data-reveal>{questions.map((item, i) => <details className="faq-item" key={item.question}><summary><span className="faq-number">0{i + 1}</span>{item.question}<span className="faq-plus" aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>
      </section>

      <section className="start-cta" id="bat-dau" aria-labelledby="start-title">
        <div className="cta-inner" data-reveal><p className="section-kicker">MỘT CHƯƠNG MỚI, MỘT LỜI HẸN</p><h2 id="start-title">Mình cùng viết<br /><em>lời mời đầu tiên nhé?</em></h2><p>Đem câu chuyện của hai bạn đến đây.<br />kIsmet love sẽ cùng bạn kể bằng tất cả sự dịu dàng.</p><LoveEnvelope /><a className="cta-email" href="#danh-sach-thiep">Khám phá những lời mời <ArrowRight size={14} /></a></div>
      </section>

      <footer className="footer section-wrap"><div className="footer-top"><a className="brand" href="#top">kIsmet <span>love</span></a><p>Gửi lời thương.<br /><em>Lưu một ngày, nhớ một đời.</em></p><a className="footer-top-link" href="#top">Về đầu trang <ArrowRight size={15} style={{ transform: "rotate(-90deg)" }} /></a></div><div className="footer-bottom"><span>© 2026 kIsmet love</span><span>MADE WITH A LITTLE <Heart size={11} /> & A LOT OF LOVE</span><a href="#danh-sach-thiep">Những lời mời <Sparkles size={12} /></a></div></footer>
    </main>
  );
}
