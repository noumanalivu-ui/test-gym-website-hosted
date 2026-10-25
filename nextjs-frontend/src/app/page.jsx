import FitnessCalculators from "../components/home/FitnessCalculators";
import Hero from "../components/home/Hero";
import JourneyWithUs from "../components/home/JourneyWithUs"; 
import Pricing from "../components/home/Pricing";
import Services from "../components/home/Services";
import Testimonials from "../components/home/Testimonials";
import WhyGymingGood from "../components/home/WhyGymingGood";


export default function Home() {
  return (
  <>
  <Hero/>
  <JourneyWithUs/>
  <Services/> 
  <FitnessCalculators/> 
  <WhyGymingGood/>
  <Testimonials/>
  <Pricing/>
  </>
  );
}
