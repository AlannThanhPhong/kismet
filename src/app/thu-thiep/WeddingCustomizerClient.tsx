"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import WeddingCustomizerPreview, {
  type CustomizerPackage,
  type InvitationStyle,
} from "../components/WeddingCustomizerPreview";
import ExactTemplateCustomizer from "../components/ExactTemplateCustomizer";

export default function WeddingCustomizerClient() {
  const searchParams = useSearchParams();
  const templateParam = searchParams.get("template");
  const customIdParam = searchParams.get("custom");
  const pkgParam = searchParams.get("package");
  const styleParam = searchParams.get("style");
  const viewParam = searchParams.get("view");
  const modeParam = searchParams.get("mode");

  // Default to ExactTemplateCustomizer unless classic mode or preview view is explicitly requested
  const startInClassic =
    viewParam === "preview" ||
    modeParam === "classic" ||
    Boolean(styleParam && !templateParam);

  const [useClassicMode, setUseClassicMode] = useState<boolean>(startInClassic);

  const initialPackage: CustomizerPackage =
    pkgParam === "premium" || pkgParam === "800k" ? "premium" : "standard";
  const initialStyle: InvitationStyle =
    styleParam === "red-artline" ||
    styleParam === "bnw" ||
    styleParam === "muted-color" ||
    styleParam === "mid-century"
      ? styleParam
      : "minimalist";

  // Map ?package=premium without ?template to 20261027-KHVT in exact template mode
  const resolvedTemplateCode =
    templateParam || (pkgParam === "premium" || pkgParam === "800k" ? "20261027-KHVT" : "lovers-diary");

  if (!useClassicMode) {
    return (
      <ExactTemplateCustomizer
        initialTemplateCode={resolvedTemplateCode}
        initialCustomId={customIdParam}
        onSwitchToClassicBuilder={() => setUseClassicMode(true)}
      />
    );
  }

  return (
    <WeddingCustomizerPreview
      initialPackage={initialPackage}
      initialStyle={initialStyle}
      previewOnly={viewParam === "preview"}
    />
  );
}
