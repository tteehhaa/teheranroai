"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

// Animated Counter Component - refined, subtle, Korean format
function AnimatedCounter({ 
  value, 
  suffix = "",
  prefix = "",
  duration = 2,
  isHovered = false
}: { 
  value: number; 
  suffix?: string;
  prefix?: string;
  duration?: number;
  isHovered?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const spring = useSpring(0, { 
    duration: duration * 1000,
    bounce: 0
  });
  
  const display = useTransform(spring, (current) => {
    if (value >= 1000) {
      return `${prefix}${Math.floor(current).toLocaleString()}${suffix}`;
    }
    if (value < 10) {
      return `${prefix}${current.toFixed(1)}${suffix}`;
    }
    return `${prefix}${Math.floor(current).toLocaleString()}${suffix}`;
  });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      spring.set(value);
      setHasAnimated(true);
    }
  }, [isInView, spring, value, hasAnimated]);

  return (
    <motion.span 
      ref={ref} 
      className={`font-mono font-light text-[1.1rem] tabular-nums transition-colors duration-500 ${
        isHovered ? "text-[#E85D22]" : "text-gray-300"
      }`}
    >
      {display}
    </motion.span>
  );
}

// Live Pulse Indicator
function LivePulse() {
  return (
    <motion.span 
      className="relative flex h-2 w-2"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
    </motion.span>
  );
}

function Badge({ 
  label, 
  variant 
}: { 
  label: string; 
  variant: "live" | "development" | "planning" 
}) {
  const variants = {
    live: "text-success",
    development: "text-warning",
    planning: "text-info",
  };

  const icons = {
    live: <LivePulse />,
    development: <span className="text-xs">&#9203;</span>,
    planning: <span className="text-xs">&#128161;</span>,
  };

  return (
    <span className={`inline-flex items-center gap-2 text-xs font-medium tracking-wide uppercase ${variants[variant]}`}>
      {icons[variant]}
      {label}
    </span>
  );
}

function WaitlistModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setSubmitted(false), 300);
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      {/* Modal */}
      <motion.div 
        className="relative bg-white rounded-lg p-8 md:p-10 shadow-2xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-xl font-semibold text-foreground mb-2">
          출시 알림 신청
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          프로젝트 펜타곤 출시 소식을 가장 먼저 받아보세요.
        </p>

        {submitted ? (
          <div className="py-4 text-center">
            <p className="text-success font-medium text-sm">
              등록되었습니다. 소식을 기다려주세요.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소를 입력하세요"
              required
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#E85D22] focus:border-transparent text-sm transition-all"
              autoFocus
            />
            <button
              type="submit"
              className="w-full px-6 py-3 border border-slate-900 text-slate-900 rounded-full font-medium text-sm hover:bg-[#E85D22] hover:border-[#E85D22] hover:text-white transition-all duration-500"
            >
              알림 신청하기
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

// Card wrapper with hover animation - Minimal with Hermes orange on hover
function ProjectCard({ 
  children, 
  className = "",
  onHoverChange
}: { 
  children: React.ReactNode;
  className?: string;
  onHoverChange?: (isHovered: boolean) => void;
}) {
  return (
    <motion.div 
      className={`bg-background rounded-md p-12 md:p-16 border border-transparent transition-all duration-500 hover:border-[#E85D22]/20 group max-w-xl mx-auto text-center ${className}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => onHoverChange?.(true)}
      onHoverEnd={() => onHoverChange?.(false)}
    >
      {children}
    </motion.div>
  );
}

export function ProductGallery() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <>
      <section id="projects" className="py-32 px-6 bg-background">
        <div className="max-w-xl mx-auto">
          {/* Section Header - Centered */}
          <div className="flex items-center justify-center gap-6 mb-32">
            <div className="w-16 h-px bg-foreground/10" />
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Projects
            </h2>
            <div className="w-16 h-px bg-foreground/10" />
          </div>

          <div className="flex flex-col gap-32">
            {/* Card 1: AI Life Shift - Live */}
            <ProjectCard onHoverChange={(h) => setHoveredCard(h ? "card1" : null)}>
              <div className="flex flex-col items-center gap-3 mb-10">
                <h3 className="text-lg font-semibold text-foreground tracking-tight">
                  AI 일상 진단 : AI Life Shift
                </h3>
                <Badge label="Live" variant="live" />
              </div>
          
              <p className="text-sm text-muted-foreground leading-loose mb-12 max-w-md mx-auto">
                하루 24시간의 업무와 일상을 분석하여,<br />
                AI로 대체될 위기와 새로운 기회를 진단합니다.
              </p>
              
              {/* Stats - Horizontal inline layout with divider, Korean format */}
              <div className="flex items-center justify-center gap-6 mb-12 text-sm">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-muted-foreground text-xs">누적 진단 완료</span>
                  <AnimatedCounter value={3420} suffix="건" isHovered={hoveredCard === "card1"} />
                </div>
                <div className="w-px h-8 bg-foreground/10" />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-muted-foreground text-xs">절약된 가치</span>
                  <span className={`font-mono font-light text-[1.1rem] tabular-nums transition-colors duration-500 ${
                    hoveredCard === "card1" ? "text-[#E85D22]" : "text-gray-300"
                  }`}>
                    약 10억 원+
                  </span>
                </div>
              </div>
              
              <a
                href="https://ai-shift-compass.lovable.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-2.5 border border-slate-900 text-slate-900 rounded-full text-sm font-medium hover:bg-[#E85D22] hover:border-[#E85D22] hover:text-white transition-all duration-500"
              >
                지금 진단하기
              </a>
            </ProjectCard>

            {/* Card 2: Project Pentagon - In Development */}
            <ProjectCard>
              <div className="flex flex-col items-center gap-3 mb-10">
                <h3 className="text-lg font-semibold text-foreground tracking-tight">
                  프로젝트 펜타곤
                </h3>
                <Badge label="In Development" variant="development" />
              </div>
              
              <p className="text-sm text-muted-foreground leading-loose mb-12 max-w-md mx-auto">
                사용자들이 가장 큰 위협을 느끼는<br />
                상위 3개 업무 영역을 타겟팅한 초자동화 서비스.
              </p>
              
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center px-6 py-2.5 border border-slate-900 text-slate-900 rounded-full text-sm font-medium hover:bg-[#E85D22] hover:border-[#E85D22] hover:text-white transition-all duration-500"
              >
                출시 알림 신청하기
              </button>
            </ProjectCard>

            {/* Card 3: Enterprise Risk Guard - Planning */}
            <ProjectCard>
              <div className="flex flex-col items-center gap-3 mb-10">
                <h3 className="text-lg font-semibold text-foreground tracking-tight">
                  엔터프라이즈 리스크 진단
                </h3>
                <Badge label="Planning" variant="planning" />
              </div>
              
              <p className="text-sm text-muted-foreground leading-loose mb-12 max-w-md mx-auto">
                리걸테크 기반의 정교하고 실질적인<br />
                B2B AI 컴플라이언스 및 리스크 관리 솔루션.
              </p>
              
              <a
                href="mailto:teheranroai@gmail.com?subject=B2B 제휴 및 도입 문의&body=안녕하세요, 엔터프라이즈 리스크 가드 도입에 관해 문의드립니다."
                className="inline-flex items-center justify-center px-6 py-2.5 border border-slate-900 text-slate-900 rounded-full text-sm font-medium hover:bg-[#E85D22] hover:border-[#E85D22] hover:text-white transition-all duration-500"
              >
                B2B 제휴 및 도입 문의
              </a>
            </ProjectCard>
          </div>
        </div>
      </section>

      {/* Waitlist Modal */}
      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
