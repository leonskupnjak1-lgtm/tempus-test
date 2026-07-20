import Header from "./components/Header";
import Hero from "./components/Hero";
import Statement from "./components/Statement";
import WhyUs from "./components/WhyUs";
import Systems from "./components/Systems";
import Projects from "./components/Projects";
import Technology from "./components/Technology";
import Process from "./components/Process";
import Faq from "./components/Faq";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { WaterlineRail } from "./components/common/Waterline";

function App() {
  return (
    <>
      <WaterlineRail />
      <Header />
      <main>
        <Hero />
        <Statement />
        <WhyUs />
        <Systems />
        <Projects />
        <Technology />
        <Process />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
