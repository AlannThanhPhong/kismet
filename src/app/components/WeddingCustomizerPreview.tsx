"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Compass,
  Copy,
  Disc,
  ExternalLink,
  Eye,
  Gift,
  Heart,
  HelpCircle,
  ImageIcon,
  Layers,
  Mail,
  MapPin,
  Maximize2,
  MessageSquare,
  Minimize2,
  Monitor,
  Music,
  Palette,
  PartyPopper,
  Phone,
  Play,
  Plus,
  RefreshCw,
  Send,
  Share2,
  Shirt,
  Smartphone,
  Sparkles,
  Trash2,
  Upload,
  User,
  Users,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { packagePrice, type PricingCurrency } from "@/lib/pricing";
import { CONTACT_PHONES } from "@/lib/contact";
import { DEFAULT_WEDDING_SONG, WEDDING_SONGS } from "@/lib/wedding-songs";
import { DRESS_COLOR_FAMILIES, DRESS_COLOR_PALETTE, normalizeColorSearch, swatchCheckColor } from "@/lib/dress-colors";

export type CustomizerPackage = "standard" | "premium";

export interface CeremonyItem {
  id: string;
  name: string;
  time: string;
  date: string;
  venue: string;
  address: string;
}

export interface RSVPQuestion {
  id: string;
  question: string;
  type: "radio" | "text";
  options?: string[];
}

export interface DressCodeColor {
  name: string;
  hex: string;
  selected: boolean;
}

export interface TimelineItem {
  id: string;
  time: string;
  title: string;
  description: string;
}

export interface GuestbookWish {
  id: string;
  senderName: string;
  relationship: string;
  message: string;
  createdAt: string;
}

export interface BankAccountItem {
  id: string;
  target: "groom" | "bride" | "both";
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface WeddingEditorData {
  packageType: CustomizerPackage;
  // 1. Lời mở đầu
  useDefaultIntro: boolean;
  introText: string;
  groomFullName: string;
  brideFullName: string;
  groomShortName: string;
  brideShortName: string;
  groomRole: string; // Trưởng Nam, Thứ Nam, Út Nam
  brideRole: string; // Trưởng Nữ, Thứ Nữ, Út Nữ
  displayOrder: "groom_first" | "bride_first"; // Nhà trai trước | Nhà gái trước

  // 2. Ảnh đầu thiệp
  showHeroImage: boolean;
  heroImage: string;

  // 3. Thông tin gia đình
  showFamilyInfo: boolean;
  groomFamily: {
    title: string;
    father: string;
    mother: string;
    address: string;
  };
  brideFamily: {
    title: string;
    father: string;
    mother: string;
    address: string;
  };

  // 4. Lời thông báo
  showAnnouncement: boolean;
  announcementText: string;

  // 5. Lễ cưới
  showCeremony: boolean;
  ceremonyTitle: string;
  ceremonies: CeremonyItem[];

  // 6. Tiệc cưới
  showParty: boolean;
  partyType: "wedding" | "announcement" | "engagement";
  partyTitle: string;
  partyDate: string; // YYYY-MM-DD
  partyTime: string; // HH:MM
  timeFormat: "24h" | "12h";
  showGuestTime: boolean;
  guestWelcomeTime: string;
  partyStartTime: string;
  showCountdown: boolean;
  venueTitle: string;
  venueName: string;
  venueAddress: string;
  mapsUrl: string;

  // 7. Thư viện ảnh
  showGallery: boolean;
  galleryLayout: "grid" | "collage" | "carousel";
  galleryPhotos: string[];

  // 8. Câu hỏi thêm cho khách mời (Mới từ Screenshot 1)
  showRsvpQuestions: boolean;
  rsvpQuestions: RSVPQuestion[];

  // 9. Dress Code (Mới từ Screenshot 1)
  showDressCode: boolean;
  dressCodeDescription: string;
  dressCodeColors: DressCodeColor[];

  // 10. Lịch trình ngày cưới (Mới từ Screenshot 1)
  showTimeline: boolean;
  timelineItems: TimelineItem[];

  // 11. Sổ lưu bút (Mới từ Screenshot 1)
  showGuestbook: boolean;
  guestbookWishes: GuestbookWish[];

  // 12. Hộp Quà Mừng (Mới từ Screenshot 1 & 2)
  showGiftBox: boolean;
  bankAccounts: BankAccountItem[];
  otherPaymentNote: string;
  groomBank: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  brideBank: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };

  // 13. Lời cảm ơn (Mới từ Screenshot 2)
  showThankYou: boolean;
  thankYouMessage: string;

  // 14. Nhạc nền (Mới từ Screenshot 2)
  showMusic: boolean;
  musicTrackTitle: string;
  musicTrack: string;
  autoPlayMusic: boolean;

  // 15. Phong bì (Mới từ Screenshot 3)
  showEnvelope: boolean;
  envelopeGreeting: string; // "Thân Mời", "Kính Mời", "Trân Trọng Kính Mời"
  envelopeGuestName: string; // "Quý Khách & Người Thương"

  // 16. Ảnh xem trước khi chia sẻ (Mới từ Screenshot 3)
  sharePreviewType: "envelope" | "photo";
}

const DEFAULT_EDITOR_DATA_800K: WeddingEditorData = {
  packageType: "premium",
  useDefaultIntro: true,
  introText: "WELCOME TO OUR WEDDING",
  groomFullName: "Lê Văn Tài",
  brideFullName: "Trần Thị Kim Hiên",
  groomShortName: "Văn Tài",
  brideShortName: "Kim Hiên",
  groomRole: "Út Nam",
  brideRole: "Út Nữ",
  displayOrder: "groom_first",

  showHeroImage: true,
  heroImage: "/wedding-invitations/20261027-KHVT/images/0V7A7519-800.webp",

  showFamilyInfo: true,
  groomFamily: {
    title: "Ông Bà",
    father: "Lê Văn Lộc",
    mother: "Hà Thị Kim Cương",
    address: "Trường An, Trường Tây, Long Hoa, Tây Ninh",
  },
  brideFamily: {
    title: "Ông Bà",
    father: "Trần Quang Hồ",
    mother: "Trần Thị Phượng",
    address: "Tổ 10, ấp Tân Đông 1, xã Tân Lập, Tây Ninh",
  },

  showAnnouncement: true,
  announcementText: "TRÂN TRỌNG BÁO TIN LỄ VU QUY & THÀNH HÔN CỦA CON CHÚNG TÔI",

  showCeremony: true,
  ceremonyTitle: "THÔNG TIN LỄ CƯỚI",
  ceremonies: [
    {
      id: "ceremony-1",
      name: "Lễ Vu Quy",
      time: "09:00",
      date: "27/10/2026",
      venue: "Tư gia nhà gái",
      address: "Tổ 10, ấp Tân Đông 1, xã Tân Lập",
    },
    {
      id: "ceremony-2",
      name: "Lễ Thành Hôn",
      time: "10:30",
      date: "27/10/2026",
      venue: "Tư gia nhà trai",
      address: "Trường An, Trường Tây, Long Hoa",
    },
  ],

  showParty: true,
  partyType: "wedding",
  partyTitle: "THÔNG TIN TIỆC CƯỚI",
  partyDate: "2026-10-27",
  partyTime: "11:30",
  timeFormat: "24h",
  showGuestTime: true,
  guestWelcomeTime: "11:00",
  partyStartTime: "11:30",
  showCountdown: true,
  venueTitle: "Tiệc cưới sẽ tổ chức tại",
  venueName: "Tư gia nhà gái",
  venueAddress: "Tổ 10, ấp Tân Đông 1, xã Tân Lập, huyện Tân Biên, Tây Ninh",
  mapsUrl: "https://maps.google.com",

  showGallery: true,
  galleryLayout: "grid",
  galleryPhotos: [
    "/wedding-invitations/20261027-KHVT/images/0V7A7621-800.webp",
    "/wedding-invitations/20261027-KHVT/images/0V7A7371-800.webp",
    "/wedding-invitations/20261027-KHVT/images/0V7A7908-800.webp",
    "/wedding-invitations/20261027-KHVT/images/0V7A7639-800.webp",
  ],

  // Câu hỏi thêm cho khách mời
  showRsvpQuestions: true,
  rsvpQuestions: [
    {
      id: "q-1",
      question: "Bạn sẽ đi cùng ai?",
      type: "radio",
      options: ["Đi một mình", "Đi cùng người thương (+1)", "Đi cùng gia đình"],
    },
    {
      id: "q-2",
      question: "Bạn có yêu cầu đặc biệt về khẩu phần ăn không?",
      type: "radio",
      options: ["Ăn thông thường", "Khẩu phần ăn chay", "Dị ứng hải sản"],
    },
  ],

  // Dress Code
  showDressCode: false,
  dressCodeDescription: "Tone màu trang nhã: Trắng, Be, Nâu ấm, Pastel để chúng mình cùng có những khung hình đẹp nhất nhé!",
  dressCodeColors: [
    { name: "Trắng tinh khôi", hex: "#FFFFFF", selected: true },
    { name: "Be sữa", hex: "#F5ECE1", selected: true },
    { name: "Nâu ấm", hex: "#8C6239", selected: true },
    { name: "Hồng pastel", hex: "#E8C5C8", selected: true },
    { name: "Xanh sage", hex: "#9EAA9B", selected: true },
  ],

  // Lịch trình ngày cưới
  showTimeline: false,
  timelineItems: [
    { id: "tl-1", time: "08:30", title: "Lễ Gia Tiên & Đón Dâu", description: "Tại tư gia nhà gái" },
    { id: "tl-2", time: "11:00", title: "Đón Khách & Chụp Ảnh Kỷ Niệm", description: "Sảnh đón tiệc chính" },
    { id: "tl-3", time: "11:45", title: "Khai Tiệc & Nghi Thức Hôn Lễ", description: "Sân khấu trung tâm" },
    { id: "tl-4", time: "13:00", title: "Cảm Ơn & Tiễn Khách", description: "Sảnh tiệc" },
  ],

  // Sổ lưu bút
  showGuestbook: true,
  guestbookWishes: [
    {
      id: "w-1",
      senderName: "Minh Trang & Hoàng Long",
      relationship: "Bạn thân đại học",
      message: "Chúc hai bạn trăm năm hạnh phúc, mãi ngọt ngào và cùng nhau đi khắp thế gian nhé!",
      createdAt: "Hôm nay",
    },
    {
      id: "w-2",
      senderName: "Chị Ngọc Mai",
      relationship: "Đồng nghiệp",
      message: "Chúc Kim Hiên và Văn Tài một đời an yên, hôn nhân viên mãn tràn ngập tiếng cười!",
      createdAt: "Hôm qua",
    },
  ],

  // Hộp Quà Mừng
  showGiftBox: true,
  bankAccounts: [
    {
      id: "b-1",
      target: "groom",
      bankName: "MB Bank",
      accountNumber: "0827274387",
      accountHolder: "LE VAN TAI",
    },
    {
      id: "b-2",
      target: "bride",
      bankName: "Vietcombank",
      accountNumber: "1029384567",
      accountHolder: "TRAN THI KIM HIEN",
    },
  ],
  otherPaymentNote: "Ví điện tử MoMo / ZaloPay: 0827274387",
  groomBank: {
    bankName: "MB Bank",
    accountNumber: "0827274387",
    accountHolder: "LE VAN TAI",
  },
  brideBank: {
    bankName: "Vietcombank",
    accountNumber: "1029384567",
    accountHolder: "TRAN THI KIM HIEN",
  },

  // Lời cảm ơn
  showThankYou: true,
  thankYouMessage: "Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng tôi!",

  // Nhạc nền
  showMusic: true,
  musicTrackTitle: `${DEFAULT_WEDDING_SONG.title} - ${DEFAULT_WEDDING_SONG.artist}`,
  musicTrack: DEFAULT_WEDDING_SONG.src,
  autoPlayMusic: true,

  // Phong bì
  showEnvelope: true,
  envelopeGreeting: "Thân Mời",
  envelopeGuestName: "Quý Khách & Người Thương",

  // Ảnh xem trước khi chia sẻ
  sharePreviewType: "envelope",
};

const DEFAULT_EDITOR_DATA_500K: WeddingEditorData = {
  packageType: "standard",
  useDefaultIntro: true,
  introText: "WELCOME TO OUR WEDDING",
  groomFullName: "Nguyễn Đức Anh",
  brideFullName: "Trần Thu Hà",
  groomShortName: "Đức Anh",
  brideShortName: "Thu Hà",
  groomRole: "Trưởng Nam",
  brideRole: "Út Nữ",
  displayOrder: "groom_first",

  showHeroImage: true,
  heroImage: "/home/images/garden-wedding.jpg",

  showFamilyInfo: true,
  groomFamily: {
    title: "Ông Bà",
    father: "Nguyễn Văn Hùng",
    mother: "Trần Thị Lan",
    address: "Hà Nội",
  },
  brideFamily: {
    title: "Ông Bà",
    father: "Trần Văn Minh",
    mother: "Phạm Thị Hoa",
    address: "Hà Nội",
  },

  showAnnouncement: true,
  announcementText: "TRÂN TRỌNG BÁO TIN LỄ THÀNH HÔN CỦA CON CHÚNG TÔI",

  showCeremony: false,
  ceremonyTitle: "THÔNG TIN LỄ CƯỚI",
  ceremonies: [],

  showParty: true,
  partyType: "wedding",
  partyTitle: "THÔNG TIN TIỆC CƯỚI",
  partyDate: "2026-10-27",
  partyTime: "11:30",
  timeFormat: "24h",
  showGuestTime: true,
  guestWelcomeTime: "11:00",
  partyStartTime: "11:30",
  showCountdown: true,
  venueTitle: "Tiệc cưới sẽ tổ chức tại",
  venueName: "Trung tâm tiệc cưới The Grand Palace",
  venueAddress: "142 Đường Cộng Hòa, Phường 4, Tân Bình, TP. Hồ Chí Minh",
  mapsUrl: "https://maps.google.com",

  showGallery: true,
  galleryLayout: "grid",
  galleryPhotos: [
    "/home/images/hero-couple.jpg",
    "/home/images/wedding-moment.jpg",
    "/home/images/wedding-story.jpg",
    "/home/images/nostalgic-wedding.jpg",
  ],

  // Câu hỏi thêm cho khách mời
  showRsvpQuestions: false,
  rsvpQuestions: [],

  // Dress Code
  showDressCode: false,
  dressCodeDescription: "Trang phục lịch sự, trang nhã (Be / Trắng / Pastel)",
  dressCodeColors: [
    { name: "Trắng", hex: "#FFFFFF", selected: true },
    { name: "Be", hex: "#F5ECE1", selected: true },
    { name: "Hồng nhạt", hex: "#E8C5C8", selected: true },
  ],

  // Lịch trình ngày cưới
  showTimeline: false,
  timelineItems: [],

  // Sổ lưu bút
  showGuestbook: true,
  guestbookWishes: [
    {
      id: "w-501",
      senderName: "Gia đình Bác Hải",
      relationship: "Họ hàng",
      message: "Chúc hai cháu trăm năm tình viên mãn, đầu bạc răng long!",
      createdAt: "Hôm nay",
    },
  ],

  // Hộp Quà Mừng
  showGiftBox: true,
  bankAccounts: [
    {
      id: "b-std-1",
      target: "groom",
      bankName: "MB Bank",
      accountNumber: "0827274387",
      accountHolder: "NGUYEN DUC ANH",
    },
  ],
  otherPaymentNote: "MoMo: 0827274387",
  groomBank: {
    bankName: "MB Bank",
    accountNumber: "0827274387",
    accountHolder: "NGUYEN DUC ANH",
  },
  brideBank: {
    bankName: "Vietcombank",
    accountNumber: "0123456789",
    accountHolder: "TRAN THU HA",
  },

  // Lời cảm ơn
  showThankYou: true,
  thankYouMessage: "Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng tôi!",

  // Nhạc nền
  showMusic: true,
  musicTrackTitle: `${DEFAULT_WEDDING_SONG.title} - ${DEFAULT_WEDDING_SONG.artist}`,
  musicTrack: DEFAULT_WEDDING_SONG.src,
  autoPlayMusic: true,

  // Phong bì
  showEnvelope: true,
  envelopeGreeting: "Thân Mời",
  envelopeGuestName: "Quý Khách & Người Thương",

  // Ảnh xem trước khi chia sẻ
  sharePreviewType: "envelope",
};

interface WeddingCustomizerPreviewProps {
  initialPackage?: CustomizerPackage;
  currency?: PricingCurrency;
  previewOnly?: boolean;
}

function createEditorData(packageType: CustomizerPackage): WeddingEditorData {
  const defaults = packageType === "standard" ? DEFAULT_EDITOR_DATA_500K : DEFAULT_EDITOR_DATA_800K;
  return {
    ...defaults,
    dressCodeColors: DRESS_COLOR_PALETTE.map((color) => {
      const original = defaults.dressCodeColors.find((item) => item.hex.toLowerCase() === color.hex.toLowerCase());
      return { name: original?.name ?? color.name, hex: color.hex, selected: original?.selected ?? false };
    }),
  };
}

function CustomizerModal({ title, className = "modal-inner-card", onClose, children }: {
  title: string;
  className?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
      }
      if (event.key !== "Tab") return;
      const controls = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
      ) ?? []).filter((element) => element.getClientRects().length > 0);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first) {
        event.preventDefault();
        return;
      }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialogRef.current)) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  return createPortal(
    <div className="publish-modal-backdrop" onClick={onClose}>
      <div ref={dialogRef} className={className} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}

export default function WeddingCustomizerPreview({
  initialPackage = "premium",
  currency = "VND",
  previewOnly = false,
}: WeddingCustomizerPreviewProps) {
  // Main form data
  const [data, setData] = useState<WeddingEditorData>(() => createEditorData(initialPackage));
  const [dressColorSearch, setDressColorSearch] = useState("");
  const [dressColorFamily, setDressColorFamily] = useState("");
  const selectedDressColors = data.dressCodeColors.filter((color) => color.selected);
  const filteredDressColors = data.dressCodeColors.filter((color) => {
    const palette = DRESS_COLOR_PALETTE.find((item) => item.hex === color.hex);
    return (!dressColorFamily || palette?.family === dressColorFamily)
      && normalizeColorSearch(`${color.name} ${palette?.name ?? ""} ${color.hex}`).includes(normalizeColorSearch(dressColorSearch));
  });
  const toggleDressColor = (hex: string) => {
    setData((previous) => ({
      ...previous,
      dressCodeColors: previous.dressCodeColors.map((color) => color.hex === hex ? { ...color, selected: !color.selected } : color),
    }));
  };

  // View modes: "edit" (form), "preview" (full canvas), "split" (form + live canvas side-by-side)
  const [activeTab, setActiveTab] = useState<"edit" | "preview" | "split">("split");
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Modals for newly requested sections
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [isWishesModalOpen, setIsWishesModalOpen] = useState(false);

  // Temporary inputs for modals
  const [tempQuestionText, setTempQuestionText] = useState("");
  const [tempQuestionType, setTempQuestionType] = useState<"radio" | "text">("radio");
  const [tempQuestionOptions, setTempQuestionOptions] = useState("Có, Không");

  const [tempBankTarget, setTempBankTarget] = useState<"groom" | "bride" | "both">("groom");
  const [tempBankName, setTempBankName] = useState("MB Bank");
  const [tempBankAccount, setTempBankAccount] = useState("");
  const [tempBankHolder, setTempBankHolder] = useState("");

  const [tempTimelineTime, setTempTimelineTime] = useState("11:00");
  const [tempTimelineTitle, setTempTimelineTitle] = useState("Đón khách & Chụp ảnh");
  const [tempTimelineDesc, setTempTimelineDesc] = useState("Tại sảnh tiệc chính");

  // Accordion open/close state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    intro: true,
    hero: true,
    family: true,
    announcement: true,
    ceremony: true,
    party: true,
    gallery: true,
    rsvpQuestions: true,
    dressCode: true,
    timeline: true,
    guestbook: true,
    gift: true,
    thankYou: true,
    music: true,
    envelope: true,
    sharePreview: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Switch package
  const handleSwitchPackage = (pkg: CustomizerPackage) => {
    setData(createEditorData(pkg));
    setDressColorSearch("");
    setDressColorFamily("");
  };

  // Music toggle
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }
  };

  const handleSelectMusicTrack = (song: (typeof WEDDING_SONGS)[0]) => {
    setData((prev) => ({
      ...prev,
      musicTrack: song.src,
      musicTrackTitle: `${song.title} - ${song.artist}`,
    }));
    setIsMusicModalOpen(false);
    if (audioRef.current) {
      audioRef.current.src = song.src;
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }
  };

  // Upload Hero Image
  const handleHeroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setData((prev) => ({ ...prev, heroImage: url }));
  };

  // Upload Gallery Image
  const handleAddGalleryPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setData((prev) => ({
      ...prev,
      galleryPhotos: [...prev.galleryPhotos, url],
    }));
  };

  const handleRemoveGalleryPhoto = (index: number) => {
    setData((prev) => ({
      ...prev,
      galleryPhotos: prev.galleryPhotos.filter((_, i) => i !== index),
    }));
  };

  // Ceremonies
  const handleAddCeremony = () => {
    const newId = `ceremony-${Date.now()}`;
    setData((prev) => ({
      ...prev,
      ceremonies: [
        ...prev.ceremonies,
        {
          id: newId,
          name: "Lễ Thành Hôn",
          time: "10:00",
          date: prev.partyDate,
          venue: "Tư gia",
          address: "Địa chỉ hôn lễ",
        },
      ],
    }));
  };

  const handleRemoveCeremony = (id: string) => {
    setData((prev) => ({
      ...prev,
      ceremonies: prev.ceremonies.filter((c) => c.id !== id),
    }));
  };

  // RSVP Question Handler
  const handleAddQuestionSubmit = () => {
    if (!tempQuestionText.trim()) return;
    const newQ: RSVPQuestion = {
      id: `q-${Date.now()}`,
      question: tempQuestionText.trim(),
      type: tempQuestionType,
      options:
        tempQuestionType === "radio"
          ? tempQuestionOptions.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined,
    };
    setData((prev) => ({
      ...prev,
      rsvpQuestions: [...prev.rsvpQuestions, newQ],
    }));
    setTempQuestionText("");
    setIsQuestionModalOpen(false);
  };

  const handleRemoveQuestion = (id: string) => {
    setData((prev) => ({
      ...prev,
      rsvpQuestions: prev.rsvpQuestions.filter((q) => q.id !== id),
    }));
  };

  // Timeline Handlers
  const handleAddTimelineSubmit = () => {
    if (!tempTimelineTitle.trim()) return;
    const newT: TimelineItem = {
      id: `tl-${Date.now()}`,
      time: tempTimelineTime.trim(),
      title: tempTimelineTitle.trim(),
      description: tempTimelineDesc.trim(),
    };
    setData((prev) => ({
      ...prev,
      timelineItems: [...prev.timelineItems, newT],
    }));
    setTempTimelineTitle("");
    setIsTimelineModalOpen(false);
  };

  const handleRemoveTimeline = (id: string) => {
    setData((prev) => ({
      ...prev,
      timelineItems: prev.timelineItems.filter((t) => t.id !== id),
    }));
  };

  // Bank Account Handlers
  const handleAddBankSubmit = () => {
    if (!tempBankAccount.trim() || !tempBankHolder.trim()) return;
    const newB: BankAccountItem = {
      id: `b-${Date.now()}`,
      target: tempBankTarget,
      bankName: tempBankName.trim(),
      accountNumber: tempBankAccount.trim(),
      accountHolder: tempBankHolder.trim().toUpperCase(),
    };
    setData((prev) => {
      const nextAccounts = [...prev.bankAccounts, newB];
      let newGroomBank = prev.groomBank;
      let newBrideBank = prev.brideBank;
      if (tempBankTarget === "groom") {
        newGroomBank = {
          bankName: tempBankName,
          accountNumber: tempBankAccount,
          accountHolder: tempBankHolder.toUpperCase(),
        };
      } else if (tempBankTarget === "bride") {
        newBrideBank = {
          bankName: tempBankName,
          accountNumber: tempBankAccount,
          accountHolder: tempBankHolder.toUpperCase(),
        };
      }
      return {
        ...prev,
        bankAccounts: nextAccounts,
        groomBank: newGroomBank,
        brideBank: newBrideBank,
      };
    });
    setTempBankAccount("");
    setTempBankHolder("");
    setIsBankModalOpen(false);
  };

  const handleRemoveBankAccount = (id: string) => {
    setData((prev) => ({
      ...prev,
      bankAccounts: prev.bankAccounts.filter((b) => b.id !== id),
    }));
  };

  // Guestbook Add Wish (Interactive for preview)
  const handleAddLiveWish = (name: string, relationship: string, message: string) => {
    if (!name.trim() || !message.trim()) return;
    const newWish: GuestbookWish = {
      id: `w-${Date.now()}`,
      senderName: name.trim(),
      relationship: relationship || "Khách mời",
      message: message.trim(),
      createdAt: "Vừa xong",
    };
    setData((prev) => ({
      ...prev,
      guestbookWishes: [newWish, ...prev.guestbookWishes],
    }));
  };

  // Names formatting
  const firstPerson = data.displayOrder === "groom_first" ? data.groomShortName : data.brideShortName;
  const secondPerson = data.displayOrder === "groom_first" ? data.brideShortName : data.groomShortName;
  const firstRole = data.displayOrder === "groom_first" ? data.groomRole : data.brideRole;
  const secondRole = data.displayOrder === "groom_first" ? data.brideRole : data.groomRole;

  const formattedPartyDate = useMemo(() => {
    if (!data.partyDate) return "27 Tháng 10, 2026";
    const parts = data.partyDate.split("-");
    if (parts.length === 3) {
      return `${parseInt(parts[2], 10)} Tháng ${parseInt(parts[1], 10)}, ${parts[0]}`;
    }
    return data.partyDate;
  }, [data.partyDate]);

  const monogram = useMemo(() => {
    const gInitial = data.groomShortName.trim().charAt(0).toUpperCase() || "T";
    const bInitial = data.brideShortName.trim().charAt(0).toUpperCase() || "H";
    return `${gInitial} & ${bInitial}`;
  }, [data.groomShortName, data.brideShortName]);

  if (previewOnly) {
    return (
      <main className="standalone-invitation-preview" aria-label={`Thiệp cưới ${firstPerson} và ${secondPerson}`}>
        <audio
          ref={audioRef}
          src={data.musicTrack}
          preload="metadata"
          loop
          onPlay={() => setIsPlayingMusic(true)}
          onPause={() => setIsPlayingMusic(false)}
        />
        <LiveTemplateDocument
          data={data}
          monogram={monogram}
          formattedDate={formattedPartyDate}
          firstPerson={firstPerson}
          secondPerson={secondPerson}
          firstRole={firstRole}
          secondRole={secondRole}
          isPlayingMusic={isPlayingMusic}
          toggleMusic={toggleMusic}
          onAddWish={handleAddLiveWish}
        />
      </main>
    );
  }

  return (
    <div className="chungdoi-studio-container">
      {/* Hidden Audio Player */}
      <audio
        ref={audioRef}
        src={data.musicTrack}
        preload="metadata"
        loop
        onPlay={() => setIsPlayingMusic(true)}
        onPause={() => setIsPlayingMusic(false)}
      />

      {/* ================================================================= */}
      {/* TOP HEADER BAR (Chung Đôi Style)                                  */}
      {/* ================================================================= */}
      <header className="chungdoi-studio-header">
        <div className="header-left">
          <Link href="/" className="btn-back-home" title="Trở về trang chủ">
            <ArrowLeft size={16} />
            <span className="hide-on-mobile">Trang chủ</span>
          </Link>

          {/* Template Selector Pill */}
          <div
            className={`template-pill-chip ${data.packageType === "premium" ? "is-premium" : ""}`}
            onClick={() => handleSwitchPackage(data.packageType === "premium" ? "standard" : "premium")}
            title="Bấm để đổi nhanh giữa Gói 500k và 800k"
          >
            <Sparkles size={14} className="chip-sparkle" />
            <span>
              {data.packageType === "premium"
                ? "Mẫu 800k · Ngày Mình Chung Đôi (KHVT)"
                : "Mẫu 500k · Minimal Ivory (Tiêu Chuẩn)"}
            </span>
            <ChevronDown size={13} />
          </div>
        </div>

        {/* Center Tabs: Chỉnh sửa | Xem trước | Chia đôi */}
        <div className="header-center-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === "edit" ? "is-active" : ""}`}
            onClick={() => setActiveTab("edit")}
          >
            <span>✏️ Chỉnh sửa</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "preview" ? "is-active" : ""}`}
            onClick={() => setActiveTab("preview")}
          >
            <span>👁️ Xem trước</span>
          </button>
          <button
            type="button"
            className={`tab-btn hide-on-tablet ${activeTab === "split" ? "is-active" : ""}`}
            onClick={() => setActiveTab("split")}
          >
            <span>◫ Chia đôi</span>
          </button>
        </div>

        {/* Right CTA */}
        <div className="header-right-actions">
          <button
            type="button"
            className="btn-publish-order"
            onClick={() => setIsPublishModalOpen(true)}
          >
            <Sparkles size={14} />
            <span>Xuất bản</span>
          </button>
        </div>
      </header>

      {/* ================================================================= */}
      {/* MAIN WORKSPACE: LEFT FORM + RIGHT LIVE PREVIEW CANVAS              */}
      {/* ================================================================= */}
      <div className={`chungdoi-workspace ${activeTab}`}>
        {/* =============================================================== */}
        {/* LEFT COLUMN: ACCORDION FORM SECTIONS                            */}
        {/* =============================================================== */}
        {(activeTab === "edit" || activeTab === "split") && (
          <aside className="editor-form-scroll-pane">
            <div className="form-sections-container">
              {/* 1. LỜI MỞ ĐẦU */}
              <div className="cd-accordion-card">
                <div className="cd-card-header" onClick={() => toggleSection("intro")}>
                  <div className="card-header-title">
                    <span className="card-icon">💌</span>
                    <h3>Lời mở đầu</h3>
                  </div>
                  <div className="card-header-actions" onClick={(e) => e.stopPropagation()}>
                    <label className="toggle-switch-label">
                      <span>{data.useDefaultIntro ? "Mặc định" : "Tự nhập"}</span>
                      <input
                        type="checkbox"
                        checked={data.useDefaultIntro}
                        onChange={(e) => setData({ ...data, useDefaultIntro: e.target.checked })}
                      />
                      <span className="toggle-slider" />
                    </label>
                    <button type="button" className="btn-toggle-accordion" onClick={() => toggleSection("intro")} aria-expanded={openSections.intro} aria-label="Lời mở đầu">
                      {openSections.intro ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {openSections.intro && (
                  <div className="cd-card-body">
                    {!data.useDefaultIntro && (
                      <div className="input-group">
                        <label>Dòng tiêu đề mở đầu</label>
                        <input
                          type="text"
                          value={data.introText}
                          onChange={(e) => setData({ ...data, introText: e.target.value })}
                          placeholder="WELCOME TO OUR WEDDING"
                        />
                      </div>
                    )}

                    <div className="input-row-grid">
                      <div className="input-group">
                        <label>Họ và tên Chú Rể</label>
                        <input
                          type="text"
                          value={data.groomFullName}
                          onChange={(e) => setData({ ...data, groomFullName: e.target.value })}
                          placeholder="Lê Văn Tài"
                        />
                      </div>
                      <div className="input-group">
                        <label>Tên gọi / Tên ngắn Chú Rể</label>
                        <input
                          type="text"
                          value={data.groomShortName}
                          onChange={(e) => setData({ ...data, groomShortName: e.target.value })}
                          placeholder="Văn Tài"
                        />
                      </div>
                    </div>

                    <div className="input-row-grid">
                      <div className="input-group">
                        <label>Họ và tên Cô Dâu</label>
                        <input
                          type="text"
                          value={data.brideFullName}
                          onChange={(e) => setData({ ...data, brideFullName: e.target.value })}
                          placeholder="Trần Thị Kim Hiên"
                        />
                      </div>
                      <div className="input-group">
                        <label>Tên gọi / Tên ngắn Cô Dâu</label>
                        <input
                          type="text"
                          value={data.brideShortName}
                          onChange={(e) => setData({ ...data, brideShortName: e.target.value })}
                          placeholder="Kim Hiên"
                        />
                      </div>
                    </div>

                    <div className="input-row-grid">
                      <div className="input-group">
                        <label>Danh xưng Chú Rể</label>
                        <select
                          value={data.groomRole}
                          onChange={(e) => setData({ ...data, groomRole: e.target.value })}
                        >
                          <option value="Trưởng Nam">Trưởng Nam</option>
                          <option value="Thứ Nam">Thứ Nam</option>
                          <option value="Út Nam">Út Nam</option>
                          <option value="Quý Nam">Quý Nam</option>
                        </select>
                      </div>
                      <div className="input-group">
                        <label>Danh xưng Cô Dâu</label>
                        <select
                          value={data.brideRole}
                          onChange={(e) => setData({ ...data, brideRole: e.target.value })}
                        >
                          <option value="Trưởng Nữ">Trưởng Nữ</option>
                          <option value="Thứ Nữ">Thứ Nữ</option>
                          <option value="Út Nữ">Út Nữ</option>
                          <option value="Quý Nữ">Quý Nữ</option>
                        </select>
                      </div>
                    </div>

                    {/* Segmented display order */}
                    <div className="segmented-order-section">
                      <label className="section-small-label">THỨ TỰ HIỂN THỊ</label>
                      <div className="segmented-switch">
                        <button
                          type="button"
                          className={`seg-btn ${data.displayOrder === "groom_first" ? "is-active" : ""}`}
                          onClick={() => setData({ ...data, displayOrder: "groom_first" })}
                        >
                          Nhà trai trước
                        </button>
                        <button
                          type="button"
                          className={`seg-btn ${data.displayOrder === "bride_first" ? "is-active" : ""}`}
                          onClick={() => setData({ ...data, displayOrder: "bride_first" })}
                        >
                          Nhà gái trước
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. ẢNH ĐẦU THIỆP */}
              <div className="cd-accordion-card">
                <div className="cd-card-header" onClick={() => toggleSection("hero")}>
                  <div className="card-header-title">
                    <span className="card-icon">🖼️</span>
                    <h3>Ảnh đầu thiệp</h3>
                  </div>
                  <div className="card-header-actions" onClick={(e) => e.stopPropagation()}>
                    <label className="toggle-switch-label">
                      <span>Hiện</span>
                      <input
                        type="checkbox"
                        checked={data.showHeroImage}
                        onChange={(e) => setData({ ...data, showHeroImage: e.target.checked })}
                      />
                      <span className="toggle-slider" />
                    </label>
                    <button type="button" className="btn-toggle-accordion" onClick={() => toggleSection("hero")} aria-expanded={openSections.hero} aria-label="Ảnh đầu thiệp">
                      {openSections.hero ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {openSections.hero && (
                  <div className="cd-card-body">
                    <div className="hero-arch-upload-wrapper">
                      <span className="arch-label">Ảnh đầu thiệp</span>
                      <div className="hero-arch-frame">
                        <img src={data.heroImage} alt="Ảnh đầu thiệp" />
                      </div>
                      <label className="btn-upload-arch">
                        <Upload size={14} />
                        <span>Tải lên</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="editor-upload-input"
                          aria-label="Tải ảnh đầu thiệp"
                          onChange={handleHeroUpload}
                        />
                      </label>
                      <span className="upload-note">
                        JPG, PNG, GIF, WebP, HEIC · Nên dùng ảnh dọc hoặc ảnh cặp đôi toàn thân
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. THÔNG TIN GIA ĐÌNH */}
              <div className="cd-accordion-card">
                <div className="cd-card-header" onClick={() => toggleSection("family")}>
                  <div className="card-header-title">
                    <span className="card-icon">👨‍👩‍👧‍👦</span>
                    <h3>Thông tin gia đình</h3>
                  </div>
                  <div className="card-header-actions" onClick={(e) => e.stopPropagation()}>
                    <label className="toggle-switch-label">
                      <span>Hiện</span>
                      <input
                        type="checkbox"
                        checked={data.showFamilyInfo}
                        onChange={(e) => setData({ ...data, showFamilyInfo: e.target.checked })}
                      />
                      <span className="toggle-slider" />
                    </label>
                    <button type="button" className="btn-toggle-accordion" onClick={() => toggleSection("family")} aria-expanded={openSections.family} aria-label="Thông tin gia đình">
                      {openSections.family ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {openSections.family && (
                  <div className="cd-card-body">
                    {/* Nhà trai */}
                    <div className="sub-family-block">
                      <h4 className="sub-family-title">Nhà trai</h4>
                      <div className="input-group">
                        <label>Danh xưng</label>
                        <input
                          type="text"
                          value={data.groomFamily.title}
                          onChange={(e) =>
                            setData({
                              ...data,
                              groomFamily: { ...data.groomFamily, title: e.target.value },
                            })
                          }
                          placeholder="Ông Bà"
                        />
                      </div>
                      <div className="input-row-grid">
                        <div className="input-group">
                          <label>Ông (Thân phụ)</label>
                          <input
                            type="text"
                            value={data.groomFamily.father}
                            onChange={(e) =>
                              setData({
                                ...data,
                                groomFamily: { ...data.groomFamily, father: e.target.value },
                              })
                            }
                            placeholder="VD: Lê Văn Lộc"
                          />
                        </div>
                        <div className="input-group">
                          <label>Bà (Thân mẫu)</label>
                          <input
                            type="text"
                            value={data.groomFamily.mother}
                            onChange={(e) =>
                              setData({
                                ...data,
                                groomFamily: { ...data.groomFamily, mother: e.target.value },
                              })
                            }
                            placeholder="VD: Hà Thị Kim Cương"
                          />
                        </div>
                      </div>
                      <div className="input-group">
                        <label>Địa chỉ nhà trai</label>
                        <textarea
                          rows={2}
                          value={data.groomFamily.address}
                          onChange={(e) =>
                            setData({
                              ...data,
                              groomFamily: { ...data.groomFamily, address: e.target.value },
                            })
                          }
                          placeholder="Địa chỉ nhà trai"
                        />
                      </div>
                    </div>

                    {/* Nhà gái */}
                    <div className="sub-family-block">
                      <h4 className="sub-family-title">Nhà gái</h4>
                      <div className="input-group">
                        <label>Danh xưng</label>
                        <input
                          type="text"
                          value={data.brideFamily.title}
                          onChange={(e) =>
                            setData({
                              ...data,
                              brideFamily: { ...data.brideFamily, title: e.target.value },
                            })
                          }
                          placeholder="Ông Bà"
                        />
                      </div>
                      <div className="input-row-grid">
                        <div className="input-group">
                          <label>Ông (Thân phụ)</label>
                          <input
                            type="text"
                            value={data.brideFamily.father}
                            onChange={(e) =>
                              setData({
                                ...data,
                                brideFamily: { ...data.brideFamily, father: e.target.value },
                              })
                            }
                            placeholder="VD: Trần Quang Hồ"
                          />
                        </div>
                        <div className="input-group">
                          <label>Bà (Thân mẫu)</label>
                          <input
                            type="text"
                            value={data.brideFamily.mother}
                            onChange={(e) =>
                              setData({
                                ...data,
                                brideFamily: { ...data.brideFamily, mother: e.target.value },
                              })
                            }
                            placeholder="VD: Trần Thị Phượng"
                          />
                        </div>
                      </div>
                      <div className="input-group">
                        <label>Địa chỉ nhà gái</label>
                        <textarea
                          rows={2}
                          value={data.brideFamily.address}
                          onChange={(e) =>
                            setData({
                              ...data,
                              brideFamily: { ...data.brideFamily, address: e.target.value },
                            })
                          }
                          placeholder="Địa chỉ nhà gái"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. LỜI THÔNG BÁO */}
              <div className="cd-accordion-card">
                <div className="cd-card-header" onClick={() => toggleSection("announcement")}>
                  <div className="card-header-title">
                    <span className="card-icon">📜</span>
                    <h3>Lời thông báo</h3>
                  </div>
                  <div className="card-header-actions" onClick={(e) => e.stopPropagation()}>
                    <label className="toggle-switch-label">
                      <span>Hiện</span>
                      <input
                        type="checkbox"
                        checked={data.showAnnouncement}
                        onChange={(e) => setData({ ...data, showAnnouncement: e.target.checked })}
                      />
                      <span className="toggle-slider" />
                    </label>
                    <button type="button" className="btn-toggle-accordion" onClick={() => toggleSection("announcement")} aria-expanded={openSections.announcement} aria-label="Lời thông báo">
                      {openSections.announcement ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {openSections.announcement && (
                  <div className="cd-card-body">
                    <div className="input-group">
                      <label>Câu thông báo (để trống nếu không muốn hiện)</label>
                      <textarea
                        rows={3}
                        value={data.announcementText}
                        onChange={(e) => setData({ ...data, announcementText: e.target.value })}
                        placeholder="TRÂN TRỌNG BÁO TIN LỄ THÀNH HÔN CỦA CON CHÚNG TÔI"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 5. LỄ CƯỚI */}
              <div className="cd-accordion-card">
                <div className="cd-card-header" onClick={() => toggleSection("ceremony")}>
                  <div className="card-header-title">
                    <span className="card-icon">⛩️</span>
                    <h3>Lễ</h3>
                  </div>
                  <div className="card-header-actions" onClick={(e) => e.stopPropagation()}>
                    <label className="toggle-switch-label">
                      <span>Hiện</span>
                      <input
                        type="checkbox"
                        checked={data.showCeremony}
                        onChange={(e) => setData({ ...data, showCeremony: e.target.checked })}
                      />
                      <span className="toggle-slider" />
                    </label>
                    <button type="button" className="btn-toggle-accordion" onClick={() => toggleSection("ceremony")} aria-expanded={openSections.ceremony} aria-label="Lễ cưới">
                      {openSections.ceremony ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {openSections.ceremony && (
                  <div className="cd-card-body">
                    <div className="input-group">
                      <label>Tiêu đề mục</label>
                      <input
                        type="text"
                        value={data.ceremonyTitle}
                        onChange={(e) => setData({ ...data, ceremonyTitle: e.target.value })}
                        placeholder="THÔNG TIN LỄ CƯỚI"
                      />
                      <span className="field-hint">
                        Tiêu đề in phía trên mục này trên thiệp Để trống nếu bạn muốn bỏ hẳn
                      </span>
                    </div>

                    <div className="info-alert-box">
                      <Sparkles size={14} />
                      <span>
                        Bạn có tổ chức lễ vu quy / lễ thành hôn tại nhà không? Nếu có, hãy bấm nút bên dưới để thêm lễ!
                      </span>
                    </div>

                    {/* Danh sách các lễ */}
                    <div className="ceremonies-list">
                      {data.ceremonies.map((cItem, cIdx) => (
                        <div key={cItem.id} className="ceremony-item-card">
                          <div className="item-card-top">
                            <strong>Lễ {cIdx + 1}: {cItem.name}</strong>
                            <button
                              type="button"
                              className="btn-remove-ceremony"
                              onClick={() => handleRemoveCeremony(cItem.id)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <div className="input-row-grid">
                            <input
                              type="text"
                              value={cItem.name}
                              onChange={(e) => {
                                const next = [...data.ceremonies];
                                next[cIdx].name = e.target.value;
                                setData({ ...data, ceremonies: next });
                              }}
                              placeholder="Tên lễ (VD: Lễ Vu Quy)"
                            />
                            <input
                              type="text"
                              value={cItem.time}
                              onChange={(e) => {
                                const next = [...data.ceremonies];
                                next[cIdx].time = e.target.value;
                                setData({ ...data, ceremonies: next });
                              }}
                              placeholder="Giờ (VD: 09:00)"
                            />
                          </div>
                          <input
                            type="text"
                            value={cItem.venue}
                            onChange={(e) => {
                              const next = [...data.ceremonies];
                              next[cIdx].venue = e.target.value;
                              setData({ ...data, ceremonies: next });
                            }}
                            placeholder="Địa điểm (VD: Tư gia nhà gái)"
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="btn-add-ceremony"
                      onClick={handleAddCeremony}
                    >
                      <Plus size={14} />
                      <span>Thêm lễ</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 6. TIỆC CƯỚI */}
              <div className="cd-accordion-card">
                <div className="cd-card-header" onClick={() => toggleSection("party")}>
                  <div className="card-header-title">
                    <span className="card-icon">🥂</span>
                    <h3>Tiệc cưới</h3>
                  </div>
                  <div className="card-header-actions" onClick={(e) => e.stopPropagation()}>
                    <label className="toggle-switch-label">
                      <span>Hiện</span>
                      <input
                        type="checkbox"
                        checked={data.showParty}
                        onChange={(e) => setData({ ...data, showParty: e.target.checked })}
                      />
                      <span className="toggle-slider" />
                    </label>
                    <button type="button" className="btn-toggle-accordion" onClick={() => toggleSection("party")} aria-expanded={openSections.party} aria-label="Tiệc cưới">
                      {openSections.party ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {openSections.party && (
                  <div className="cd-card-body">
                    {/* Tabs: Tiệc cưới | Tiệc báo hỷ | Tiệc đính hôn */}
                    <div className="segmented-switch party-tabs">
                      <button
                        type="button"
                        className={`seg-btn ${data.partyType === "wedding" ? "is-active" : ""}`}
                        onClick={() => setData({ ...data, partyType: "wedding", partyTitle: "THÔNG TIN TIỆC CƯỚI" })}
                      >
                        Tiệc cưới
                      </button>
                      <button
                        type="button"
                        className={`seg-btn ${data.partyType === "announcement" ? "is-active" : ""}`}
                        onClick={() => setData({ ...data, partyType: "announcement", partyTitle: "THÔNG TIN TIỆC BÁO HỶ" })}
                      >
                        Tiệc báo hỷ
                      </button>
                      <button
                        type="button"
                        className={`seg-btn ${data.partyType === "engagement" ? "is-active" : ""}`}
                        onClick={() => setData({ ...data, partyType: "engagement", partyTitle: "THÔNG TIN TIỆC ĐÍNH HÔN" })}
                      >
                        Tiệc đính hôn
                      </button>
                    </div>

                    <div className="input-group">
                      <label>Tiêu đề mục</label>
                      <input
                        type="text"
                        value={data.partyTitle}
                        onChange={(e) => setData({ ...data, partyTitle: e.target.value })}
                        placeholder="THÔNG TIN TIỆC CƯỚI"
                      />
                    </div>

                    <div className="input-row-grid">
                      <div className="input-group">
                        <label>Ngày tổ chức</label>
                        <input
                          type="date"
                          value={data.partyDate}
                          onChange={(e) => setData({ ...data, partyDate: e.target.value })}
                        />
                      </div>
                      <div className="input-group">
                        <label>Giờ tổ chức</label>
                        <input
                          type="time"
                          value={data.partyTime}
                          onChange={(e) => setData({ ...data, partyTime: e.target.value })}
                        />
                      </div>
                    </div>
                    <span className="field-hint">
                      Giờ chính hiển thị lớn trên thiệp, dùng cho đếm ngược và thêm vào lịch
                    </span>

                    <div className="segmented-order-section">
                      <label className="section-small-label">ĐỊNH DẠNG GIỜ</label>
                      <div className="segmented-switch">
                        <button
                          type="button"
                          className={`seg-btn ${data.timeFormat === "24h" ? "is-active" : ""}`}
                          onClick={() => setData({ ...data, timeFormat: "24h" })}
                        >
                          24 giờ
                        </button>
                        <button
                          type="button"
                          className={`seg-btn ${data.timeFormat === "12h" ? "is-active" : ""}`}
                          onClick={() => setData({ ...data, timeFormat: "12h" })}
                        >
                          Sáng / Chiều
                        </button>
                      </div>
                    </div>

                    {/* Giờ đón khách & Khai tiệc */}
                    <div className="toggle-row-between">
                      <div>
                        <strong>Giờ Đón khách & Khai tiệc</strong>
                        <p>Bật để thêm giờ đón khách và khai tiệc cụ thể</p>
                      </div>
                      <label className="toggle-switch-label">
                        <input
                          type="checkbox"
                          checked={data.showGuestTime}
                          onChange={(e) => setData({ ...data, showGuestTime: e.target.checked })}
                        />
                        <span className="toggle-slider" />
                      </label>
                    </div>

                    {data.showGuestTime && (
                      <div className="input-row-grid">
                        <div className="input-group">
                          <label>Đón khách lúc</label>
                          <input
                            type="text"
                            value={data.guestWelcomeTime}
                            onChange={(e) => setData({ ...data, guestWelcomeTime: e.target.value })}
                            placeholder="11:00"
                          />
                        </div>
                        <div className="input-group">
                          <label>Khai tiệc lúc</label>
                          <input
                            type="text"
                            value={data.partyStartTime}
                            onChange={(e) => setData({ ...data, partyStartTime: e.target.value })}
                            placeholder="11:30"
                          />
                        </div>
                      </div>
                    )}

                    {/* Đồng hồ đếm ngược */}
                    <div className="toggle-row-between">
                      <div>
                        <strong>Đồng hồ đếm ngược</strong>
                        <p>Hiển thị số ngày, giờ, phút, giây đếm ngược</p>
                      </div>
                      <label className="toggle-switch-label">
                        <input
                          type="checkbox"
                          checked={data.showCountdown}
                          onChange={(e) => setData({ ...data, showCountdown: e.target.checked })}
                        />
                        <span className="toggle-slider" />
                      </label>
                    </div>

                    {/* Địa điểm */}
                    <div className="input-group">
                      <label>Tiêu đề mục địa điểm</label>
                      <input
                        type="text"
                        value={data.venueTitle}
                        onChange={(e) => setData({ ...data, venueTitle: e.target.value })}
                        placeholder="Tiệc cưới sẽ tổ chức tại"
                      />
                    </div>

                    <div className="input-group">
                      <label>Tên địa điểm / Sảnh tiệc</label>
                      <input
                        type="text"
                        value={data.venueName}
                        onChange={(e) => setData({ ...data, venueName: e.target.value })}
                        placeholder="Tư gia nhà gái hoặc The Grand Palace"
                      />
                    </div>

                    <div className="input-group">
                      <label>Địa chỉ chi tiết</label>
                      <textarea
                        rows={2}
                        value={data.venueAddress}
                        onChange={(e) => setData({ ...data, venueAddress: e.target.value })}
                        placeholder="Địa chỉ chi tiết để khách dễ tìm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 7. THƯ VIỆN ẢNH */}
              <div className="cd-accordion-card">
                <div className="cd-card-header" onClick={() => toggleSection("gallery")}>
                  <div className="card-header-title">
                    <span className="card-icon">📸</span>
                    <h3>Thư viện ảnh</h3>
                  </div>
                  <div className="card-header-actions" onClick={(e) => e.stopPropagation()}>
                    <label className="toggle-switch-label">
                      <span>Hiện</span>
                      <input
                        type="checkbox"
                        checked={data.showGallery}
                        onChange={(e) => setData({ ...data, showGallery: e.target.checked })}
                      />
                      <span className="toggle-slider" />
                    </label>
                    <button type="button" className="btn-toggle-accordion" onClick={() => toggleSection("gallery")} aria-expanded={openSections.gallery} aria-label="Thư viện ảnh">
                      {openSections.gallery ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {openSections.gallery && (
                  <div className="cd-card-body">
                    <div className="segmented-order-section">
                      <label className="section-small-label">KIỂU HIỂN THỊ</label>
                      <div className="segmented-switch">
                        <button
                          type="button"
                          className={`seg-btn ${data.galleryLayout === "grid" ? "is-active" : ""}`}
                          onClick={() => setData({ ...data, galleryLayout: "grid" })}
                        >
                          Lưới
                        </button>
                        <button
                          type="button"
                          className={`seg-btn ${data.galleryLayout === "collage" ? "is-active" : ""}`}
                          onClick={() => setData({ ...data, galleryLayout: "collage" })}
                        >
                          Ghép ảnh
                        </button>
                        <button
                          type="button"
                          className={`seg-btn ${data.galleryLayout === "carousel" ? "is-active" : ""}`}
                          onClick={() => setData({ ...data, galleryLayout: "carousel" })}
                        >
                          3D
                        </button>
                      </div>
                    </div>

                    <div className="gallery-thumbs-grid">
                      {data.galleryPhotos.map((photoUrl, pIdx) => (
                        <div key={pIdx} className="gallery-thumb-slot">
                          <img src={photoUrl} alt={`Ảnh ${pIdx + 1}`} />
                          <button
                            type="button"
                            className="btn-remove-photo"
                            onClick={() => handleRemoveGalleryPhoto(pIdx)}
                            title="Xóa ảnh này"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}

                      {/* Add photo slot */}
                      <label className="gallery-add-slot">
                        <Plus size={20} />
                        <span>Thêm ảnh</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="editor-upload-input"
                          aria-label="Thêm ảnh vào thư viện"
                          onChange={handleAddGalleryPhoto}
                        />
                      </label>
                    </div>

                    <span className="upload-note">
                      Hỗ trợ JPG, PNG, GIF, WebP, HEIC · Tối đa {data.packageType === "premium" ? "30 ảnh" : "10 ảnh"}
                    </span>
                  </div>
                )}
              </div>

              {/* ========================================================= */}
              {/* 8. CÂU HỎI THÊM CHO KHÁCH MỜI (MỚI THEO SCREENSHOT 1)      */}
              {/* ========================================================= */}
              <div className="cd-accordion-card">
                <div className="cd-card-header" onClick={() => toggleSection("rsvpQuestions")}>
                  <div className="card-header-title">
                    <span className="card-icon">❓</span>
                    <h3>CÂU HỎI THÊM CHO KHÁCH MỜI</h3>
                  </div>
                  <div className="card-header-actions" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="btn-toggle-accordion" onClick={() => toggleSection("rsvpQuestions")} aria-expanded={openSections.rsvpQuestions} aria-label="Câu hỏi khách mời">
                      {openSections.rsvpQuestions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {openSections.rsvpQuestions && (
                  <div className="cd-card-body">
                    <p className="card-subtitle-note">
                      Khách trả lời khi xác nhận tham dự trên thiệp
                    </p>

                    {/* Danh sách câu hỏi */}
                    {data.rsvpQuestions.length > 0 && (
                      <div className="rsvp-questions-list">
                        {data.rsvpQuestions.map((q, idx) => (
                          <div key={q.id} className="rsvp-question-card">
                            <div className="item-card-top">
                              <span className="q-badge">Câu {idx + 1}</span>
                              <strong className="q-title">{q.question}</strong>
                              <button
                                type="button"
                                className="btn-remove-item"
                                onClick={() => handleRemoveQuestion(q.id)}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                            <div className="q-preview-answers">
                              {q.options && q.options.length > 0 ? (
                                <div className="q-options-row">
                                  {q.options.map((opt, oIdx) => (
                                    <span key={oIdx} className="q-option-pill">
                                      ○ {opt}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="q-text-hint">Khách nhập văn bản tự do</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      className="btn-add-action-pill"
                      onClick={() => setIsQuestionModalOpen(true)}
                    >
                      <Plus size={14} />
                      <span>Thêm câu hỏi</span>
                    </button>
                  </div>
                )}
              </div>

              {/* ========================================================= */}
              {/* 9. DRESS CODE (MỚI THEO SCREENSHOT 1)                      */}
              {/* ========================================================= */}
              <div className="cd-accordion-card">
                <div className="cd-card-header" onClick={() => toggleSection("dressCode")}>
                  <div className="card-header-title">
                    <span className="card-icon">👗</span>
                    <h3>Dress Code</h3>
                  </div>
                  <div className="card-header-actions" onClick={(e) => e.stopPropagation()}>
                    <label className="toggle-switch-label">
                      <span>{data.showDressCode ? "Hiện" : "Ẩn"}</span>
                      <input
                        type="checkbox"
                        checked={data.showDressCode}
                        onChange={(e) => setData({ ...data, showDressCode: e.target.checked })}
                      />
                      <span className="toggle-slider" />
                    </label>
                    <button type="button" className="btn-toggle-accordion" onClick={() => toggleSection("dressCode")} aria-expanded={openSections.dressCode} aria-label="Dress Code">
                      {openSections.dressCode ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {openSections.dressCode && (
                  <div className="cd-card-body">
                    <div className="info-alert-box">
                      <Sparkles size={14} />
                      <span>
                        Bật để gợi ý trang phục cho khách mời theo màu sắc chủ đạo của tiệc cưới
                      </span>
                    </div>

                    {data.showDressCode && (
                      <div className="dress-code-body-fields">
                        <p className="section-small-label">150 MÀU TRANG PHỤC · CÓ THỂ CHỌN NHIỀU MÀU</p>
                        <div className="dress-color-filters">
                          <div className="input-group">
                            <label htmlFor="dress-color-search">Tìm tên màu hoặc mã HEX</label>
                            <input id="dress-color-search" type="search" value={dressColorSearch} onChange={(event) => setDressColorSearch(event.target.value)} placeholder="Ví dụ: hồng, xanh sage, #FFFFFF" />
                          </div>
                          <div className="input-group">
                            <label htmlFor="dress-color-family">Nhóm màu</label>
                            <select id="dress-color-family" value={dressColorFamily} onChange={(event) => setDressColorFamily(event.target.value)}>
                              <option value="">Tất cả nhóm màu</option>
                              {DRESS_COLOR_FAMILIES.map((family) => <option key={family} value={family}>{family}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="dress-selected-colors">
                          <p className="dress-color-count" aria-live="polite">Đã chọn {selectedDressColors.length} màu</p>
                          {selectedDressColors.length > 0 ? (
                            <div className="dress-selected-chips">
                              {selectedDressColors.map((color) => (
                                <button key={color.hex} type="button" className="dress-selected-chip" onClick={() => toggleDressColor(color.hex)} aria-label={`Bỏ chọn màu ${color.name}`}>
                                  <span className="dress-chip-dot" style={{ backgroundColor: color.hex }} />
                                  <span>{color.name}</span><X size={12} aria-hidden="true" />
                                </button>
                              ))}
                            </div>
                          ) : <p className="dress-color-empty">Chọn màu bên dưới để hiển thị trên thiệp</p>}
                        </div>
                        <p className="dress-color-count">Hiển thị {filteredDressColors.length} / {data.dressCodeColors.length} màu</p>
                        <div className="dress-code-palette-grid" role="group" aria-label="Chọn màu trang phục">
                          {filteredDressColors.map((color) => (
                            <button
                              key={color.hex}
                              type="button"
                              className={`color-swatch-item ${color.selected ? "is-selected" : ""}`}
                              onClick={() => toggleDressColor(color.hex)}
                              aria-pressed={color.selected}
                              title={`${color.name} · ${color.hex}`}
                            >
                              <span
                                className="swatch-circle"
                                style={{
                                  backgroundColor: color.hex,
                                  border: "1px solid rgba(56, 39, 33, 0.15)",
                                }}
                              >
                                {color.selected && <Check size={12} color={swatchCheckColor(color.hex)} aria-hidden="true" />}
                              </span>
                              <span className="swatch-label">{color.name}</span>
                            </button>
                          ))}
                        </div>
                        {filteredDressColors.length === 0 && (
                          <div className="dress-color-empty">
                            <p>Không tìm thấy màu phù hợp</p>
                            <button type="button" className="dress-reset-filters" onClick={() => { setDressColorSearch(""); setDressColorFamily(""); }}>Xem tất cả 150 màu</button>
                          </div>
                        )}

                        <div className="input-group" style={{ marginTop: "12px" }}>
                          <label>Gợi ý trang phục cho khách</label>
                          <textarea
                            rows={2}
                            value={data.dressCodeDescription}
                            onChange={(e) => setData({ ...data, dressCodeDescription: e.target.value })}
                            placeholder="Gợi ý màu sắc và phong cách ăn mặc cho khách mời"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ========================================================= */}
              {/* 10. LỊCH TRÌNH NGÀY CƯỚI (MỚI THEO SCREENSHOT 1)           */}
              {/* ========================================================= */}
              <div className="cd-accordion-card">
                <div className="cd-card-header" onClick={() => toggleSection("timeline")}>
                  <div className="card-header-title">
                    <span className="card-icon">📋</span>
                    <h3>Lịch trình ngày cưới</h3>
                  </div>
                  <div className="card-header-actions" onClick={(e) => e.stopPropagation()}>
                    <label className="toggle-switch-label">
                      <span>{data.showTimeline ? "Hiện" : "Ẩn"}</span>
                      <input
                        type="checkbox"
                        checked={data.showTimeline}
                        onChange={(e) => setData({ ...data, showTimeline: e.target.checked })}
                      />
                      <span className="toggle-slider" />
                    </label>
                    <button type="button" className="btn-toggle-accordion" onClick={() => toggleSection("timeline")} aria-expanded={openSections.timeline} aria-label="Lịch trình ngày cưới">
                      {openSections.timeline ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {openSections.timeline && (
                  <div className="cd-card-body">
                    <div className="info-alert-box">
                      <Sparkles size={14} />
                      <span>
                        Bật để hiển thị lịch trình các hoạt động trong ngày cưới (đón khách, lễ gia tiên, khai tiệc) cho khách dễ theo dõi
                      </span>
                    </div>

                    {data.showTimeline && (
                      <div className="timeline-items-wrapper">
                        {data.timelineItems.map((item, tIdx) => (
                          <div key={item.id} className="timeline-item-card">
                            <div className="timeline-time-badge">{item.time}</div>
                            <div className="timeline-content">
                              <strong>{item.title}</strong>
                              {item.description && <p>{item.description}</p>}
                            </div>
                            <button
                              type="button"
                              className="btn-remove-item"
                              onClick={() => handleRemoveTimeline(item.id)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          className="btn-add-action-pill"
                          onClick={() => setIsTimelineModalOpen(true)}
                        >
                          <Plus size={14} />
                          <span>Thêm hoạt động</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ========================================================= */}
              {/* 11. SỔ LƯU BÚT (MỚI THEO SCREENSHOT 1)                     */}
              {/* ========================================================= */}
              <div className="cd-accordion-card">
                <div className="cd-card-header" onClick={() => toggleSection("guestbook")}>
                  <div className="card-header-title">
                    <span className="card-icon">📖</span>
                    <h3>Sổ lưu bút</h3>
                  </div>
                  <div className="card-header-actions" onClick={(e) => e.stopPropagation()}>
                    <label className="toggle-switch-label">
                      <span>{data.showGuestbook ? "Hiện" : "Ẩn"}</span>
                      <input
                        type="checkbox"
                        checked={data.showGuestbook}
                        onChange={(e) => setData({ ...data, showGuestbook: e.target.checked })}
                      />
                      <span className="toggle-slider" />
                    </label>
                    <button type="button" className="btn-toggle-accordion" onClick={() => toggleSection("guestbook")} aria-expanded={openSections.guestbook} aria-label="Sổ lưu bút">
                      {openSections.guestbook ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {openSections.guestbook && (
                  <div className="cd-card-body">
                    <div
                      className="guestbook-counter-row"
                      onClick={() => setIsWishesModalOpen(true)}
                    >
                      <div className="counter-left">
                        <MessageSquare size={16} className="bubble-icon" />
                        <div>
                          <strong>{data.guestbookWishes.length} lời chúc</strong>
                          <span>Xem và quản lý</span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="chevron-icon" />
                    </div>
                  </div>
                )}
              </div>

              {/* ========================================================= */}
              {/* 12. HỘP QUÀ MỪNG (THEO SCREENSHOT 1 & 2)                  */}
              {/* ========================================================= */}
              <div className="cd-accordion-card">
                <div className="cd-card-header" onClick={() => toggleSection("gift")}>
                  <div className="card-header-title">
                    <span className="card-icon">🎁</span>
                    <h3>Hộp Quà Mừng</h3>
                  </div>
                  <div className="card-header-actions" onClick={(e) => e.stopPropagation()}>
                    <label className="toggle-switch-label">
                      <span>{data.showGiftBox ? "Hiện" : "Ẩn"}</span>
                      <input
                        type="checkbox"
                        checked={data.showGiftBox}
                        onChange={(e) => setData({ ...data, showGiftBox: e.target.checked })}
                      />
                      <span className="toggle-slider" />
                    </label>
                    <button type="button" className="btn-toggle-accordion" onClick={() => toggleSection("gift")} aria-expanded={openSections.gift} aria-label="Hộp quà mừng">
                      {openSections.gift ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {openSections.gift && (
                  <div className="cd-card-body">
                    {data.bankAccounts.length === 0 ? (
                      <div className="empty-box-state">
                        <p>Chưa có phương thức nào Nhấn nút bên dưới để thêm</p>
                      </div>
                    ) : (
                      <div className="bank-accounts-list">
                        {data.bankAccounts.map((b) => (
                          <div key={b.id} className="bank-account-item-card">
                            <div className="bank-item-info">
                              <span className="bank-target-tag">
                                {b.target === "groom" ? "Mừng Chú Rể" : b.target === "bride" ? "Mừng Cô Dâu" : "Mừng Hai Bạn"}
                              </span>
                              <h4>{b.bankName} - {b.accountNumber}</h4>
                              <p>{b.accountHolder}</p>
                            </div>
                            <button
                              type="button"
                              className="btn-remove-item"
                              onClick={() => handleRemoveBankAccount(b.id)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      className="btn-add-action-pill"
                      onClick={() => setIsBankModalOpen(true)}
                    >
                      <Plus size={14} />
                      <span>Thêm tài khoản ngân hàng</span>
                    </button>

                    <div className="other-payment-link-wrap">
                      <button
                        type="button"
                        className="link-other-method"
                        onClick={() => {
                          const note = prompt("Nhập phương thức mừng khác (VD: Ví MoMo / ZaloPay / Tiền mặt):", data.otherPaymentNote);
                          if (note !== null) setData({ ...data, otherPaymentNote: note });
                        }}
                      >
                        Phương thức khác
                      </button>
                      {data.otherPaymentNote && (
                        <span className="other-payment-val">({data.otherPaymentNote})</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* ========================================================= */}
              {/* 13. LỜI CẢM ƠN (MỚI THEO SCREENSHOT 2)                    */}
              {/* ========================================================= */}
              <div className="cd-accordion-card">
                <div className="cd-card-header" onClick={() => toggleSection("thankYou")}>
                  <div className="card-header-title">
                    <span className="card-icon">💌</span>
                    <h3>Lời cảm ơn</h3>
                  </div>
                  <div className="card-header-actions" onClick={(e) => e.stopPropagation()}>
                    <label className="toggle-switch-label">
                      <span>{data.showThankYou ? "Hiện" : "Ẩn"}</span>
                      <input
                        type="checkbox"
                        checked={data.showThankYou}
                        onChange={(e) => setData({ ...data, showThankYou: e.target.checked })}
                      />
                      <span className="toggle-slider" />
                    </label>
                    <button type="button" className="btn-toggle-accordion" onClick={() => toggleSection("thankYou")} aria-expanded={openSections.thankYou} aria-label="Lời cảm ơn">
                      {openSections.thankYou ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {openSections.thankYou && (
                  <div className="cd-card-body">
                    <div className="input-group">
                      <label>Lời cảm ơn</label>
                      <textarea
                        rows={3}
                        value={data.thankYouMessage}
                        onChange={(e) => setData({ ...data, thankYouMessage: e.target.value })}
                        placeholder="Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng tôi!"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ========================================================= */}
              {/* 14. NHẠC NỀN (MỚI THEO SCREENSHOT 2)                      */}
              {/* ========================================================= */}
              <div className="cd-accordion-card">
                <div className="cd-card-header" onClick={() => toggleSection("music")}>
                  <div className="card-header-title">
                    <span className="card-icon">🎵</span>
                    <h3>Nhạc nền</h3>
                  </div>
                  <div className="card-header-actions" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="btn-toggle-accordion" onClick={() => toggleSection("music")} aria-expanded={openSections.music} aria-label="Nhạc nền">
                      {openSections.music ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {openSections.music && (
                  <div className="cd-card-body">
                    <div className="music-selector-block-chungdoi">
                      <div className="music-disc-icon-circle">
                        <Disc size={34} className={isPlayingMusic ? "spinning-disc" : ""} />
                      </div>
                      <span className="music-status-text">
                        {data.musicTrackTitle ? data.musicTrackTitle : "Chưa chọn nhạc nền"}
                      </span>
                      <button
                        type="button"
                        className="btn-pink-choose-music"
                        onClick={() => setIsMusicModalOpen(true)}
                      >
                        <Music size={14} />
                        <span>Chọn nhạc</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ========================================================= */}
              {/* 15. PHONG BÌ (MỚI THEO SCREENSHOT 3)                      */}
              {/* ========================================================= */}
              <div className="cd-accordion-card">
                <div className="cd-card-header" onClick={() => toggleSection("envelope")}>
                  <div className="card-header-title">
                    <span className="card-icon">✉️</span>
                    <h3>Phong bì</h3>
                  </div>
                  <div className="card-header-actions" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="btn-toggle-accordion" onClick={() => toggleSection("envelope")} aria-expanded={openSections.envelope} aria-label="Phong bì">
                      {openSections.envelope ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {openSections.envelope && (
                  <div className="cd-card-body">
                    <div className="input-group">
                      <label>Lời mời</label>
                      <input
                        type="text"
                        value={data.envelopeGreeting}
                        onChange={(e) => setData({ ...data, envelopeGreeting: e.target.value })}
                        placeholder="Thân Mời"
                      />
                    </div>
                    <p className="card-subtitle-note">
                      Áp dụng cho tất cả khách Để thay đổi riêng từng khách, chỉnh trong phần Quản lý khách mời
                    </p>
                  </div>
                )}
              </div>

              {/* ========================================================= */}
              {/* 16. ẢNH XEM TRƯỚC KHI CHIA SẺ (MỚI THEO SCREENSHOT 3)     */}
              {/* ========================================================= */}
              <div className="cd-accordion-card">
                <div className="cd-card-header" onClick={() => toggleSection("sharePreview")}>
                  <div className="card-header-title">
                    <span className="card-icon">🖼️</span>
                    <h3>Ảnh xem trước khi chia sẻ</h3>
                  </div>
                  <div className="card-header-actions" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="btn-toggle-accordion" onClick={() => toggleSection("sharePreview")} aria-expanded={openSections.sharePreview} aria-label="Ảnh khi chia sẻ">
                      {openSections.sharePreview ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {openSections.sharePreview && (
                  <div className="cd-card-body">
                    <p className="card-subtitle-note">
                      Ảnh hiển thị khi bạn gửi link thiệp qua Zalo, Facebook, Messenger Chọn 1 trong 2 kiểu bên dưới
                    </p>

                    {/* Segmented switch: Phong bì thiệp vs Ảnh của bạn */}
                    <div className="segmented-switch share-tabs">
                      <button
                        type="button"
                        className={`seg-btn ${data.sharePreviewType === "envelope" ? "is-active" : ""}`}
                        onClick={() => setData({ ...data, sharePreviewType: "envelope" })}
                      >
                        Phong bì thiệp
                      </button>
                      <button
                        type="button"
                        className={`seg-btn ${data.sharePreviewType === "photo" ? "is-active" : ""}`}
                        onClick={() => setData({ ...data, sharePreviewType: "photo" })}
                      >
                        Ảnh của bạn
                      </button>
                    </div>

                    <p className="field-hint">
                      {data.sharePreviewType === "envelope"
                        ? "Phong bì thiệp của bạn Với link mời riêng, ảnh sẽ hiện tên khách được mời"
                        : "Ảnh cưới đại diện của bạn sẽ hiển thị khi chia sẻ link"}
                    </p>

                    {/* REALISTIC SOCIAL SHARE CARD PREVIEW */}
                    <div className="share-og-card-preview-wrapper">
                      <span className="preview-mini-kicker">XEM TRƯỚC</span>
                      <div className="social-og-card">
                        {data.sharePreviewType === "envelope" ? (
                          <div className="og-envelope-graphic">
                            <div className="envelope-watermark-left">囍</div>
                            <div className="envelope-watermark-right">囍</div>
                            <div className="envelope-wax-ribbon">
                              <span className="envelope-stamp-circle">✦</span>
                            </div>
                            <h2 className="envelope-title-main">Thiệp Cưới</h2>
                            <p className="envelope-couple-names">{firstPerson} & {secondPerson}</p>
                          </div>
                        ) : (
                          <div className="og-photo-graphic">
                            <img src={data.heroImage} alt="Ảnh cưới" />
                            <div className="og-photo-overlay">
                              <h2>Thiệp Cưới</h2>
                              <p>{firstPerson} & {secondPerson}</p>
                            </div>
                          </div>
                        )}

                        <div className="og-link-meta-footer">
                          <span className="og-domain">KISMETLOVE.VN</span>
                          <strong className="og-title">{data.groomShortName} & {data.brideShortName}</strong>
                          <p className="og-desc">
                            {data.envelopeGreeting} quý khách đến dự lễ cưới của {data.groomShortName} & {data.brideShortName}
                          </p>
                        </div>
                      </div>

                      <p className="cache-warning-note">
                        Zalo và Facebook lưu tạm ảnh xem trước, nên ảnh có thể chưa cập nhật ngay sau khi bạn chỉnh sửa Nếu cần làm mới, xem hướng dẫn xóa cache
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        )}

        {/* ================================================================= */}
        {/* RIGHT COLUMN: LIVE CANVAS PREVIEW (Shown in "preview" or "split")  */}
        {/* ================================================================= */}
        {(activeTab === "preview" || activeTab === "split") && (
          <main className="editor-live-preview-viewport">
            {/* Viewport Top Bar */}
            <div className="viewport-controls-bar">
              <div className="viewport-title-tag">
                <span>Trực quan thời gian thực</span>
                <strong>
                  {data.packageType === "premium" ? "Gói 800k" : "Gói 500k (Minimal Ivory)"}
                </strong>
              </div>

              {/* Device Selector */}
              <div className="viewport-device-switcher">
                <button
                  type="button"
                  className={`v-dev-btn ${previewDevice === "mobile" ? "is-active" : ""}`}
                  onClick={() => setPreviewDevice("mobile")}
                  title="Xem giao diện Điện thoại"
                >
                  <Smartphone size={15} />
                  <span>Điện thoại</span>
                </button>
                <button
                  type="button"
                  className={`v-dev-btn ${previewDevice === "desktop" ? "is-active" : ""}`}
                  onClick={() => setPreviewDevice("desktop")}
                  title="Xem giao diện Máy tính"
                >
                  <Monitor size={15} />
                  <span>Máy tính</span>
                </button>
              </div>

              {/* Audio toggle */}
              <button
                type="button"
                className={`viewport-audio-btn ${isPlayingMusic ? "is-active" : ""}`}
                onClick={toggleMusic}
                title="Bật/Tắt nhạc nền"
              >
                {isPlayingMusic ? <Volume2 size={15} /> : <VolumeX size={15} />}
              </button>
            </div>

            {/* Device Frame */}
            <div className="preview-canvas-scroller">
              {previewDevice === "mobile" ? (
                <div className="chungdoi-iphone-shell">
                  {/* Dynamic Island / Hardware notch */}
                  <div className="iphone-island">
                    <span className="island-camera" />
                  </div>

                  {/* Scrollable Screen */}
                  <div className="iphone-screen-scroll">
                    <LiveTemplateDocument
                      data={data}
                      monogram={monogram}
                      formattedDate={formattedPartyDate}
                      firstPerson={firstPerson}
                      secondPerson={secondPerson}
                      firstRole={firstRole}
                      secondRole={secondRole}
                      isPlayingMusic={isPlayingMusic}
                      toggleMusic={toggleMusic}
                      onAddWish={handleAddLiveWish}
                    />
                  </div>

                  <div className="iphone-bottom-bar" />
                </div>
              ) : (
                <div className="chungdoi-desktop-shell">
                  <div className="desktop-top-header">
                    <div className="browser-circles">
                      <span className="bc-red" />
                      <span className="bc-yellow" />
                      <span className="bc-green" />
                    </div>
                    <div className="browser-url-input">
                      <span>🔒 kismetlove.me/thiep/{data.groomShortName.toLowerCase()}-{data.brideShortName.toLowerCase()}</span>
                    </div>
                  </div>

                  <div className="desktop-screen-scroll">
                    <LiveTemplateDocument
                      data={data}
                      monogram={monogram}
                      formattedDate={formattedPartyDate}
                      firstPerson={firstPerson}
                      secondPerson={secondPerson}
                      firstRole={firstRole}
                      secondRole={secondRole}
                      isPlayingMusic={isPlayingMusic}
                      toggleMusic={toggleMusic}
                      onAddWish={handleAddLiveWish}
                    />
                  </div>
                </div>
              )}
            </div>
          </main>
        )}
      </div>

      {/* ================================================================= */}
      {/* MODAL 1: CHỌN NHẠC NỀN                                            */}
      {/* ================================================================= */}
      {isMusicModalOpen && (
        <CustomizerModal title="Chọn nhạc nền" className="customizer-dialog-wrapper" onClose={() => setIsMusicModalOpen(false)}>
          <div className="modal-inner-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-top">
              <div className="modal-badge">
                <Music size={14} />
                <span>KHO NHẠC NỀN ĐÁM CƯỚI LÃNG MẠN</span>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setIsMusicModalOpen(false)}
              >
                <X size={16} />
              </button>
            </div>
            <div className="modal-content-list">
              {WEDDING_SONGS.map((song) => (
                <div key={song.id} className="song-select-row" data-song-id={song.id}>
                  <div className="song-info">
                    <strong>{song.title}</strong>
                    <span>{song.artist}</span>
                  </div>
                  <button
                    type="button"
                    className="btn-select-song"
                    aria-label={`Áp dụng bài ${song.title}`}
                    onClick={() => handleSelectMusicTrack(song)}
                  >
                    <span>Áp dụng</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </CustomizerModal>
      )}

      {/* ================================================================= */}
     {/* MODAL 2: THÊM TÀI KHOẢN NGÂN HÀNG                                 */}
      {/* ================================================================= */}
      {isBankModalOpen && (
        <CustomizerModal title="Thêm tài khoản mừng cưới" className="customizer-dialog-wrapper" onClose={() => setIsBankModalOpen(false)}>
          <div className="modal-inner-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-top">
              <div className="modal-badge">
                <Gift size={14} />
                <span>THÊM TÀI KHOẢN MỪNG CƯỚI</span>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setIsBankModalOpen(false)}
              >
                <X size={16} />
              </button>
            </div>
            <div className="modal-form-body">
              <div className="input-group">
                <label>Tài khoản dành cho</label>
                <select
                  value={tempBankTarget}
                  onChange={(e) => setTempBankTarget(e.target.value as any)}
                >
                  <option value="groom">Mừng Chú Rể (Nhà trai)</option>
                  <option value="bride">Mừng Cô Dâu (Nhà gái)</option>
                  <option value="both">Mừng Chung Hai Bạn</option>
                </select>
              </div>

              <div className="input-group">
                <label>Tên Ngân Hàng</label>
                <input
                  type="text"
                  value={tempBankName}
                  onChange={(e) => setTempBankName(e.target.value)}
                  placeholder="MB Bank, Vietcombank, Techcombank"
                />
              </div>

              <div className="input-group">
                <label>Số Tài Khoản</label>
                <input
                  type="text"
                  value={tempBankAccount}
                  onChange={(e) => setTempBankAccount(e.target.value)}
                  placeholder="0827274387"
                />
              </div>

              <div className="input-group">
                <label>Tên Chủ Tài Khoản (In hoa không dấu)</label>
                <input
                  type="text"
                  value={tempBankHolder}
                  onChange={(e) => setTempBankHolder(e.target.value)}
                  placeholder="LE VAN TAI"
                />
              </div>

              <button
                type="button"
                className="btn-modal-submit-main"
                onClick={handleAddBankSubmit}
              >
                Xác nhận thêm tài khoản
              </button>
            </div>
          </div>
        </CustomizerModal>
      )}

      {/* ================================================================= */}
     {/* MODAL 3: THÊM CÂU HỎI KHÁCH MỜI                                   */}
      {/* ================================================================= */}
      {isQuestionModalOpen && (
        <CustomizerModal title="Thêm câu hỏi khách mời" className="customizer-dialog-wrapper" onClose={() => setIsQuestionModalOpen(false)}>
          <div className="modal-inner-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-top">
              <div className="modal-badge">
                <HelpCircle size={14} />
                <span>THÊM CÂU HỎI KHẢO SÁT RSVP</span>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setIsQuestionModalOpen(false)}
              >
                <X size={16} />
              </button>
            </div>
            <div className="modal-form-body">
              <div className="input-group">
                <label>Nội dung câu hỏi</label>
                <input
                  type="text"
                  value={tempQuestionText}
                  onChange={(e) => setTempQuestionText(e.target.value)}
                  placeholder="VD: Bạn có tham gia xe đưa đón của gia đình không?"
                />
              </div>

              <div className="input-group">
                <label>Hình thức trả lời</label>
                <select
                  value={tempQuestionType}
                  onChange={(e) => setTempQuestionType(e.target.value as any)}
                >
                  <option value="radio">Chọn phương án (Trắc nghiệm)</option>
                  <option value="text">Nhập câu trả lời tự do</option>
                </select>
              </div>

              {tempQuestionType === "radio" && (
                <div className="input-group">
                  <label>Các lựa chọn (ngăn cách bằng dấu phẩy)</label>
                  <input
                    type="text"
                    value={tempQuestionOptions}
                    onChange={(e) => setTempQuestionOptions(e.target.value)}
                    placeholder="Có, Không, Chưa chắc chắn"
                  />
                </div>
              )}

              <button
                type="button"
                className="btn-modal-submit-main"
                onClick={handleAddQuestionSubmit}
              >
                Thêm câu hỏi
              </button>
            </div>
          </div>
        </CustomizerModal>
      )}

      {/* ================================================================= */}
     {/* MODAL 4: THÊM HOẠT ĐỘNG LỊCH TRÌNH                                */}
      {/* ================================================================= */}
      {isTimelineModalOpen && (
        <CustomizerModal title="Thêm hoạt động trong ngày cưới" className="customizer-dialog-wrapper" onClose={() => setIsTimelineModalOpen(false)}>
          <div className="modal-inner-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-top">
              <div className="modal-badge">
                <Clock size={14} />
                <span>THÊM HOẠT ĐỘNG TRONG NGÀY CƯỚI</span>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setIsTimelineModalOpen(false)}
              >
                <X size={16} />
              </button>
            </div>
            <div className="modal-form-body">
              <div className="input-group">
                <label>Thời gian</label>
                <input
                  type="text"
                  value={tempTimelineTime}
                  onChange={(e) => setTempTimelineTime(e.target.value)}
                  placeholder="11:00 hoặc 11:30"
                />
              </div>

              <div className="input-group">
                <label>Tên hoạt động</label>
                <input
                  type="text"
                  value={tempTimelineTitle}
                  onChange={(e) => setTempTimelineTitle(e.target.value)}
                  placeholder="VD: Đón khách & Chụp ảnh check-in"
                />
              </div>

              <div className="input-group">
                <label>Ghi chú địa điểm / chi tiết</label>
                <input
                  type="text"
                  value={tempTimelineDesc}
                  onChange={(e) => setTempTimelineDesc(e.target.value)}
                  placeholder="VD: Tại sảnh đón khách tầng 2"
                />
              </div>

              <button
                type="button"
                className="btn-modal-submit-main"
                onClick={handleAddTimelineSubmit}
              >
                Thêm vào lịch trình
              </button>
            </div>
          </div>
        </CustomizerModal>
      )}

      {/* ================================================================= */}
     {/* MODAL 5: QUẢN LÝ LỜI CHÚC SỔ LƯU BÚT                             */}
      {/* ================================================================= */}
      {isWishesModalOpen && (
        <CustomizerModal title="Quản lý sổ lưu bút" className="customizer-dialog-wrapper" onClose={() => setIsWishesModalOpen(false)}>
          <div className="modal-inner-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-top">
              <div className="modal-badge">
                <MessageSquare size={14} />
                <span>QUẢN LÝ SỔ LƯU BÚT ({data.guestbookWishes.length} LỜI CHÚC)</span>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setIsWishesModalOpen(false)}
              >
                <X size={16} />
              </button>
            </div>
            <div className="modal-content-list wishes-manager-list">
              {data.guestbookWishes.length === 0 ? (
                <p className="empty-modal-text">Chưa có lời chúc nào trong sổ lưu bút</p>
              ) : (
                data.guestbookWishes.map((w) => (
                  <div key={w.id} className="wish-manager-card">
                    <div className="wish-top">
                      <strong>{w.senderName}</strong>
                      <span className="wish-rel-tag">{w.relationship}</span>
                      <span className="wish-time">{w.createdAt}</span>
                    </div>
                    <p className="wish-text">“{w.message}”</p>
                    <button
                      type="button"
                      className="btn-delete-wish"
                      onClick={() =>
                        setData((prev) => ({
                          ...prev,
                          guestbookWishes: prev.guestbookWishes.filter((item) => item.id !== w.id),
                        }))
                      }
                    >
                      <Trash2 size={12} />
                      <span>Xóa</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </CustomizerModal>
      )}

      {/* ================================================================= */}
     {/* MODAL 6: XUẤT BẢN & ĐẶT THIỆP CHÍNH THỨC                          */}
      {/* ================================================================= */}
      {isPublishModalOpen && (
        <CustomizerModal title="Đặt thiệp chính thức" className="customizer-dialog-wrapper" onClose={() => setIsPublishModalOpen(false)}>
          <div className="publish-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-top">
              <div className="modal-badge">
                <Sparkles size={13} />
                <span>KISMET LOVE · ĐẶT THIỆP CHÍNH THỨC</span>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setIsPublishModalOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-summary-content">
              <h3>Bản xem trước thiệp đã sẵn sàng!</h3>
              <p>
                Cảm ơn hai bạn đã thiết kế thiệp cùng KISMET Đội ngũ kỹ thuật & thiết kế sẽ hoàn thiện bản chính thức có tên miền riêng, nhạc bản quyền và hệ thống quản lý khách mời
              </p>

              <div className="modal-data-summary">
                <div className="summary-row">
                  <span className="sum-label">Mẫu thiệp:</span>
                  <strong className="sum-val">
                    {data.packageType === "premium"
                      ? "Gói Nâng Cao · 800.000đ (KHVT)"
                      : "Gói Tiêu Chuẩn · 500.000đ"}
                  </strong>
                </div>
                <div className="summary-row">
                  <span className="sum-label">Cặp đôi:</span>
                  <span className="sum-val">{data.groomFullName} & {data.brideFullName}</span>
                </div>
                <div className="summary-row">
                  <span className="sum-label">Ngày hôn lễ:</span>
                  <span className="sum-val">{formattedPartyDate} ({data.partyTime})</span>
                </div>
                <div className="summary-row">
                  <span className="sum-label">Địa điểm:</span>
                  <span className="sum-val">{data.venueName}</span>
                </div>
              </div>

              <div className="modal-action-buttons">
                {CONTACT_PHONES.map((phone) => (
                  <a
                    key={phone.number}
                    href={`${phone.zaloUrl}?text=${encodeURIComponent(
                      `Chào KISMET, mình muốn đặt thiệp cưới ${
                        data.packageType === "premium" ? "Gói Nâng Cao 800k" : "Gói Tiêu Chuẩn 500k"
                      } cho cặp đôi ${data.groomShortName} & ${data.brideShortName} vào ngày ${formattedPartyDate}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-modal-zalo"
                  >
                    <Send size={15} />
                    <span>Nhắn Zalo tư vấn: {phone.label}</span>
                  </a>
                ))}

                {CONTACT_PHONES.map((phone) => (
                  <a key={phone.number} href={`tel:${phone.number}`} className="btn-modal-call">
                    <Phone size={15} />
                    <span>Gọi tư vấn ngay: {phone.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </CustomizerModal>
      )}
    </div>
  );
}

// ============================================================================
// LIVE RENDERED WEDDING INVITATION CANVAS
// ============================================================================
function LiveTemplateDocument({
  data,
  monogram,
  formattedDate,
  firstPerson,
  secondPerson,
  firstRole,
  secondRole,
  isPlayingMusic,
  toggleMusic,
  onAddWish,
}: {
  data: WeddingEditorData;
  monogram: string;
  formattedDate: string;
  firstPerson: string;
  secondPerson: string;
  firstRole: string;
  secondRole: string;
  isPlayingMusic: boolean;
  toggleMusic: () => void;
  onAddWish: (name: string, rel: string, message: string) => void;
}) {
  const isPremium = data.packageType === "premium";

  // State for live RSVP in preview
  const [rsvpAttending, setRsvpAttending] = useState<"yes" | "no" | null>("yes");
  const [rsvpGuestName, setRsvpGuestName] = useState("");
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // State for live wish entry in preview
  const [inputWishName, setInputWishName] = useState("");
  const [inputWishRel, setInputWishRel] = useState("Bạn của hai bạn");
  const [inputWishMsg, setInputWishMsg] = useState("");
  const [wishSentAlert, setWishSentAlert] = useState(false);

  const handleSubmitLiveWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputWishName.trim() || !inputWishMsg.trim()) return;
    onAddWish(inputWishName, inputWishRel, inputWishMsg);
    setInputWishName("");
    setInputWishMsg("");
    setWishSentAlert(true);
    setTimeout(() => setWishSentAlert(false), 3000);
  };

  return (
    <div className={`live-invitation-doc ${isPremium ? "theme-khvt-premium" : "theme-standard-minimal"}`}>
      {/* Top Floating Bar */}
      <div className="live-top-bar">
        <span className="live-monogram">{monogram}</span>
        <span className="live-date-pill">{formattedDate}</span>
        <button type="button" className="live-music-toggle" onClick={toggleMusic}>
          {isPlayingMusic ? <Volume2 size={13} /> : <VolumeX size={13} />}
        </button>
      </div>

      {/* 15. PHONG BÌ MỜI TRANG TRỌNG (GREETING BANNER) */}
      {data.showEnvelope && (
        <div className="live-envelope-seal-card">
          <div className="seal-gold-stamp">囍</div>
          <p className="seal-kicker">{data.envelopeGreeting}</p>
          <h4 className="seal-guest-title">{data.envelopeGuestName}</h4>
        </div>
      )}

      {/* Hero Section */}
      <section className="live-hero-section">
        <p className="live-intro-eyebrow">
          {data.useDefaultIntro ? "WELCOME TO OUR WEDDING" : data.introText}
        </p>

        <h1 className="live-couple-title">
          <span>{firstPerson}</span>
          <span className="live-amp">&</span>
          <span>{secondPerson}</span>
        </h1>

        <div className="live-roles-sub">
          <span>{firstRole}</span>
          <span className="dot">·</span>
          <span>{secondRole}</span>
        </div>

        {/* Hero Arch Frame Image */}
        {data.showHeroImage && (
          <div className="live-hero-arch-wrapper">
            <div className="live-arch-frame">
              <img src={data.heroImage} alt="Ảnh đầu thiệp" />
              <div className="live-arch-border" />
              <span className="live-arch-tag">You & Me, Forever</span>
            </div>
          </div>
        )}

        <div className="live-save-date-ribbon">
          SAVE THE DATE ✦ {formattedDate}
        </div>
      </section>

      {/* Lời thông báo */}
      {data.showAnnouncement && (
        <section className="live-announcement-section">
          <div className="gold-flourish">❖ ━━━━ ✦ ━━━━ ❖</div>
          <p className="announcement-text">{data.announcementText}</p>
        </section>
      )}

      {/* Thông tin hai gia đình */}
      {data.showFamilyInfo && (
        <section className="live-family-section">
          <p className="live-sec-eyebrow">TỪ HAI GIA ĐÌNH, MỘT NIỀM HẠNH PHÚC</p>
          <h2>Trân Trọng Báo Tin</h2>
          <div className="gold-flourish">❖ ✦ ❖</div>

          <div className="live-two-families-grid">
            {data.displayOrder === "groom_first" ? (
              <>
                <div className="family-column">
                  <span className="fam-badge">NHÀ TRAI</span>
                  <p className="fam-parents">
                    <span>{data.groomFamily.title}</span>
                    <strong>{data.groomFamily.father}</strong>
                    <strong>{data.groomFamily.mother}</strong>
                  </p>
                  <p className="fam-addr">{data.groomFamily.address}</p>
                </div>

                <div className="fam-center-hy">囍</div>

                <div className="family-column">
                  <span className="fam-badge">NHÀ GÁI</span>
                  <p className="fam-parents">
                    <span>{data.brideFamily.title}</span>
                    <strong>{data.brideFamily.father}</strong>
                    <strong>{data.brideFamily.mother}</strong>
                  </p>
                  <p className="fam-addr">{data.brideFamily.address}</p>
                </div>
              </>
            ) : (
              <>
                <div className="family-column">
                  <span className="fam-badge">NHÀ GÁI</span>
                  <p className="fam-parents">
                    <span>{data.brideFamily.title}</span>
                    <strong>{data.brideFamily.father}</strong>
                    <strong>{data.brideFamily.mother}</strong>
                  </p>
                  <p className="fam-addr">{data.brideFamily.address}</p>
                </div>

                <div className="fam-center-hy">囍</div>

                <div className="family-column">
                  <span className="fam-badge">NHÀ TRAI</span>
                  <p className="fam-parents">
                    <span>{data.groomFamily.title}</span>
                    <strong>{data.groomFamily.father}</strong>
                    <strong>{data.groomFamily.mother}</strong>
                  </p>
                  <p className="fam-addr">{data.groomFamily.address}</p>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* Lễ cưới */}
      {data.showCeremony && data.ceremonies.length > 0 && (
        <section className="live-ceremonies-section">
          <p className="live-sec-eyebrow">NGHI THỨC TRUYỀN THỐNG</p>
          <h2>{data.ceremonyTitle}</h2>

          <div className="live-ceremonies-cards">
            {data.ceremonies.map((c) => (
              <div key={c.id} className="live-ceremony-card">
                <span className="ceremony-badge">{c.name}</span>
                <h3>{c.time} · {c.date}</h3>
                <p className="ceremony-venue">{c.venue}</p>
                {c.address && <p className="ceremony-addr">{c.address}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tiệc cưới */}
      {data.showParty && (
        <section className="live-party-section">
          <p className="live-sec-eyebrow">HẸN BẠN VÀO NGÀY HẠNH PHÚC</p>
          <h2>{data.partyTitle}</h2>
          <div className="gold-flourish">❖ ✦ ❖</div>

          <div className="live-party-details-card">
            <p className="party-date-highlight">{formattedDate}</p>
            <div className="party-time-pill">
              <Clock size={14} />
              <span>
                {data.showGuestTime
                  ? `Đón khách: ${data.guestWelcomeTime} · Khai tiệc: ${data.partyStartTime}`
                  : `Bắt đầu lúc: ${data.partyTime}`}
              </span>
            </div>

            <div className="party-venue-box">
              <span className="venue-kicker">{data.venueTitle}</span>
              <h3>{data.venueName}</h3>
              <p>{data.venueAddress}</p>

              <a
                href={data.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-live-maps"
              >
                <Compass size={13} />
                <span>Chỉ đường Google Maps</span>
              </a>
            </div>
          </div>

          {/* Đồng hồ đếm ngược */}
          {data.showCountdown && (
            <div className="live-countdown-strip">
              <p className="cd-label">ĐẾM NGƯỢC ĐẾN THỜI KHẮC CHUNG ĐÔI</p>
              <div className="cd-boxes-row">
                <div className="cd-cell"><strong>18</strong><span>NGÀY</span></div>
                <i>:</i>
                <div className="cd-cell"><strong>06</strong><span>GIỜ</span></div>
                <i>:</i>
                <div className="cd-cell"><strong>32</strong><span>PHÚT</span></div>
                <i>:</i>
                <div className="cd-cell"><strong>15</strong><span>GIÂY</span></div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 9. DRESS CODE TRÊN BẢN THIỆP */}
      {data.showDressCode && (
        <section className="live-dresscode-section">
          <p className="live-sec-eyebrow">QUY ĐỊNH TRANG PHỤC</p>
          <h2>Gợi Ý Trang Phục Tiệc Cưới</h2>
          <div className="gold-flourish">❖ ✦ ❖</div>

          <div className="live-palette-row">
            {data.dressCodeColors
              .filter((c) => c.selected)
              .map((c, idx) => (
                <div key={idx} className="live-palette-dot-item">
                  <span
                    className="palette-color-ball"
                    style={{
                      backgroundColor: c.hex,
                      border: c.hex === "#FFFFFF" ? "1px solid #d0c2b2" : "none",
                    }}
                  />
                  <span className="palette-color-name">{c.name}</span>
                </div>
              ))}
          </div>

          <p className="dresscode-advice-text">“{data.dressCodeDescription}”</p>
        </section>
      )}

      {/* 10. LỊCH TRÌNH NGÀY CƯỚI TRÊN BẢN THIỆP */}
      {data.showTimeline && data.timelineItems.length > 0 && (
        <section className="live-timeline-section">
          <p className="live-sec-eyebrow">DÒNG THỜI GIAN</p>
          <h2>Lịch Trình Hôn Lễ</h2>
          <div className="gold-flourish">❖ ✦ ❖</div>

          <div className="live-timeline-track">
            {data.timelineItems.map((item, idx) => (
              <div key={item.id} className="live-timeline-node">
                <div className="node-marker">
                  <span className="node-dot" />
                  <span className="node-time">{item.time}</span>
                </div>
                <div className="node-card">
                  <h4>{item.title}</h4>
                  {item.description && <p>{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Thư viện ảnh cưới */}
      {data.showGallery && data.galleryPhotos.length > 0 && (
        <section className="live-gallery-section">
          <p className="live-sec-eyebrow">NHỮNG KHOẢNH KHẮC CỦA CHÚNG MÌNH</p>
          <h2>Khoảnh Khắc Ngọt Ngào</h2>

          <div className={`live-gallery-layout layout-${data.galleryLayout}`}>
            {data.galleryPhotos.map((imgUrl, i) => (
              <div key={i} className="live-gal-photo">
                <img src={imgUrl} alt={`Kỷ niệm ${i + 1}`} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. XÁC NHẬN THAM DỰ (RSVP) & CÂU HỎI THÊM */}
      <section className="live-rsvp-section">
        <p className="live-sec-eyebrow">XÁC NHẬN THAM DỰ</p>
        <h2>Phản Hồi Lời Mời</h2>
        <div className="gold-flourish">❖ ✦ ❖</div>

        <div className="live-rsvp-card">
          {rsvpSubmitted ? (
            <div className="rsvp-success-state">
              <Sparkles size={24} className="sparkle-gold" />
              <h3>Cảm ơn quý khách!</h3>
              <p>Phản hồi của quý khách đã được gửi đến cô dâu & chú rể</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setRsvpSubmitted(true);
              }}
              className="live-rsvp-form"
            >
              <div className="rsvp-choice-pills">
                <button
                  type="button"
                  className={`rsvp-pill ${rsvpAttending === "yes" ? "is-selected" : ""}`}
                  onClick={() => setRsvpAttending("yes")}
                >
                  Tham dự chung vui
                </button>
                <button
                  type="button"
                  className={`rsvp-pill ${rsvpAttending === "no" ? "is-selected" : ""}`}
                  onClick={() => setRsvpAttending("no")}
                >
                  Rất tiếc không thể đến
                </button>
              </div>

              <div className="rsvp-input-field">
                <input
                  type="text"
                  required
                  value={rsvpGuestName}
                  onChange={(e) => setRsvpGuestName(e.target.value)}
                  placeholder="Họ và tên của bạn"
                />
              </div>

              {/* Render custom questions added by couple */}
              {data.showRsvpQuestions && data.rsvpQuestions.length > 0 && (
                <div className="rsvp-additional-questions">
                  {data.rsvpQuestions.map((q, qIdx) => (
                    <div key={q.id} className="rsvp-q-subgroup">
                      <label className="q-label">
                        <strong>Câu {qIdx + 1}:</strong> {q.question}
                      </label>
                      {q.options && q.options.length > 0 ? (
                        <div className="q-options-select">
                          {q.options.map((opt, oIdx) => (
                            <label key={oIdx} className="q-radio-label">
                              <input type="radio" name={`q-${q.id}`} defaultChecked={oIdx === 0} />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <input
                          type="text"
                          placeholder="Câu trả lời của bạn"
                          className="q-text-input"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button type="submit" className="btn-submit-rsvp">
                <span>Gửi phản hồi tham dự</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 11. SỔ LƯU BÚT TRÊN BẢN THIỆP */}
      {data.showGuestbook && (
        <section className="live-guestbook-section">
          <p className="live-sec-eyebrow">LƯU GIỮ KỶ NIỆM</p>
          <h2>Sổ Lưu Bút</h2>
          <div className="gold-flourish">❖ ✦ ❖</div>

          <div className="live-guestbook-box">
            {/* Form gửi lời chúc */}
            <form onSubmit={handleSubmitLiveWish} className="live-wish-form">
              <div className="wish-inputs-row">
                <input
                  type="text"
                  required
                  value={inputWishName}
                  onChange={(e) => setInputWishName(e.target.value)}
                  placeholder="Tên của bạn"
                />
                <select
                  value={inputWishRel}
                  onChange={(e) => setInputWishRel(e.target.value)}
                >
                  <option value="Bạn của Chú Rể">Bạn của Chú Rể</option>
                  <option value="Bạn của Cô Dâu">Bạn của Cô Dâu</option>
                  <option value="Đồng nghiệp">Đồng nghiệp</option>
                  <option value="Gia đình / Họ hàng">Gia đình / Họ hàng</option>
                </select>
              </div>

              <textarea
                rows={2}
                required
                value={inputWishMsg}
                onChange={(e) => setInputWishMsg(e.target.value)}
                placeholder="Gửi lời chúc ngọt ngào nhất đến cặp đôi"
              />

              <button type="submit" className="btn-send-wish">
                <Send size={13} />
                <span>Gửi lời chúc mừng</span>
              </button>

              {wishSentAlert && (
                <p className="wish-sent-success">✦ Lời chúc của bạn đã được lưu vào sổ lưu bút!</p>
              )}
            </form>

            {/* Danh sách lời chúc */}
            <div className="live-wishes-wall">
              {data.guestbookWishes.map((w) => (
                <div key={w.id} className="live-wish-card">
                  <div className="wish-header">
                    <strong>{w.senderName}</strong>
                    <span className="rel-tag">{w.relationship}</span>
                  </div>
                  <p className="wish-body">“{w.message}”</p>
                  <span className="wish-date">{w.createdAt}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 12. HỘP MỪNG CƯỚI & VIETQR */}
      {data.showGiftBox && (
        <section className="live-gift-section">
          <p className="live-sec-eyebrow">HỘP MỪNG CƯỚI TRANG TRỌNG</p>
          <h2>Gửi Lời Chúc & Mừng Cưới</h2>
          <div className="gold-flourish">❖ ✦ ❖</div>

          <div className="live-qr-cards-grid">
            {data.bankAccounts.length > 0 ? (
              data.bankAccounts.map((b) => (
                <div key={b.id} className="live-qr-card">
                  <span className="qr-tag">
                    {b.target === "groom" ? "MỪNG CHÚ RỂ" : b.target === "bride" ? "MỪNG CÔ DÂU" : "MỪNG ĐÔI BẠN"}
                  </span>
                  <div className="qr-visual-sim">
                    <span className="qr-sim-brand">VIETQR</span>
                    <span className="qr-sim-code">✦ MÃ QR ✦</span>
                  </div>
                  <h4>{b.accountHolder}</h4>
                  <p className="bank-name">{b.bankName}</p>
                  <p className="bank-stk">STK: {b.accountNumber}</p>
                </div>
              ))
            ) : (
              <div className="live-qr-card">
                <span className="qr-tag">MỪNG CHÚ RỂ</span>
                <div className="qr-visual-sim">
                  <span className="qr-sim-brand">VIETQR</span>
                  <span className="qr-sim-code">✦ MÃ QR ✦</span>
                </div>
                <h4>{data.groomShortName}</h4>
                <p className="bank-name">{data.groomBank.bankName}</p>
                <p className="bank-stk">STK: {data.groomBank.accountNumber}</p>
              </div>
            )}
          </div>

          {data.otherPaymentNote && (
            <p className="live-other-payment-note">
              Phương thức khác: {data.otherPaymentNote}
            </p>
          )}
        </section>
      )}

      {/* 13. LỜI CẢM ƠN (THANK YOU FOOTER) */}
      <footer className="live-footer">
        {data.showThankYou && (
          <p className="live-thank-quote">
            “{data.thankYouMessage}”
          </p>
        )}
        <h3 className="live-sign-names">{data.brideShortName} & {data.groomShortName}</h3>
        <span className="live-brand-note">KISMET LOVE · Thiệp cưới điện tử độc bản</span>
      </footer>
    </div>
  );
}
