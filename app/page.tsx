import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Journey from "./components/Journey";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Achievements from "./components/Achievements";
import Education from "./components/Education";
import Blog from "./components/Blog";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ScrollProgress from "./components/effects/ScrollProgress";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505] text-[#fafafa]">
      <ScrollProgress />
      <Navbar />
      <Hero />
      <About />
      <Journey />
      <Skills />
      <Experience />
      <Projects />
      <Achievements />
      <Education />
      <Blog />
      <Contact />
      <Footer />
    </main>
  );
}
