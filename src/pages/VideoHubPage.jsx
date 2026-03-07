import HowItWorksHero from '../components/how-it-works/HowItWorksHero';
import VideoSection from '../components/how-it-works/VideoSection';
import HowItWorksSteps from '../components/how-it-works/HowItWorksSteps';
import HowItWorksCTA from '../components/how-it-works/HowItWorksCTA';
import WhyPeopleChoose from '../components/how-it-works/WhyPeopleChoose';

function VideoHubPage() {
  return (
    <div className="video-hub-page">
      <HowItWorksHero />
      <VideoSection />
      <HowItWorksSteps />
      <HowItWorksCTA />
      <WhyPeopleChoose />
    </div>
  );
}

export default VideoHubPage;
