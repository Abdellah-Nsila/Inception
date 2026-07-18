import Layout from "@/components/global/Layout";
import ScrollReveal from "@/components/global/ScrollReveal";
import { Sections } from "@/data/sections";

export default function App() {
  return (
    <Layout>
    {Sections.map((section, index) => {
      // Extract and capitalize the component reference so React recognizes it as an element node
      const PageComponent = section.component;
      
      return (
        <div 
          key={section.id} 
          id={section.id} 
          className={`${section.minHeight} flex items-center w-full`}
        >
          <ScrollReveal>
            {/* Pass the index down as a prop to the section component */}
            <PageComponent sectionIndex={index} />
          </ScrollReveal>
        </div>
      );
    })}
  </Layout>
  );
}