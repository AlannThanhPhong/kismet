"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Volume2, VolumeX, X, RotateCcw } from "lucide-react";
import "./balloon-sky-opening.css";

export type OpeningStage =
  | "ready" // Waiting for user to tap "Chạm để mở thiệp"
  | "rising_to_center" // Balloons rise from bottom to viewport center
  | "camera_tracking" // Camera tracks balloons upwards, sky rushes past, wisps fly down
  | "clouds_enveloping" // Giant volumetric clouds billow in, covering the screen 100%
  | "balloons_vanish" // Balloons fade into dense mist and vanish
  | "clouds_parting" // Clouds billow outward and dissolve, revealing invitation
  | "completed"; // Finished, invitation fully interactive

interface BalloonSkyOpeningCeremonyProps {
  coupleName?: string;
  weddingDate?: string;
  greeting?: string;
  onOpenComplete?: () => void;
  audioTrackSrc?: string;
  autoPlayAudio?: boolean;
  replayTrigger?: number; // Increment to replay
}

export default function BalloonSkyOpeningCeremony({
  coupleName = "Văn Tài & Kim Hiên",
  weddingDate = "27 Tháng 10, 2026",
  greeting = "Thân Mời Quý Khách",
  onOpenComplete,
  audioTrackSrc = "/wedding-invitations/20261027-KHVT/audio/mot-doi.m4a",
  autoPlayAudio = true,
  replayTrigger = 0,
}: BalloonSkyOpeningCeremonyProps) {
  const [stage, setStage] = useState<OpeningStage>("ready");
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stageTimeoutRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimeouts = () => {
    stageTimeoutRef.current.forEach(clearTimeout);
    stageTimeoutRef.current = [];
  };

  // Replay whenever replayTrigger changes
  useEffect(() => {
    if (replayTrigger > 0) {
      clearAllTimeouts();
      setStage("ready");
    }
  }, [replayTrigger]);

  const startOpeningSequence = () => {
    if (stage !== "ready" && stage !== "completed") return;
    clearAllTimeouts();

    // Start background romantic music if configured
    if (audioRef.current && autoPlayAudio && !isMuted) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }

    // 1. Balloons rise from bottom to center (0s -> 2.2s)
    setStage("rising_to_center");

    // 2. Camera tracking upwards into stratosphere (2.2s -> 4.8s)
    const t1 = setTimeout(() => {
      setStage("camera_tracking");
    }, 2200);

    // 3. Dense volumetric clouds roll in, completely covering the screen (4.8s -> 6.8s)
    const t2 = setTimeout(() => {
      setStage("clouds_enveloping");
    }, 4800);

    // 4. Balloons vanish into the deep white mist (6.8s -> 7.6s)
    const t3 = setTimeout(() => {
      setStage("balloons_vanish");
    }, 6800);

    // 5. Clouds part and dissolve outwards, revealing invitation content (7.6s -> 9.4s)
    const t4 = setTimeout(() => {
      setStage("clouds_parting");
    }, 7600);

    // 6. Complete and remove overlay (9.4s)
    const t5 = setTimeout(() => {
      setStage("completed");
      if (onOpenComplete) onOpenComplete();
    }, 9400);

    stageTimeoutRef.current = [t1, t2, t3, t4, t5];
  };

  const handleSkip = () => {
    clearAllTimeouts();
    if (audioRef.current && autoPlayAudio && !isMuted) {
      audioRef.current.play().catch(() => {});
    }
    setStage("completed");
    if (onOpenComplete) onOpenComplete();
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioRef.current.muted = nextMuted;
  };

  if (stage === "completed") {
    return null;
  }

  return (
    <div className={`balloon-opening-ceremony-root stage-${stage}`}>
      {/* Hidden audio element for romantic backdrop */}
      {audioTrackSrc && (
        <audio ref={audioRef} src={audioTrackSrc} loop preload="auto" />
      )}

      {/* Top right utility bar: Skip and Audio toggle */}
      <div className="ceremony-top-controls">
        <button
          type="button"
          className="btn-ceremony-tool"
          onClick={toggleMute}
          title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <button
          type="button"
          className="btn-ceremony-skip"
          onClick={handleSkip}
          title="Bỏ qua hiệu ứng mở thiệp"
        >
          <span>Bỏ qua</span>
          <span>✕</span>
        </button>
      </div>

      {/* ================================================================= */}
      {/* SKY BACKGROUND LAYER (With dynamic vertical parallax pan)          */}
      {/* ================================================================= */}
      <div className="cinematic-sky-backdrop">
        {/* Morning sunbeam / lens flare glow */}
        <div className="sky-sun-flare" />

        {/* Ambient high altitude stars / golden shimmer */}
        <div className="sky-golden-particles" />
      </div>

      {/* ================================================================= */}
      {/* INITIAL OPENING SEAL / ENVELOPE CARD (Visible in "ready" stage)   */}
      {/* ================================================================= */}
      {stage === "ready" && (
        <div className="ceremony-welcome-card-wrap">
          <div className="welcome-wax-seal">
            <span className="seal-char">囍</span>
          </div>

          <p className="welcome-greeting">{greeting}</p>
          <h1 className="welcome-couple-names">{coupleName}</h1>
          <div className="welcome-date-badge">
            <Sparkles size={12} className="sparkle-ico" />
            <span>{weddingDate}</span>
          </div>

          <button
            type="button"
            className="btn-pulse-open-ceremony"
            onClick={startOpeningSequence}
          >
            <span className="btn-glow-ring" />
            <span className="btn-text-content">
              <span>CHẠM ĐỂ MỞ THIỆP</span>
              <span className="balloon-icon-emoji">🎈</span>
            </span>
          </button>

          <p className="welcome-subnote">Cùng bay lên bầu trời hạnh phúc với chúng mình</p>
        </div>
      )}

      {/* ================================================================= */}
      {/* WISPY FOREGROUND CLOUDS (Rush downward when camera tracks up)      */}
      {/* ================================================================= */}
      {(stage === "camera_tracking" || stage === "rising_to_center") && (
        <div className="fast-wisps-container">
          <div className="wisp wisp-1" />
          <div className="wisp wisp-2" />
          <div className="wisp wisp-3" />
          <div className="wisp wisp-4" />
        </div>
      )}

      {/* ================================================================= */}
      {/* THE YELLOW SMILEY BALLOON BUNCH (User's Exact Uploaded Balloons!)  */}
      {/* ================================================================= */}
      {stage !== "ready" && (
        <div className={`flying-balloon-rig stage-anim-${stage}`}>
          <div className="balloon-sway-rotator">
            <img
              src="/balloons/balloons-clean.png"
              alt="Chùm bóng bay mặt cười vàng"
              className="balloon-bunch-img"
            />
          </div>
          {/* Subtle aerodynamic wind trail / sparkle sparkles */}
          <div className="balloon-sparkle-trail">
            <span className="trail-dot dot-1" />
            <span className="trail-dot dot-2" />
            <span className="trail-dot dot-3" />
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* VOLUMETRIC REALISTIC CLOUD LAYERS (Cover screen, then part away)   */}
      {/* ================================================================= */}
      {(stage === "camera_tracking" ||
        stage === "clouds_enveloping" ||
        stage === "balloons_vanish" ||
        stage === "clouds_parting") && (
        <div className="volumetric-clouds-system">
          {/* Cloud Bank Left-Top */}
          <div className="v-cloud v-cloud-left">
            <img
              src="/balloons/cloud-bank-1.png"
              alt=""
              className="v-cloud-img"
            />
          </div>

          {/* Cloud Bank Right-Bottom */}
          <div className="v-cloud v-cloud-right">
            <img
              src="/balloons/cloud-bank-2.png"
              alt=""
              className="v-cloud-img"
            />
          </div>

          {/* Cloud Bank Center-Front */}
          <div className="v-cloud v-cloud-center">
            <img
              src="/balloons/cloud-bank-1.png"
              alt=""
              className="v-cloud-img"
            />
          </div>

          {/* Full Screen Dense Whiteout Veil (Reaches 100% opacity) */}
          <div className="v-cloud-curtain">
            <img
              src="/balloons/cloud-curtain.png"
              alt=""
              className="curtain-img"
            />
          </div>
        </div>
      )}
    </div>
  );
}
