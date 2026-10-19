"use client";

import { useSearchParams } from "next/navigation";
import WeddingCustomizerPreview, { type CustomizerPackage, type InvitationStyle } from "../components/WeddingCustomizerPreview";

export default function WeddingCustomizerClient() {
  const searchParams = useSearchParams();
  const pkgParam = searchParams.get("package");
  const initialPackage: CustomizerPackage =
    pkgParam === "premium" || pkgParam === "800k" ? "premium" : "standard";
  const styleParam = searchParams.get("style");
  const initialStyle: InvitationStyle = styleParam === "red-artline" || styleParam === "bnw" || styleParam === "muted-color" || styleParam === "mid-century" ? styleParam : "minimalist";

  return (
    <WeddingCustomizerPreview
      initialPackage={initialPackage}
      initialStyle={initialStyle}
      previewOnly={searchParams.get("view") === "preview"}
    />
  );
}
