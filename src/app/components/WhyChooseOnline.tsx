"use client";

import { AlertCircle, CheckCircle2, Clock, DollarSign, Heart, MapPin, Sparkles, Users } from "lucide-react";

export default function WhyChooseOnline() {
  const problems = [
    {
      icon: Clock,
      title: "Mất Quá Nhiều Thời Gian",
      desc: "Phải dành hàng tuần lễ chạy xe đi gửi thiệp giấy tận tay từng người, mệt mỏi và dễ trễ hạn trước ngày cưới.",
    },
    {
      icon: Users,
      title: "Bất An Về Số Khách Mời",
      desc: "Không biết ai sẽ đến, ai bận việc gia đình, dẫn đến việc đặt thừa hoặc thiếu bàn tiệc cưới gây lãng phí lớn.",
    },
    {
      icon: DollarSign,
      title: "Chi Phí In Ấn Đắt Đỏ",
      desc: "In thiệp giấy cao cấp tốn từ 1.5 - 3 triệu đồng. In thừa thì bỏ đi, in thiếu lại phải đặt lại với giá rất cao.",
    },
    {
      icon: AlertCircle,
      title: "Khó Gửi Bạn Bè Ở Xa",
      desc: "Bạn bè ở xa, ở quê hoặc nước ngoài không thể nhận thiệp kịp lúc, chụp ảnh gửi thiệp giấy thì thiếu trang trọng.",
    },
  ];

  const solutions = [
    {
      title: "Gửi 100+ Khách Trong 1 Giây",
      desc: "Chỉ cần 1 đường link gửi qua Messenger hoặc SMS. Khách ở bất kỳ đâu cũng mở thiệp ngay tức thì.",
    },
    {
      title: "Xác Nhận Tham Dự (RSVP) Tức Thì",
      desc: "Khách bấm xác nhận có đi hay không, đi mấy người, ăn chay hay mặn. Dâu Rể kiểm soát bàn tiệc chính xác 100%.",
    },
    {
      title: "Tiết Kiệm 80% Chi Phí",
      desc: "Chỉ từ 500.000đ cho trọn gói thiệp cưới điện tử hiện đại, không phát sinh bất kỳ phụ phí in ấn hay vận chuyển.",
    },
    {
      title: "Đong Đầy Cảm Xúc & Kỷ Niệm",
      desc: "Có nhạc nền du dương, album ảnh cưới HD, lời chúc phúc và bản đồ chỉ đường. Lưu giữ kỷ niệm mãi mãi.",
    },
  ];

  return (
    <section className="why-choose-section section-wrap" id="ly-do-chon" aria-labelledby="why-title">
      <div className="section-header-centered" data-reveal>
        <p className="section-kicker">03 / GIẢI PHÁP CHO ĐÁM CƯỚI HIỆN ĐẠI</p>
        <h2 id="why-title">
          Bạn đang có kế hoạch mời cưới<br />
          <em>nhưng có quá nhiều bận tâm?</em>
        </h2>
        <p className="section-subheading">
          Chuẩn bị đám cưới có hàng trăm việc phải lo toan. Hãy để chiếc thiệp cưới điện tử kIsmet love
          giúp bạn giải tỏa mọi lo âu về việc mời tiệc và chuẩn bị đón tiếp khách quý.
        </p>
      </div>

      <div className="comparison-columns-wrapper" data-reveal>
        {/* Pain points column */}
        <div className="pain-points-card">
          <div className="column-badge badge-warning">
            <AlertCircle size={15} />
            <span>NHỮNG NỖI LO KHI DÙNG THIỆP GIẤY TRUYỀN THỐNG</span>
          </div>
          <h3 className="column-title">Nhiều bất tiện & tốn kém</h3>
          <div className="points-list">
            {problems.map((item) => {
              const Icon = item.icon;
              return (
                <div className="point-item point-negative" key={item.title}>
                  <span className="point-icon-neg">
                    <Icon size={18} />
                  </span>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Digital solution column */}
        <div className="solution-points-card">
          <div className="column-badge badge-success">
            <Sparkles size={15} />
            <span>GIẢI PHÁP THIỆP CƯỚI ĐIỆN TỬ KISMET LOVE</span>
          </div>
          <h3 className="column-title">
            Tiện lợi, thông minh & <em>tinh tế</em>
          </h3>
          <div className="points-list">
            {solutions.map((item) => (
              <div className="point-item point-positive" key={item.title}>
                <span className="point-icon-pos">
                  <CheckCircle2 size={18} />
                </span>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="solution-footer-box">
            <Heart size={20} className="solution-heart" />
            <p>
              Hơn <strong>1.200+ cặp đôi</strong> đã tin tưởng lựa chọn kIsmet love để ngày chung đôi thêm trọn vẹn.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
