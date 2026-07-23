import { Head } from "vite-react-ssg";
import Hero from "../components/Hero";
import Statement from "../components/Statement";
import WhyUs from "../components/WhyUs";
import Systems from "../components/Systems";
import Projects from "../components/Projects";
import Technology from "../components/Technology";
import Process from "../components/Process";
import Faq from "../components/Faq";
import Contact from "../components/Contact";
import { SITE_URL } from "../lib/site";
import { localBusinessSchema, faqSchema } from "../lib/schema";

export default function Home() {
  return (
    <>
      <Head>
        <link rel="canonical" href={SITE_URL} />
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Head>
      <Hero />
      <Statement />
      <WhyUs />
      <Systems />
      <Projects />
      <Technology />
      <Process />
      <Faq />
      <Contact />
    </>
  );
}
