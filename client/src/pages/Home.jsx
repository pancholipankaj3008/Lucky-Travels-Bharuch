import FeaturedCars from '../components/Featuredcars'
import Hero from '../components/hero'
import Services from '../components/Services'
import WhyChoose from '../components/WhyChoose'


export default function Home() {
  return (
    <main className="bg-white font-[Inter,sans-serif] text-black">
      <Hero />
      <WhyChoose/>
      <FeaturedCars/>
      <Services/>
    </main>
  )
}