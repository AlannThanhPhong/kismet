"use client";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";

type Review = { id: string; name: string; text: string; rating: number; templateName: string };
export default function StoreReviews() {
  const [stars, setStars] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [status, setStatus] = useState("Đang tải đánh giá…");
  useEffect(() => {
    const controller = new AbortController();
    setStatus("Đang tải đánh giá…");
    fetch(`/api/reviews?stars=${stars}`, { signal: controller.signal }).then(async response => { const result = await response.json(); if (!response.ok) throw new Error(result.error); setReviews(result.reviews); setStatus(result.reviews.length ? "" : "Chưa có đánh giá đã duyệt cho lựa chọn này."); }).catch(error => { if (!controller.signal.aborted) setStatus(error instanceof Error ? error.message : "Chưa thể tải đánh giá."); });
    return () => controller.abort();
  }, [stars]);
  return <section className="ws-reviews ws-wrap" aria-labelledby="reviews-title"><div className="ws-section-heading"><div><p className="ws-kicker">LỜI THƯƠNG TỪ CÁC CẶP ĐÔI</p><h2 id="reviews-title">Cảm nhận <em>sau ngày vui.</em></h2></div><label>Lọc theo số sao <select value={stars} onChange={event => setStars(event.target.value)}><option value="">Tất cả</option>{[5, 4, 3, 2, 1].map(star => <option key={star} value={star}>{star} sao</option>)}</select></label></div><p role="status">{status}</p><div className="ws-review-grid">{reviews.map(review => <article key={review.id}><span aria-label={`${review.rating} sao`}>{Array.from({ length: review.rating }, (_, index) => <Star key={index} size={13} fill="currentColor" />)}</span><blockquote>{review.text}</blockquote><strong>{review.name}</strong><small>{review.templateName}</small></article>)}</div></section>;
}
