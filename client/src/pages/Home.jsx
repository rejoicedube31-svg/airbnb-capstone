import PageLayout from "../components/PageLayout";
import HeroBanner from "../components/HeroBanner";
import InspirationSection from "../components/InspirationSection";
import DiscoverExperiences from "../components/DiscoverExperiences";
import ShopAirbnb from "../components/ShopAirbnb";
import HostQuestionsBanner from "../components/HostQuestionsBanner";
import FutureGetaways from "../components/FutureGetaways";
import "./Home.css";

export default function Home() {
  return (
    <PageLayout headerVariant="home">
      <main className="home">
        <HeroBanner />
        <InspirationSection />
        <DiscoverExperiences />
        <ShopAirbnb />
        <HostQuestionsBanner />
        <FutureGetaways />
      </main>
    </PageLayout>
  );
}
