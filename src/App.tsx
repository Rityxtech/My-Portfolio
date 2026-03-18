import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Menu, X, Code2, Server, MonitorPlay, ExternalLink, Github, Cpu, Mail, Linkedin, Send, Twitter, Instagram, Quote, FileDown, Loader2, ArrowUp, Database, Globe, Zap, ShieldCheck, Home, User, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useEffect, Suspense, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial, Float, Sphere, MeshWobbleMaterial, Text, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import PullToRefresh from './components/PullToRefresh';
import CustomScrollbar from './components/CustomScrollbar';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const lastScrollY = useRef(0);

  const { scrollY } = useScroll();
  const rotation = useTransform(scrollY, [0, 1000], [0, 150]);

  const navLinks = [
    { name: 'Home', href: '#', id: 'home' },
    { name: 'About Me', href: '#about', id: 'about' },
    { name: 'My Skills', href: '#skills', id: 'skills' },
    { name: 'Projects', href: '#projects', id: 'projects' },
    { name: 'Testimonials', href: '#testimonials', id: 'testimonials' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sections = ['about', 'skills', 'projects', 'testimonials', 'contact'];
          let current = 'home';

          for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
              const rect = element.getBoundingClientRect();
              if (rect.top <= 150) {
                current = section;
              }
            }
          }

          setActiveSection(prev => prev !== current ? current : prev);

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-brand-darker/80 backdrop-blur-md">
        <div className="w-full mx-auto px-4 md:px-12 lg:px-24">
          <div className="flex items-center justify-between h-14 md:h-20">
            <div className="flex-shrink-0 flex items-center">
              <img
                src="https://i.imgur.com/AVllRQ2.png"
                alt="RityXTech Logo"
                className="h-7 w-7 md:h-9 md:w-9 object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="text-2xl md:text-3xl font-bold tracking-tighter text-white">
                RityX<span className="text-brand-accent">Tech</span>
              </span>
            </div>

            <div className="flex items-center gap-4 md:gap-8">
              <a
                className="hidden sm:block px-6 py-2.5 bg-brand-accent hover:bg-brand-glow text-white rounded-full transition-all shadow-lg shadow-brand-accent/20 text-xs md:text-sm font-bold uppercase tracking-wider"
                href="#contact"
              >
                Let's Talk
              </a>
              <button
                className="text-white hover:text-brand-glow focus:outline-none p-2 transition-transform hover:scale-110 active:scale-95"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="h-8 w-8 md:h-9 md:w-9" /> : <Menu className="h-8 w-8 md:h-9 md:w-9" />}
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-brand-glow to-purple-400 opacity-30"></div>
      </nav>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 top-14 md:top-20 bg-black/60 backdrop-blur-sm z-30"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-14 md:top-20 left-0 bottom-24 md:bottom-0 w-[260px] md:w-[300px] z-40 shadow-[10px_0_30px_rgba(0,0,0,0.3)] flex flex-col rounded-br-2xl overflow-hidden p-[2px] pt-0 pl-0"
            >
              {/* Multi-color Border Animation */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] bg-[conic-gradient(from_0deg,#6366f1,#10b981,#f43f5e,#6366f1)] opacity-60"
                />
              </div>

              {/* Sidebar Content Container */}
              <div className="relative z-10 w-full h-full bg-brand-darker flex flex-col rounded-br-[14px] overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-black/20 flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center overflow-hidden">
                      <img
                        src="https://i.imgur.com/L3Dfbl6.jpeg"
                        alt="RityXTech Profile"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-brand-darker animate-pulse" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white tracking-tight">System Status</p>
                    <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">Available for Hire</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-2.5 space-y-1.5">
                  {navLinks.map((link, i) => {
                    const isActive = activeSection === link.id;
                    return (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <a
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={`group relative flex items-center gap-2.5 p-2.5 rounded-lg transition-all duration-300 overflow-hidden ${isActive
                            ? 'text-white bg-brand-accent/10 shadow-[inset_0_0_20px_rgba(99,102,241,0.1)]'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="activeGlow"
                              className="absolute left-0 top-0 bottom-0 w-1 bg-brand-accent shadow-[0_0_15px_#6366f1]"
                            />
                          )}
                          <span className={`font-mono text-[10px] transition-opacity ${isActive ? 'text-brand-accent opacity-100' : 'opacity-50 group-hover:opacity-100'}`}>
                            0{i + 1}
                          </span>
                          <span className={`text-sm md:text-base font-bold transition-transform duration-200 ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                            {link.name}
                          </span>
                          {isActive && (
                            <div className="ml-auto">
                              <Zap className="w-3 h-3 text-brand-accent animate-pulse" />
                            </div>
                          )}
                        </a>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="p-2.5 border-t border-white/5 bg-black/20">
                  <div className="flex gap-4 mb-2.5 px-2.5">
                    <a href="#" className="text-slate-500 hover:text-brand-accent transition-colors"><Twitter className="w-4 h-4" /></a>
                    <a href="#" className="text-slate-500 hover:text-brand-accent transition-colors"><Github className="w-4 h-4" /></a>
                    <a href="#" className="text-slate-500 hover:text-brand-accent transition-colors"><Linkedin className="w-4 h-4" /></a>
                  </div>
                  <p className="text-[9px] px-2.5 text-slate-600 font-mono uppercase tracking-widest">© 2024 RityXTech</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] z-50">
        <div className="bg-brand-darker/40 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          {[
            { id: 'home', icon: Home, href: '#' },
            { id: 'about', icon: User, href: '#about' },
            { id: 'projects', icon: Code2, href: '#projects', isCenter: true },
            { id: 'skills', icon: Cpu, href: '#skills' },
            { id: 'contact', icon: Mail, href: '#contact' }
          ].map((tab, i) => {
            const isActive = activeSection === tab.id;

            if (tab.isCenter) {
              return (
                <a
                  key={tab.id}
                  href={tab.href}
                  className="relative -top-4 group"
                >
                  <motion.div
                    animate={{
                      boxShadow: ["0 0 10px #6366f1", "0 0 25px #6366f1", "0 0 10px #6366f1"],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-12 h-12 bg-brand-accent rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] border-4 border-brand-darker"
                  >
                    <motion.div
                      style={{ rotate: rotation }}
                      transition={{ type: "spring", damping: 30, stiffness: 200 }}
                      className="absolute inset-0 border-2 border-white/20 rounded-full border-dashed"
                    />
                    <tab.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-brand-accent uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                    Build
                  </div>
                </a>
              );
            }

            return (
              <a
                key={tab.id}
                href={tab.href}
                className={`flex flex-col items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${isActive ? 'text-brand-accent bg-brand-accent/10' : 'text-slate-400 hover:text-white'
                  }`}
              >
                <tab.icon className={`w-4.5 h-4.5 ${isActive ? 'animate-pulse' : ''}`} />
                {isActive && (
                  <motion.div
                    layoutId="bottomNavActive"
                    className="absolute -bottom-1 w-1 h-1 bg-brand-accent rounded-full"
                  />
                )}
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
};

const CodeLine = ({ text, position, color }: { text: string, position: [number, number, number], color: string }) => {
  const textRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (textRef.current) {
      // Slow vertical scroll
      textRef.current.position.y += 0.005;
      if (textRef.current.position.y > 2) {
        textRef.current.position.y = -2;
      }
    }
  });

  return (
    <group ref={textRef} position={position}>
      <Text
        fontSize={0.12}
        color={color}
        font="https://fonts.gstatic.com/s/jetbrainsmono/v18/t6q243z9W5ZNr7S-TR4.woff"
        anchorX="left"
        anchorY="middle"
      >
        {text}
      </Text>
    </group>
  );
};

const BinaryParticle = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [val] = useState(() => Math.random() > 0.5 ? "1" : "0");
  const [pos] = useState(() => [
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10
  ] as [number, number, number]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y -= 0.01;
      if (meshRef.current.position.y < -5) meshRef.current.position.y = 5;
    }
  });

  return (
    <Text
      ref={meshRef}
      position={pos}
      fontSize={0.1}
      color="#10b981"
      fillOpacity={0.2}
    >
      {val}
    </Text>
  );
};

const StylizedAIObject = () => {
  const codeSnippets = [
    { text: "function deploy() {", color: "#6366f1" },
    { text: "  const app = new App();", color: "#ffffff" },
    { text: "  app.initialize();", color: "#10b981" },
    { text: "  return app.run();", color: "#f43f5e" },
    { text: "}", color: "#6366f1" },
    { text: "class NeuralNetwork {", color: "#6366f1" },
    { text: "  constructor(layers) {", color: "#ffffff" },
    { text: "    this.layers = layers;", color: "#10b981" },
    { text: "  }", color: "#6366f1" },
    { text: "  async train(data) {", color: "#ffffff" },
    { text: "    await this.optimize();", color: "#f43f5e" },
    { text: "  }", color: "#ffffff" },
    { text: "}", color: "#6366f1" },
  ];

  return (
    <group>
      {/* The Code Monolith / Terminal */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <group>
          {/* Terminal Frame */}
          <mesh>
            <boxGeometry args={[3, 4, 0.1]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} opacity={0.9} transparent />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <boxGeometry args={[2.8, 3.8, 0.01]} />
            <meshBasicMaterial color="#1e293b" />
          </mesh>

          {/* Scrolling Code Content */}
          <group position={[-1.3, 0, 0.08]}>
            {codeSnippets.map((snippet, i) => (
              <CodeLine
                key={i}
                text={snippet.text}
                position={[0, (i * -0.25) + 1.5, 0]}
                color={snippet.color}
              />
            ))}
          </group>

          {/* Glowing Border */}
          <mesh position={[0, 0, -0.05]}>
            <boxGeometry args={[3.1, 4.1, 0.05]} />
            <meshBasicMaterial color="#6366f1" wireframe opacity={0.3} transparent />
          </mesh>
        </group>
      </Float>

      {/* Ambient Binary Rain */}
      {[...Array(50)].map((_, i) => (
        <BinaryParticle key={i} />
      ))}

      {/* Technical Orbitals */}
      <group rotation={[Math.PI / 4, 0, 0]}>
        <mesh>
          <torusGeometry args={[4, 0.01, 16, 100]} />
          <meshBasicMaterial color="#6366f1" transparent opacity={0.1} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[4.5, 0.01, 16, 100]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.05} />
        </mesh>
      </group>
    </group>
  );
};


const Hero = () => {
  return (
    <section className="relative flex md:items-center md:justify-center pt-20 md:pt-36 pb-[10px] md:pb-16 md:min-h-[75vh] overflow-hidden bg-brand-darker mt-0" id="home">
      {/* Immersive Background Layer */}
      <div className="absolute inset-0 z-0">
        {/* Animated Gradient Atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.3),transparent_70%)] md:bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.15),transparent_70%)] animate-pulse-slow"></div>

        {/* Infinite Scrolling Code Marquee (Background) */}
        <div className="absolute inset-0 opacity-[0.08] md:opacity-[0.03] pointer-events-none select-none overflow-hidden flex flex-col gap-2 md:gap-4 py-10 md:py-20">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: i % 2 === 0 ? "-100%" : "0%" }}
              animate={{ x: i % 2 === 0 ? "0%" : "-100%" }}
              transition={{ duration: 40 + i * 5, repeat: Infinity, ease: "linear" }}
              className="whitespace-nowrap font-mono text-2xl md:text-6xl font-bold flex gap-4 md:gap-10"
            >
              <span>{"const ai = new Intelligence(); ai.code(); ai.evolve(); ai.create();"}</span>
              <span>{"import { motion } from \"framer-motion\"; export default function Future() {}"}</span>
              <span>{"while(true) { innovation(); creativity(); passion(); }"}</span>
              <span>{"<Canvas shadows camera={{ position: [0, 0, 5], fov: 75 }}>"}</span>
            </motion.div>
          ))}
        </div>

        {/* Floating Particles / AI Nodes */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
                opacity: Math.random() * 0.5
              }}
              animate={{
                y: [null, "-10px", "10px", "0px"],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute w-0.5 h-0.5 md:w-1 md:h-1 bg-brand-accent rounded-full md:blur-[1px]"
            ></motion.div>
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full mx-auto px-4 md:px-12 lg:px-24 flex flex-row items-center justify-between gap-4 md:gap-12">
        {/* Bold Oversized Typography (Left) */}
        <div className="text-left flex-1 min-w-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-3 md:mb-5">
              <span className="block text-white">CRAFTING THE</span>
              <span className="block gradient-text italic">INFINITE</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xs sm:text-sm md:text-lg lg:text-xl text-slate-400 max-w-2xl mb-5 md:mb-8 font-medium leading-tight"
          >
            Architecting high-performance full-stack and mobile ecosystems. I specialize in engineering
            scalable, resilient, and user-centric applications that bridge the gap between complex
            backend logic and seamless digital experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-row items-center justify-start gap-3 md:gap-4 mb-[18px] md:mb-0"
          >
            <a className="group relative px-5 py-2.5 md:px-8 md:py-4 bg-brand-accent text-white text-[12px] md:text-base font-bold rounded-full overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.6)]" href="#projects">
              <span className="relative z-10">EXPLORE</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </a>
            <a className="px-5 py-2.5 md:px-8 md:py-4 bg-transparent border border-white/20 text-white text-[12px] md:text-base font-bold rounded-full hover:bg-white/5 transition-all" href="#contact">
              CONTACT
            </a>
          </motion.div>
        </div>

        {/* Engaging Visual: Interactive 3D Model Viewer (Right) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative group w-[110px] sm:w-[180px] md:w-full md:max-w-[400px] aspect-square shrink-0 -ml-[15px] md:ml-0"
        >
          {/* Holographic Glow Rings */}
          <div className="absolute inset-0 -m-1 md:-m-8 border border-brand-accent/30 rounded-full animate-[spin_10s_linear_infinite] opacity-50 pointer-events-none"></div>
          <div className="absolute inset-0 -m-2 md:-m-16 border border-brand-indigo/20 rounded-full animate-[spin_15s_linear_infinite_reverse] opacity-30 pointer-events-none"></div>

          {/* Multi-color Border Animation (Anticlockwise) */}
          <div className="absolute inset-0 -m-[2px] md:-m-[4px] rounded-full overflow-hidden pointer-events-none z-0">
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,#6366f1,#10b981,#f43f5e,#6366f1)] opacity-60"
            />
          </div>

          <div className="relative w-full h-full rounded-full overflow-hidden border border-brand-accent/50 shadow-[0_0_20px_rgba(99,102,241,0.3)] md:shadow-[0_0_50px_rgba(99,102,241,0.5)] bg-brand-darker backdrop-blur-sm">
            {/* Base Grayscale Image */}
            <img
              src="https://i.imgur.com/L3Dfbl6.jpeg"
              alt="RityXTech Profile Grayscale"
              className="w-full h-full object-cover grayscale opacity-100"
              referrerPolicy="no-referrer"
            />

            {/* Animated Color Reveal Overlay */}
            <motion.img
              src="https://i.imgur.com/L3Dfbl6.jpeg"
              alt="RityXTech Profile Color"
              className="absolute inset-0 w-full h-full object-cover z-10"
              animate={{
                clipPath: [
                  "inset(0 0 100% 0)",
                  "inset(0 0 0% 0)",
                  "inset(0 0 100% 0)"
                ]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
              referrerPolicy="no-referrer"
            />

            {/* Scanning Line Effect */}
            <motion.div
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-[1px] md:h-1 bg-brand-accent shadow-[0_0_8px_#6366f1] md:shadow-[0_0_15px_#6366f1] z-20 pointer-events-none"
            />
          </div>
        </motion.div>
      </div>

    </section>
  );
};

const Counter = ({ target, duration = 2 }: { target: number, duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration]);

  return <span>{count}{target > 10 ? '+' : ''}</span>;
};

const Stats = () => {
  return (
    <section className="py-8 md:py-16 bg-brand-darker/50 border-y border-white/5">
      <div className="w-full mx-auto px-2.5 md:px-12 lg:px-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-8">
          {[
            { label: 'Years of Expertise', value: 3, delay: 0 },
            { label: 'Systems Architected', value: 45, delay: 0.1 },
            { label: 'Technologies Mastered', value: 9, delay: 0.2 },
            { label: 'Successful Deliveries', value: 15, delay: 0.3 },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: stat.delay }}
              className="text-center"
            >
              <p className="text-2xl md:text-5xl font-bold gradient-text mb-1 md:mb-2">
                <Counter target={stat.value} />
              </p>
              <p className="text-[10px] md:text-sm text-slate-400 uppercase tracking-widest font-semibold">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Certifications = () => {
  return (
    <section className="pt-8 pb-4 md:py-16 overflow-hidden">
      <div className="w-full mx-auto px-2.5 md:px-12 lg:px-24">
        <h2 className="text-center text-slate-500 uppercase tracking-[0.2em] text-[10px] md:text-sm font-bold mb-2.5 md:mb-12">Strategic Partnerships & Certifications</h2>
        <div className="flex flex-wrap justify-center items-center gap-2.5 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="text-lg md:text-2xl font-bold tracking-tighter hover:scale-110 transition-transform">AWS Certified</div>
          <div className="text-lg md:text-2xl font-bold tracking-tighter hover:scale-110 transition-transform">Google Cloud</div>
          <div className="text-lg md:text-2xl font-bold tracking-tighter hover:scale-110 transition-transform">Meta Engineering</div>
          <div className="text-lg md:text-2xl font-bold tracking-tighter hover:scale-110 transition-transform">Adobe Creative</div>
          <div className="text-lg md:text-2xl font-bold tracking-tighter hover:scale-110 transition-transform">Microsoft Azure</div>
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section className="pt-4 pb-8 md:py-16 relative" id="about">
      <div className="w-full mx-auto px-2.5 md:px-12 lg:px-24 grid md:grid-cols-2 gap-2.5 md:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-brand-accent font-mono text-xs md:text-sm mb-2.5 md:mb-4 block tracking-tighter">&lt;about-me /&gt;</span>
          <h2 className="text-2xl md:text-4xl font-bold mb-2.5 md:mb-6">The story behind the screen</h2>
          <div className="space-y-2.5 md:space-y-4 text-slate-400 leading-relaxed text-xs md:text-base">
            <p>
              My career is defined by a relentless pursuit of technical excellence at the intersection of complex engineering and intuitive design. What began as a fascination with digital logic has evolved into a specialized mastery of architecting scalable full-stack ecosystems and high-performance mobile applications.
            </p>
            <p>
              I specialize in transforming abstract concepts into production-ready solutions that prioritize speed, security, and seamless user interaction. By integrating advanced backend architectures with fluid, high-fidelity interfaces, I deliver digital products that not only function flawlessly but also drive meaningful business impact.
            </p>
          </div>
          <div className="mt-[10px] md:mt-12">
            <a
              href="#"
              className="inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-brand-accent hover:bg-brand-glow text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-accent/20 group"
            >
              <FileDown className="w-5 h-5 group-hover:animate-bounce" />
              Download Full Resume
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="rounded-2xl overflow-hidden glass-card p-6 font-mono text-sm leading-6 border border-brand-accent/30 shadow-2xl shadow-brand-accent/5">
            <div className="flex gap-2 mb-4 border-b border-white/10 pb-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-4 text-xs text-slate-500">aboutMe.ts</span>
            </div>
            <p><span className="text-purple-400">const</span> engineer = {'{'}</p>
            <p className="pl-4">name: <span className="text-brand-glow">'Rity'</span>,</p>
            <p className="pl-4">role: <span className="text-brand-glow">'Lead Independent Architect'</span>,</p>
            <p className="pl-4">specialization: [<span className="text-brand-glow">'Scalable Systems'</span>, <span className="text-brand-glow">'Mobile Ecosystems'</span>, <span className="text-brand-glow">'High-Fidelity UI'</span>],</p>
            <p className="pl-4">execute: (challenge) =&gt; {'{'}</p>
            <p className="pl-8 text-brand-accent">return engineering_rigor + user_centric_design;</p>
            <p className="pl-4">{'}'}</p>
            <p>{'};'}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Journey = () => {
  return (
    <section className="py-8 md:py-0 bg-brand-deep/30 md:bg-transparent h-full">
      <div className="w-full mx-auto px-2.5 md:px-12 lg:px-24">
        <h2 className="text-xl md:text-3xl font-bold text-center mb-2.5 md:mb-16">The Growth Timeline</h2>
        <div className="relative border-l-2 border-brand-accent/20 ml-2.5 md:ml-0">
          {[
            {
              year: '2026 - PRESENT',
              title: 'Lead Independent Architect',
              desc: 'Architecting high-performance digital ecosystems and scalable mobile solutions for international clients. Specializing in modern full-stack engineering and technical strategy.',
              color: 'bg-brand-accent',
              ring: 'ring-brand-accent/20'
            },
            {
              year: '2024 - 2026',
              title: 'Full-Stack Freelance Developer',
              desc: 'Transitioned to modern JavaScript ecosystems (React, Node.js), delivering 15+ end-to-end web applications with a focus on performance and user experience.',
              color: 'bg-brand-indigo',
              ring: 'ring-brand-indigo/20'
            },
            {
              year: '2023 - 2024',
              title: 'Junior Freelance Developer',
              desc: 'Began the journey mastering WordPress and PHP, building custom themes and plugins for local businesses while establishing a strong foundation in web development.',
              color: 'bg-slate-700',
              ring: 'ring-slate-700/20'
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className={`mb-2.5 md:mb-12 ml-8 relative ${idx === 2 ? 'mb-0' : ''}`}
            >
              <div className={`absolute -left-[41px] top-0 w-5 h-5 ${item.color} rounded-full border-4 border-brand-darker ring-4 ${item.ring}`}></div>
              <p className={`${idx === 0 ? 'text-brand-accent' : 'text-slate-500'} font-bold text-[10px] md:text-sm mb-1`}>{item.year}</p>
              <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs md:text-base">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface SkillItemProps {
  name: string;
  val: number;
  color: string;
  barColor: string;
  desc: string;
  key?: string | number;
}

const SkillItem = ({ name, val, color, barColor, desc }: SkillItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between mb-2">
        <span className="text-sm font-semibold cursor-help">{name}</span>
        <span className={`text-xs ${color}`}>{val}%</span>
      </div>
      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${val}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${barColor}`}
        ></motion.div>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-20 bottom-full left-0 mb-3 w-64 p-3 bg-brand-darker border border-white/10 rounded-xl shadow-2xl pointer-events-none"
          >
            <div className="relative">
              <p className="text-xs text-slate-300 leading-relaxed">{desc}</p>
              <div className="absolute top-full left-4 -translate-y-1/2 w-2 h-2 bg-brand-darker border-r border-b border-white/10 rotate-45"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Skills = () => {
  return (
    <section className="py-8 md:py-16" id="skills">
      <div className="w-full mx-auto px-2.5 md:px-12 lg:px-24">
        <div className="text-center mb-2.5 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold mb-1 md:mb-4">Technical Arsenal</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-xs md:text-base">Mastery across the full stack with a special focus on high-fidelity visuals.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-2.5 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-card p-2.5 md:p-8 rounded-2xl"
          >
            <motion.div
              whileHover={{ scale: 1.1, filter: 'brightness(1.2)' }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="w-10 h-10 md:w-12 md:h-12 bg-brand-accent/20 flex items-center justify-center rounded-xl mb-2.5 md:mb-6 text-brand-accent cursor-default"
            >
              <Code2 className="w-5 h-5 md:w-6 md:h-6" />
            </motion.div>
            <h3 className="text-lg md:text-xl font-bold mb-2.5 md:mb-6">Frontend</h3>
            <div className="space-y-2.5 md:space-y-6">
              {[
                { name: 'Web (React / Next.js)', val: 95, desc: 'Building high-performance, scalable web platforms with TypeScript and modern React architecture.' },
                { name: 'Mobile (Kotlin / Flutter / RN)', val: 92, desc: 'Developing high-fidelity cross-platform and native mobile applications with a focus on UX.' },
                { name: 'CMS (WordPress)', val: 88, desc: 'Customizing and managing content-driven sites with flexible and scalable CMS solutions.' }
              ].map(skill => (
                <SkillItem key={skill.name} name={skill.name} val={skill.val} color="text-brand-accent" barColor="bg-brand-accent" desc={skill.desc} />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="glass-card p-2.5 md:p-8 rounded-2xl"
          >
            <motion.div
              whileHover={{ scale: 1.1, filter: 'brightness(1.2)' }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="w-10 h-10 md:w-12 md:h-12 bg-purple-500/20 flex items-center justify-center rounded-xl mb-2.5 md:mb-6 text-purple-400 cursor-default"
            >
              <Server className="w-5 h-5 md:w-6 md:h-6" />
            </motion.div>
            <h3 className="text-lg md:text-xl font-bold mb-2.5 md:mb-6">Backend</h3>
            <div className="space-y-2.5 md:space-y-6">
              {[
                { name: 'Node.js / Express / PHP', val: 92, desc: 'Architecting robust server-side logic and RESTful APIs for complex web systems.' },
                { name: 'PostgreSQL / MongoDB', val: 88, desc: 'Designing and managing efficient relational and NoSQL database schemas for data-heavy apps.' },
                { name: 'Auth & Security (JWT)', val: 90, desc: 'Implementing secure user authentication systems and data protection protocols.' }
              ].map(skill => (
                <SkillItem key={skill.name} name={skill.name} val={skill.val} color="text-purple-400" barColor="bg-purple-400" desc={skill.desc} />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card p-2.5 md:p-8 rounded-2xl"
          >
            <motion.div
              whileHover={{ scale: 1.1, filter: 'brightness(1.2)' }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="w-10 h-10 md:w-12 md:h-12 bg-brand-glow/20 flex items-center justify-center rounded-xl mb-2.5 md:mb-6 text-brand-glow cursor-default"
            >
              <MonitorPlay className="w-5 h-5 md:w-6 md:h-6" />
            </motion.div>
            <h3 className="text-lg md:text-xl font-bold mb-2.5 md:mb-6">Visuals & DevOps</h3>
            <div className="space-y-2.5 md:space-y-6">
              {[
                { name: 'UI/UX Strategy', val: 90, desc: 'Thriving at the intersection of code, design, and user experience for maximum impact.' },
                { name: 'Cloudflare / Docker / Vercel', val: 85, desc: 'Optimizing delivery with Cloudflare (R2, Stream) and modern CI/CD deployment workflows.' },
                { name: 'Framer Motion', val: 95, desc: 'Implementing fluid, production-ready animations and interactive gestures in React.' }
              ].map(skill => (
                <SkillItem key={skill.name} name={skill.name} val={skill.val} color="text-brand-glow" barColor="bg-brand-glow" desc={skill.desc} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ProjectLink = ({ href, icon: Icon, label, className }: { href: string, icon: any, label: string, className: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
      window.open(href, '_blank', 'noopener,noreferrer');
    }, 1000);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`${className} relative flex items-center gap-2 transition-all hover:opacity-80`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Icon className="w-4 h-4" />
      )}
      <span className="text-sm font-medium">{label}</span>
    </a>
  );
};

const Projects = () => {
  const [filter, setFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 4;

  const projects = [
    {
      id: 1,
      title: "Multi-vendor Marketplace",
      category: "Web Apps",
      tags: ["Next.js", "Node.js", "Stripe"],
      desc: "A robust multi-vendor marketplace platform allowing multiple sellers to list products, featuring secure payments, vendor dashboards, and real-time order tracking.",
      img: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80",
      links: { demo: "#", github: "#" }
    },
    {
      id: 2,
      title: "FitTrack Pro Mobile",
      category: "Mobile App Development",
      tags: ["React Native", "Firebase"],
      desc: "A comprehensive fitness tracking application with real-time workout syncing, personalized training plans, and interactive progress visualizations.",
      img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
      links: { demo: "#" }
    },
    {
      id: 3,
      title: "Quantum Dashboard",
      category: "Web Apps",
      tags: ["TypeScript", "Tailwind"],
      desc: "A high-fidelity administrative interface designed for quantum computing startups, featuring real-time telemetry and advanced data filtering capabilities.",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      links: { demo: "#", github: "#" }
    },
    {
      id: 4,
      title: "EcoScan Mobile",
      category: "Mobile App Development",
      tags: ["Flutter", "Dart"],
      desc: "An innovative mobile app that uses AI to identify recyclable materials and provides local recycling guidelines to promote sustainable living.",
      img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80",
      links: { demo: "#" }
    },
    {
      id: 5,
      title: "Stellar CRM",
      category: "Web Apps",
      tags: ["React", "Node.js"],
      desc: "A cloud-based customer relationship management system with automated lead scoring and integrated communication tools.",
      img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
      links: { demo: "#", github: "#" }
    },
    {
      id: 6,
      title: "Pulse Music Player",
      category: "Mobile App Development",
      tags: ["Swift", "Core Audio"],
      desc: "A minimalist music player for iOS featuring high-fidelity audio playback and a unique gesture-based interface.",
      img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
      links: { demo: "#" }
    },
    {
      id: 7,
      title: "Mobile Banking App",
      category: "Mobile App Development",
      tags: ["Kotlin", "Android"],
      desc: "A secure and intuitive mobile banking application built with Kotlin, featuring real-time transaction tracking, biometric authentication, and seamless fund transfers.",
      img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
      links: { demo: "#" }
    },
    {
      id: 8,
      title: "Zenith Task Manager",
      category: "Web Apps",
      tags: ["Vue.js", "Supabase"],
      desc: "A collaborative task management tool with real-time updates, kanban boards, and advanced team reporting.",
      img: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80",
      links: { demo: "#", github: "#" }
    },
    {
      id: 9,
      title: "Bible Project",
      category: "Mobile App Development",
      tags: ["Kotlin", "Android"],
      desc: "A feature-rich mobile application for reading and studying the Bible, built with Kotlin and focusing on offline accessibility and intuitive navigation.",
      img: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=800&q=80",
      links: { demo: "#" }
    }
  ];

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter(p => p.category === filter);

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const prevPageRef = useRef(currentPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Scroll to top of projects section when page changes
  useEffect(() => {
    if (prevPageRef.current === currentPage) {
      return;
    }
    prevPageRef.current = currentPage;

    const element = document.getElementById('projects');
    if (element) {
      const offset = window.innerWidth < 768 ? 80 : 120;
      const rect = element.getBoundingClientRect();
      const absoluteTop = rect.top + window.pageYOffset;
      const finalPosition = absoluteTop - offset;

      window.scrollTo({
        top: finalPosition,
        behavior: 'smooth'
      });
    }
  }, [currentPage]);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  return (
    <section className="py-8 md:py-16 bg-brand-darker" id="projects">
      <div className="w-full mx-auto px-2.5 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-2.5 md:mb-16 gap-2.5">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold mb-1 md:mb-4">Featured Projects</h2>
            <p className="text-slate-400 text-xs md:text-base">A collection of web applications and experimental visuals.</p>
          </div>
          <div className="flex flex-nowrap overflow-x-auto gap-2 pb-2 -mx-2.5 px-2.5 md:mx-0 md:px-0 scrollbar-hide">
            {['All', 'Web Apps', 'Mobile App Development'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${filter === cat
                  ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/30'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          layout
          className="grid md:grid-cols-2 gap-2 md:gap-8"
        >
          <AnimatePresence mode='popLayout'>
            {currentProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group flex flex-col bg-[#1E1B2E] rounded-[2rem] overflow-hidden border border-white/5 transition-all duration-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]"
              >
                {/* Image Container with Gradient Background */}
                <div className={`aspect-[16/10] overflow-hidden relative flex items-center justify-center ${project.category === 'Mobile App Development'
                  ? 'bg-gradient-to-br from-emerald-400 to-teal-600'
                  : 'bg-gradient-to-br from-indigo-500 to-purple-700'
                  }`}>
                  <img
                    alt={project.title}
                    className="w-[85%] h-[85%] object-contain transition-transform duration-700 group-hover:scale-105"
                    src={project.img}
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="p-4 md:p-5 flex flex-col flex-grow">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{project.title}</h3>
                  <p className="text-slate-400 text-sm md:text-base mb-2 line-clamp-2 leading-relaxed">{project.desc}</p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-[11px] font-medium border border-indigo-500/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Pagination Navigation */}
        {totalPages > 1 && (
          <div className="mt-6 md:mt-10 flex justify-center items-center gap-3">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-full border border-white/10 transition-all ${currentPage === 1
                ? 'opacity-30 cursor-not-allowed'
                : 'hover:bg-brand-accent hover:border-brand-accent text-white'
                }`}
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`w-10 h-10 rounded-full font-bold text-sm transition-all border ${currentPage === number
                    ? 'bg-brand-accent border-brand-accent text-white shadow-lg shadow-brand-accent/30'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                    }`}
                >
                  {number}
                </button>
              ))}
            </div>

            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full border border-white/10 transition-all ${currentPage === totalPages
                ? 'opacity-30 cursor-not-allowed'
                : 'hover:bg-brand-accent hover:border-brand-accent text-white'
                }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

const Horizon = () => {
  const [radius, setRadius] = useState(220);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setRadius(130);
      else if (window.innerWidth < 1024) setRadius(160);
      else setRadius(220);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nodes = [
    { icon: Database, label: 'PostgreSQL', color: 'text-blue-400', delay: 0 },
    { icon: Globe, label: 'Edge Network', color: 'text-emerald-400', delay: 0.2 },
    { icon: ShieldCheck, label: 'Auth Service', color: 'text-purple-400', delay: 0.4 },
    { icon: Zap, label: 'Real-time Sync', color: 'text-amber-400', delay: 0.6 },
  ];

  return (
    <section className="pt-8 pb-8 md:py-0 relative overflow-hidden bg-brand-darker/30 md:bg-transparent h-full flex flex-col justify-center" id="horizon">
      <div className="w-full mx-auto px-4 md:px-12 lg:px-24 relative z-10">
        <div className="text-center mb-6 md:mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-3 md:mb-4"
          >
            The <span className="gradient-text">Horizon</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-2xl mx-auto text-sm md:text-lg"
          >
            Architecting high-performance backends that power the next generation of real-time, distributed web applications.
          </motion.p>
        </div>

        <div className="relative h-[300px] md:h-[520px] flex items-center justify-center">
          {/* Central Core */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="relative z-20"
          >
            <div className="w-20 h-20 md:w-32 md:h-32 bg-brand-accent/20 rounded-3xl border border-brand-accent/50 backdrop-blur-xl flex items-center justify-center relative group">
              <div className="absolute inset-0 bg-brand-accent/20 blur-2xl group-hover:bg-brand-accent/40 transition-all duration-500 rounded-full"></div>
              <Server className="w-8 h-8 md:w-14 md:h-14 text-brand-glow relative z-10 animate-pulse" />
              <div className="absolute -bottom-10 md:-bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-[10px] md:text-sm font-mono font-bold text-brand-glow">API CORE v2.0</span>
              </div>
            </div>
          </motion.div>

          {/* Orbiting Nodes */}
          {nodes.map((node, idx) => {
            const angle = (idx * (360 / nodes.length)) * (Math.PI / 180);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <React.Fragment key={idx}>
                {/* Connection Line */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 0.2 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: node.delay + 0.5 }}
                  className="absolute z-0"
                  style={{
                    width: radius,
                    height: '1px',
                    background: `linear-gradient(to right, transparent, var(--color-brand-accent))`,
                    left: '50%',
                    top: '50%',
                    transformOrigin: 'left center',
                    transform: `rotate(${angle}rad)`,
                  }}
                />

                {/* Data Packets */}
                <motion.div
                  animate={{
                    left: ['50%', `calc(50% + ${x}px)`],
                    top: ['50%', `calc(50% + ${y}px)`],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: idx * 0.5,
                    ease: "linear"
                  }}
                  className="absolute w-1 h-1 md:w-1.5 md:h-1.5 bg-brand-glow rounded-full blur-[1px] z-10 -translate-x-1/2 -translate-y-1/2"
                />

                {/* Node */}
                <motion.div
                  initial={{ x: '-50%', y: '-50%', opacity: 0 }}
                  whileInView={{ x: `calc(-50% + ${x}px)`, y: `calc(-50% + ${y}px)`, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 50, delay: node.delay }}
                  className="absolute z-20 left-1/2 top-1/2"
                >
                  <div className="relative group flex items-center justify-center">
                    <div className={`w-10 h-10 md:w-16 md:h-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:border-brand-accent/50 transition-all duration-300 shadow-xl`}>
                      <node.icon className={`w-5 h-5 md:w-8 md:h-8 ${node.color}`} />
                    </div>
                    <div className="absolute -bottom-6 md:-bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
                      <span className="text-[8px] md:text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">
                        {node.label}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </React.Fragment>
            );
          })}

          {/* Background Grid/Circles removed */}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const testimonials = [
    {
      quote: "Working with you was honestly one of the smoothest dev experiences I’ve had. You understood the idea quickly and turned it into something even better than I imagined.",
      author: "Elena Rodriguez",
      company: "CloudScale AI",
      avatar: "https://picsum.photos/seed/elena/100/100"
    },
    {
      quote: "The app you built came out super clean and fast. You clearly care about performance and user experience, not just getting the job done.",
      author: "Adebayo Olusegun",
      company: "Nexus Digital",
      avatar: "https://picsum.photos/seed/adebayo/100/100"
    },
    {
      quote: "You communicate clearly, meet deadlines, and actually think through problems instead of just coding blindly. That really stood out to me.",
      author: "Lisa Thompson",
      company: "GreenLife Apps",
      avatar: "https://picsum.photos/seed/lisa/100/100"
    },
    {
      quote: "Our platform went from slow and clunky to fast and reliable thanks to you. The improvement in performance was very noticeable.",
      author: "Chiamaka Nwosu",
      company: "Vortex Systems",
      avatar: "https://picsum.photos/seed/chiamaka/100/100"
    },
    {
      quote: "I appreciated how you suggested better approaches instead of just doing exactly what I asked. It made the final product much stronger.",
      author: "Sophie Dubois",
      company: "Lumina Tech",
      avatar: "https://picsum.photos/seed/sophie/100/100"
    },
    {
      quote: "The UI you delivered feels modern and smooth, and everything just works. That’s rare.",
      author: "Kofi Mensah",
      company: "Stellar Fintech",
      avatar: "https://picsum.photos/seed/kofi/100/100"
    },
    {
      quote: "You handled both frontend and backend seamlessly, which saved us a lot of time coordinating between different developers.",
      author: "Anna Kowalski",
      company: "DesignFlow",
      avatar: "https://picsum.photos/seed/anna/100/100"
    },
    {
      quote: "You’re very detail-oriented. Even small things like loading states and edge cases were handled properly.",
      author: "Zanele Mbeki",
      company: "Horizon Media",
      avatar: "https://picsum.photos/seed/zanele/100/100"
    },
    {
      quote: "The authentication system you built was secure and easy to use. Exactly what we needed.",
      author: "Robert Smith",
      company: "Legacy Solutions",
      avatar: "https://picsum.photos/seed/robert/100/100"
    },
    {
      quote: "You don’t just build apps—you build solutions. That mindset made a big difference in our project.",
      author: "Kwame Appiah",
      company: "Artisan Goods",
      avatar: "https://picsum.photos/seed/kwame/100/100"
    },
    {
      quote: "You delivered fast without sacrificing quality. That combination is hard to find.",
      author: "Emily Chen",
      company: "Streamline Pro",
      avatar: "https://picsum.photos/seed/emily/100/100"
    },
    {
      quote: "You’re a super reliable developer. Once you commit to something, it gets done—and done well.",
      author: "Thomas Miller",
      company: "Future Ventures",
      avatar: "https://picsum.photos/seed/thomas/100/100"
    },
    {
      quote: "If someone wants a developer who can take an idea and actually bring it to life properly, you’re a solid choice.",
      author: "Rachel Green",
      company: "SecureNet",
      avatar: "https://picsum.photos/seed/rachel/100/100"
    }
  ];

  return (
    <section className="pt-16 pb-8 md:py-16 bg-brand-darker/50" id="testimonials">
      <div className="w-full mx-auto px-2.5 md:px-12 lg:px-24 relative">
        <div className="text-center mb-4 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">Client Voices</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-xs md:text-base">Partnerships built on technical excellence and creative innovation.</p>
        </div>

        {/* Desktop Navigation Buttons */}
        <div className="hidden md:block">
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 lg:left-8 top-[60%] -translate-y-1/2 z-20 bg-brand-darker/80 border border-white/10 p-3 rounded-full hover:bg-brand-accent hover:text-white transition-all shadow-xl backdrop-blur-sm"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 lg:right-8 top-[60%] -translate-y-1/2 z-20 bg-brand-darker/80 border border-white/10 p-3 rounded-full hover:bg-brand-accent hover:text-white transition-all shadow-xl backdrop-blur-sm"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-8 overflow-x-auto overflow-y-hidden pb-8 md:pb-12 pt-2 snap-x snap-mandatory scrollbar-hide"
        >
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="glass-card p-5 md:p-6 rounded-3xl relative group w-[85vw] md:w-[450px] flex-shrink-0 snap-center hover:z-50"
            >
              <Quote className="absolute top-4 right-4 w-6 h-6 text-brand-accent/10 group-hover:text-brand-accent/20 transition-colors" />
              <p className="text-slate-300 italic mb-4 relative z-10 text-sm md:text-base leading-relaxed break-words">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.author} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="font-bold text-white text-sm md:text-base">{t.author}</h4>
                  <p className="text-brand-accent text-[10px] md:text-xs font-bold uppercase tracking-wider">{t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [qrImage, setQrImage] = useState<string>('');
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Small timeout to ensure QRCodeCanvas has rendered the canvas
    const timer = setTimeout(() => {
      const canvas = qrRef.current?.querySelector('canvas');
      if (canvas) {
        setQrImage(canvas.toDataURL('image/png'));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      setErrors({});

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setIsSubmitted(true);
          setFormData({ name: '', email: '', message: '' });
          setTimeout(() => setIsSubmitted(false), 5000);
        } else {
          const data = await response.json().catch(() => ({}));
          const errorMessage = data.details
            ? `${data.error} - ${typeof data.details === 'object' ? JSON.stringify(data.details) : data.details}`
            : data.error || `Server Error ${response.status}: ${response.statusText}`;
          setErrors({ submit: errorMessage });
        }
      } catch (error: any) {
        setErrors({ submit: `Network or Browser Error: ${error.message || 'Please try again later.'}` });
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <section className="pt-4 pb-8 md:py-16 bg-brand-deep/20" id="contact">
      <div className="w-full mx-auto px-2.5 md:px-12 lg:px-24">
        <div className="grid md:grid-cols-2 gap-2.5 md:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-2.5 md:mb-6">Let's Build Something Together</h2>
            <p className="text-slate-400 mb-2.5 md:mb-8 leading-relaxed text-xs md:text-base">
              Whether you're looking to build a high-performance system, need a hand with some complex React logic, or just want to discuss scalable backend architectures, I'm always down to chat. Let's build something awesome together.
            </p>
            <div className="flex flex-row items-center justify-between gap-4">
              <div className="space-y-2.5 md:space-y-6 -translate-y-2 md:-translate-y-4">
                <div className="flex items-center gap-2.5 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand-indigo/50 flex items-center justify-center text-brand-glow">
                    <Mail className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Email Me</p>
                    <p className="text-sm md:text-lg font-semibold">rityxtech@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand-indigo/50 flex items-center justify-center text-brand-glow">
                    <Linkedin className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Connect</p>
                    <p className="text-sm md:text-lg font-semibold">LinkedIn / RityXTech</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div ref={qrRef} className="absolute opacity-0 pointer-events-none -z-10">
                  <QRCodeCanvas
                    value="mailto:rityxtech@gmail.com"
                    size={512}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <div className="p-3 bg-white rounded-2xl w-fit shadow-lg shadow-brand-accent/10">
                  {qrImage ? (
                    <img
                      src={qrImage}
                      alt="Scan to Email"
                      className="w-[100px] h-[100px] md:w-32 md:h-32"
                    />
                  ) : (
                    <div className="w-[100px] h-[100px] md:w-32 md:h-32 bg-slate-100 animate-pulse rounded-lg" />
                  )}
                </div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-0 md:mt-3">Scan to Email</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <form className="glass-card p-2.5 md:p-8 rounded-3xl space-y-2.5 md:space-y-4" onSubmit={handleSubmit}>
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 p-3 rounded-xl text-xs font-bold text-center"
                  >
                    Message sent successfully! I'll get back to you soon.
                  </motion.div>
                )}
                {errors.submit && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-xl text-xs font-bold text-center"
                  >
                    {errors.submit}
                  </motion.div>
                )}
              </AnimatePresence>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 md:mb-2">Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full bg-brand-darker border ${errors.name ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-3 py-2 md:px-4 md:py-3 focus:border-brand-accent focus:ring-0 transition-all text-white outline-none text-sm`}
                  placeholder="John Doe"
                  type="text"
                />
                {errors.name && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase tracking-wider">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 md:mb-2">Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-brand-darker border ${errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-3 py-2 md:px-4 md:py-3 focus:border-brand-accent focus:ring-0 transition-all text-white outline-none text-sm`}
                  placeholder="john@example.com"
                  type="email"
                />
                {errors.email && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase tracking-wider">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 md:mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full bg-brand-darker border ${errors.message ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-3 py-2 md:px-4 md:py-3 focus:border-brand-accent focus:ring-0 transition-all text-white outline-none text-sm min-h-[120px] max-h-[300px] resize-y`}
                  placeholder="How can I help you?"
                  rows={3}
                ></textarea>
                {errors.message && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase tracking-wider">{errors.message}</p>}
              </div>
              <button
                disabled={isLoading}
                className={`w-full py-3 md:py-4 bg-brand-accent hover:bg-brand-glow text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-accent/20 flex items-center justify-center gap-2 text-sm md:text-base ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                type="submit"
              >
                {isLoading ? (
                  <>
                    Processing...
                    <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-4 h-4 md:w-5 md:h-5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="pt-3 pb-24 md:py-6 border-t border-white/5 text-center">
      <div className="w-full mx-auto px-2.5 md:px-12 lg:px-24">
        <div className="flex items-center justify-center text-xl md:text-2xl font-bold tracking-tighter text-white opacity-50 hover:opacity-100 transition-all mb-2 md:mb-3">
          <img
            src="https://i.imgur.com/AVllRQ2.png"
            alt="RityXTech Logo"
            className="h-6 w-6 md:h-7 md:w-7 object-contain"
            referrerPolicy="no-referrer"
          />
          <span>RityX<span className="text-brand-accent">Tech</span></span>
        </div>
        <div className="flex justify-center gap-8 mb-4">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-accent transition-all duration-300 hover:scale-125 hover:rotate-6 hover:drop-shadow-[0_0_15px_#6366f1]">
            <Twitter className="w-7 h-7 md:w-8 md:h-8" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-accent transition-all duration-300 hover:scale-125 hover:-rotate-6 hover:drop-shadow-[0_0_15px_#6366f1]">
            <Instagram className="w-7 h-7 md:w-8 md:h-8" />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-accent transition-all duration-300 hover:scale-125 hover:rotate-6 hover:drop-shadow-[0_0_15px_#6366f1]">
            <Github className="w-7 h-7 md:w-8 md:h-8" />
          </a>
        </div>
        <p className="text-slate-500 text-[10px] md:text-sm">© 2023 RityXTech Portfolio. Built with React & Framer Motion logic.</p>
      </div>
    </footer>
  );
};

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-24 md:bottom-6 right-6 z-50 p-2 md:p-3 bg-brand-accent text-white rounded-full shadow-lg shadow-brand-accent/30 hover:bg-brand-glow transition-all hover:-translate-y-1 active:scale-95 group"
        >
          <ArrowUp className="w-4 h-4 md:w-5 md:h-5 group-hover:animate-bounce" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <PullToRefresh>
      <CustomScrollbar />
      <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden relative">
        <Navbar />
        <main className="flex flex-col md:block">
          <div className="order-none"><Hero /></div>
          <div className="order-none"><Stats /></div>
          <div className="order-none"><Certifications /></div>
          <div className="order-none"><About /></div>

          <div className="contents md:block md:py-16 md:bg-brand-deep/30">
            <div className="contents md:flex md:flex-row md:w-full md:mx-auto">
              <div className="order-1 md:order-none md:w-1/2">
                <Journey />
              </div>
              <div className="order-4 md:order-none md:w-1/2 md:border-l md:border-white/5">
                <Horizon />
              </div>
            </div>
          </div>

          <div className="order-2 md:order-none"><Skills /></div>
          <div className="order-3 md:order-none"><Projects /></div>
          <div className="order-5 md:order-none"><Testimonials /></div>
          <div className="order-6 md:order-none"><Contact /></div>
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </PullToRefresh>
  );
}
