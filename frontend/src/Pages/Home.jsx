import NavBar from "../Components/NavBar/NavBar"
import Section from "../Components/Section"
import {motion} from "framer-motion"
import Page from "./Page"
import Footer from "../Components/Footer"
import FAQ from "../Components/FAQ"
import UserFeedBack from "../Components/UserFeedBack"
import ScrollVelocity from "../Components/Effects/ScrollVelocity"
import Scan from "../assets/scan1.svg"
import Point from "../assets/point1.svg"
import Water from "../assets/water2.svg"

const cards = [
  {
    title: "Scan & Post",
    description: "Complete a sustainable activity, scan the QR code, and post a photo of your eco-friendly action.",
    image: Scan 
  },
  {
    title: "Earn Points and Compete",
    description: "Get rewarded with points based on your activity. Compete with others user through leaderboard",
    image: Point 
  },
  {
    title: "Grow Your Plant",
    description: "Spend points to nurture your virtual plant. Watch it grow and unlock new appearances as you level up!",
    image: Water 
  },
]


export default function Home() {
  return (
    <Page className="bg-white">
      <NavBar />
      
      <Section />

      <div className="container mx-auto p-4 relative mb-24">
          <div className="w-full flex justify-center ">
            <div className="max-w-[1024px] w-full">
              <motion.h2
                className="font-serif text-4xl md:text-5xl text-center text-black mt-10 md:mt-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5 }}
              >
                How LeadGreen Works
              </motion.h2>
            </div>
          </div>

          <div className="w-full flex justify-center mt-14 mb-10 relative z-1 ">
            <div className="grid grid-cols-1 md:grid-cols-3 max-w-[1024px] mx-auto gap-4 md:gap-8 px-4">
              {cards.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-xl ring-1 ring-green-100"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(22, 141, 64, 0.35)" }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="grid place-items-center w-8 h-8 rounded-full bg-green-600 text-white text-sm font-bold">{index + 1}</span>
                    <h3 className="text-xl font-semibold text-green-700">{feature.title}</h3>
                  </div>
                  <img src={feature.image}  className="w-full h-48 object-contain mb-4 py-4" alt="" />
                  <p className="text-gray-700 text-lg">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      <ScrollVelocity
        texts={['Lead Green', 'Make Exeter Green Again']} 
        className="custom-scroll-text"
      />

      <UserFeedBack/>
    
      <FAQ/>

      <Footer/>

    </Page>
  )
} 