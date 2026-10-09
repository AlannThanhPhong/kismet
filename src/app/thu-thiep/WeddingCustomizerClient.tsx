"use client";

import { useSearchParams } from "next/navigation";
import WeddingCustomizerPreview, { type CustomizerPackage } from "../components/WeddingCustomizerPreview";

export default function WeddingCustomizerClient() {
  const searchParams = useSearchParams();
  const pkgParam = searchParams.get("package");
  const initialPackage: CustomizerPackage =
    pkgParam === "premium" || pkgParam === "800k" ? "premium" : "standard";

  return (
    <WeddingCustomizerPreview
      initialPackage={initialPackage}
      previewOnly={searchParams.get("view") === "preview"}
    />
  );
}
