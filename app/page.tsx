import { Hero } from "@/components/hero";
import { ProductGallery } from "@/components/product-gallery";
import { AboutMaker } from "@/components/about-maker";
import { Contact, Footer } from "@/components/contact";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <ProductGallery />
        <AboutMaker />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
