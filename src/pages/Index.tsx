import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { MoodTrackerPromo } from "@/components/home/MoodTrackerPromo";
import { BlogPreview } from "@/components/home/BlogPreview";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <MoodTrackerPromo />
      <BlogPreview />
      <CTASection />
    </Layout>
  );
};

export default Index;
