import { Audit } from "@/components/Audit";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { Problem } from "@/components/Problem";
import { Process } from "@/components/Process";
import { Services } from "@/components/Services";
import { structuredData } from "@/lib/structured-data";

export default function HomePage() {
  return (
    <>
      <JsonLd data={structuredData()} />
      <Header />
      <main id="main">
        <Hero />
        <Problem />
        <Services />
        <Process />
        <Audit />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
