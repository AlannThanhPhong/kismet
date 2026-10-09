"use client";

import { ArrowRight, CheckCheck, FileEdit, Palette, Send } from "lucide-react";

export default function WorkflowSection() {
  const steps = [
    {
      number: "01",
      icon: Palette,
      title: "Chọn Mẫu Thiệp",
      desc: "Xem 2 mẫu thiệp hiện có của kIsmet love Chọn phong cách phù hợp nhất với gu thẩm mỹ và không gian tiệc cưới của hai bạn",
    },
    {
      number: "02",
      icon: FileEdit,
      title: "Gửi Thông Tin & Ảnh",
      desc: "Gửi thông tin ngày giờ, địa điểm 2 bên gia đình, bài hát tình yêu yêu thích cùng bộ ảnh cưới của bạn theo hướng dẫn khi tư vấn qua điện thoại",
    },
    {
      number: "03",
      icon: CheckCheck,
      title: "Xem Thử & Chỉnh Sửa",
      desc: "Nhận bản demo hoàn thiện trong 24 giờ Trải nghiệm trực tiếp trên điện thoại và yêu cầu chỉnh sửa đến khi hai bạn ưng ý 100%",
    },
    {
      number: "04",
      icon: Send,
      title: "Nhận Link & Gửi Thiệp",
      desc: "Nhận đường link chính thức kèm tên từng khách mời Chia sẻ ngay qua Messenger và háo hức đón nhận lời chúc phúc",
    },
  ];

  return (
    <section className="workflow-section section-wrap" id="quy-trinh" aria-labelledby="workflow-title">
      <div className="section-header-centered" data-reveal>
        <p className="section-kicker">06 / ĐƠN GIẢN & NHANH CHÓNG</p>
        <h2 id="workflow-title">
          4 bước để sở hữu thiệp cưới online<br />
          <em>sẵn sàng chỉ trong 24 giờ</em>
        </h2>
        <p className="section-subheading">
          Quy trình tinh gọn, không cần biết kỹ thuật hay cài đặt phức tạp Đội ngũ kIsmet love hỗ trợ trọn gói từ A đến Z
        </p>
      </div>

      <div className="workflow-steps-wrapper" data-reveal>
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div className="workflow-step-card" key={step.number}>
              <div className="step-card-top">
                <span className="step-badge-number">{step.number}</span>
                <span className="step-icon-circle">
                  <Icon size={22} strokeWidth={1.3} />
                </span>
              </div>
              <h3 className="step-card-title">{step.title}</h3>
              <p className="step-card-desc">{step.desc}</p>
              {idx < steps.length - 1 && (
                <span className="step-connector-arrow" aria-hidden="true">
                  <ArrowRight size={18} />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
