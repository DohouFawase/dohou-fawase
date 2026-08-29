import About from "@/components/aboutSection";
import Contact from "@/components/contact";
import Experience from "@/components/experienceSection";
import Herosection from "@/components/herosection";
import HowIWork from "@/components/howiswork";
import Principles from "@/components/principeSection";
import Work from "@/components/projectSection";
import Stack from "@/components/stackSetion";

export default function Home() {
  return (
    <>
      <div className="dark:bg-gray-50 dark:text-black">

        <Herosection />
        <About />
        <Experience />
        <HowIWork />
        <Work />
        <Stack />
        <Principles />
        <Contact />
      </div>
    </>
  );
}
