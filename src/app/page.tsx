import { currencyForCountry } from "@/lib/pricing";
import { getVisitorCountry } from "@/lib/visitor-country";
import WhiteStorefront from "./components/WhiteStorefront";
import "./white-storefront.css";
import "./pricing-white.css";
import "./project-previews.css";
import "./mood-white.css";

export default async function Home() {
  return <WhiteStorefront currency={currencyForCountry(await getVisitorCountry())} />;
}
