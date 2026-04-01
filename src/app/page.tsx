import { Header } from '@/components/Header';
import { HeroBanner } from '@/components/HeroBanner';
import { FlagshipModels } from '@/components/FlagshipModels';
import { VideoPreview } from '@/components/VideoPreview';
import { ProductFeatures } from '@/components/ProductFeatures';
import { ClientCases } from '@/components/ClientCases';
import { BusinessConsultation } from '@/components/BusinessConsultation';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="h-screen overflow-auto scroll-none bg-[#0a0a0a]">
      <div className="bg-[#0a0a0a]">
        <Header />
        <HeroBanner />
        <FlagshipModels />
        <VideoPreview />
        <ProductFeatures />
        <ClientCases />
        <BusinessConsultation />
        <Footer />
      </div>
    </main>
  );
}
