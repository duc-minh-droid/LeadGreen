"use client"
import { useState } from "react"
import { Leaf, TableOfContents, Menu, X } from "lucide-react"
import UserNav from "./UserNav"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence, easeIn  } from "framer-motion"
import MobileDropDown from './MobileDropDown';
//na

const navbarVariants = {
  hidden: {opacity: 0, y: -50},
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

const linkVariants = {
  hover: {
    scale: 1.1,
    color: "#15803d",
    transition: {type: "spring", stiffness: 300},
  },
}


export default function NavBar(){
  const [isOpen, setIsOpen] = useState(false)
  const { pathname } = useLocation()

  const navLinks = [
    {to: "/feed", text: "Feed"},
    {to: "/leaderboard", text: "Leaderboard"},
    {to: "/game", text: "Game"},
  ]

  return(
    <>
      {/* Make NavBar transparent */}
      <motion.div className="flex justify-between items-center py-5 z-50 backdrop-blur-lg shadow-md bg-white/40 sticky top-0 "
      // NavBar animation
      initial = "hidden"
      animate = "visible"
      variants={navbarVariants}>
        <motion.div className="flex items-center space-x-2 px-8" whileHover={{scale: 1.05}}>
          <Leaf className="h-8 w-8 text-green-600" />
          <Link to={"/"} className="text-2xl font-bold text-green-700">LeadGreen</Link>
        </motion.div>

        {/* Desktop NavBar */}
        <div className="hidden md:flex">
          <div className="flex items-center space-x-6 px-8">
            {navLinks.map((link) => (
              <motion.div key={link.to} whileHover="hover" variants={linkVariants} className="relative">
                <Link 
                  to={link.to}
                  className="text-xl font-bold text-green-700">
                    {link.text}
                </Link>
                {/* animated underline that slides to the active page */}
                {pathname.startsWith(link.to) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-0 right-0 -bottom-1.5 h-[3px] rounded-full bg-green-500"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.div>
            ))}
            <motion.div whileHover="hover" variants={linkVariants}>
              <UserNav/>
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden px-8">
          <motion.button
            whileHover={{scale: 1.1}}
            whileTap={{scale:0.95}}
            onClick={() => setIsOpen(!isOpen)}
            className="text-green-700"
          >
            {isOpen ? <X size={24}/> : <Menu size ={24} />}
          </motion.button>
        </div>
      </motion.div>
      
      <MobileDropDown 
        isOpen={isOpen}
        setIsOpen = {setIsOpen}
        navLinks={navLinks}
        UserNav={UserNav}/>
    </>
  )
}