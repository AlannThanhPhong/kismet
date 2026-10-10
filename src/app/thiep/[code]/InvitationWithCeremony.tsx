"use client";

import { useState } from "react";
import BalloonSkyOpeningCeremony from "@/app/components/BalloonSkyOpeningCeremony";
import { RotateCcw } from "lucide-react";

interface InvitationWithCeremonyProps {
  code: string;
  partnerOne: string;
  partnerTwo: string;
  venue: string;
  eventDate: string;
  isDesigned: boolean;
  iframeSrc?: string;
  audioTrackSrc?: string;
  children?: React.ReactNode;
}

export default function InvitationWithCeremony({
  code,
  partnerOne,
  partnerTwo,
  venue,
  eventDate,
  isDesigned,
  iframeSrc,
  audioTrackSrc,
  children,
}: InvitationWithCeremonyProps) {
  const [replayCount, setReplayCount] = useState(1); // 1 = initial play
  const coupleName = `${partnerOne} & ${partnerTwo}`;

  return (
    <div className="invitation-ceremony-wrapper" style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      {/* Balloon & Cloud opening ceremony */}
      <BalloonSkyOpeningCeremony
        coupleName={coupleName}
        weddingDate={eventDate}
        greeting="Kính Mời Quý Khách"
        replayTrigger={replayCount}
        audioTrackSrc={audioTrackSrc}
        autoPlayAudio={true}
      />

      {/* Floating replay button at bottom right */}
      <button
        type="button"
        className="btn-floating-replay-balloon"
        onClick={() => setReplayCount((c) => c + 1)}
        title="Xem lại hiệu ứng chùm bóng bay & tầng mây"
        style={{
          position: "fixed",
          bottom: "16px",
          right: "16px",
          zIndex: 9998,
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          color: "#ffffff",
          border: "none",
          borderRadius: "9999px",
          padding: "8px 16px",
          fontSize: "12px",
          fontWeight: 700,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          boxShadow: "0 6px 18px rgba(217, 119, 6, 0.45)",
          backdropFilter: "blur(6px)",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
      >
        <span>🎈</span>
        <span>Xem lại mở thiệp</span>
        <RotateCcw size={12} />
      </button>

      {/* Actual wedding invitation content (iframe or fallback) */}
      {isDesigned && iframeSrc ? (
        <iframe
          className="full-invitation"
          src={iframeSrc}
          allow="autoplay"
          title={`Thiệp cưới ${coupleName}`}
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      ) : (
        children
      )}
    </div>
  );
}
