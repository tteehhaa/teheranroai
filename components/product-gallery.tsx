"use client";

import { useState, useEffect, useRef } from "react";
import { X, TrendingUp } from "lucide-react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

// Animated Counter Component
function AnimatedCounter({ 
  value, 
  suffix = "",
  prefix = "",
  duration = 2 
}: { 
  value: number; 
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const spring = useSpring(0, { 
    duration: duration * 1000,
    bounce: 0
  });
  
  const display = useTransform(spring, (current) => {
    if (value >= 1000) {
      return `${prefix}${Math.floor(current).toLocaleString()}${suffix}`;
    }
    return `${prefix}${Math.floor(current).toLocaleString()}${suffix}`;
  });

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, spring, value]);

  return (
    <motion.span 
      ref={ref} 
      className="font-mono font-semibold text-foreground tabular-nums"
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
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
              autoFocus
            />
            <button
              type="submit"
              className="w-full px-6 py-3 bg-slate-900 text-white rounded-full font-medium text-sm hover:bg-slate-800 transition-colors"
            >
              알림 신청하기
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

// Card wrapper with hover animation
function ProjectCard({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div 
      className={`bg-[#F9F9F9] rounded-lg p-8 md:p-10 transition-all duration-300 hover:shadow-lg ${className}`}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

export function ProductGallery() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section id="projects" className="py-24 px-6 bg-background">
        <div className="max-w-2xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center gap-4 mb-16">
            <div className="flex-1 h-px bg-foreground/10" />
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Projects
            </h2>
          </div>

          <div className="flex flex-col gap-20">
            {/* Card 1: AI Life Shift - Live */}
            <ProjectCard>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
                <h3 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">
                  AI Life Shift
                </h3>
                <Badge label="Live" variant="live" />
              </div>
          
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                당신의 24시간을 분석하여 AI로 대체될 위기와 기회를 진단합니다.
              </p>
              
              {/* Animated Stats */}
              <div className="flex flex-col sm:flex-row gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground mb-1">누적 진단 완료</span>
                    <div className="flex items-center gap-2">
                      <AnimatedCounter value={3420} suffix="건" />
                      <motion.span
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <TrendingUp className="w-3 h-3 text-success" />
                      </motion.span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground mb-1">절약된 기회비용</span>
                    <div className="flex items-center gap-2">
                      <AnimatedCounter value={1.2} prefix="₩" suffix="B+" duration={2.5} />
                      <motion.span
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                      >
                        <TrendingUp className="w-3 h-3 text-success" />
                      </motion.span>
                    </div>
                  </div>
                </div>
              </div>
              
              <a
                href="https://ai-shift-compass.lovable.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                지금 진단하기
              </a>
            </ProjectCard>

            {/* Card 2: Project Pentagon - In Development */}
            <ProjectCard>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
                <h3 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">
                  프로젝트 펜타곤
                </h3>
                <Badge label="In Development" variant="development" />
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                사용자들이 가장 큰 위협을 느끼는 상위 3개 업무 영역을 타겟팅한 초자동화(Hyper-automation) 서비스.
              </p>
              
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                출시 알림 신청하기
              </button>
            </ProjectCard>

            {/* Card 3: Enterprise Risk Guard - Planning */}
            <ProjectCard>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
                <h3 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">
                  엔터프라이즈 리스크 진단
                </h3>
                <Badge label="Planning" variant="planning" />
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                리걸테크 기반의 정교하고 실질적인 B2B AI 컴플라이언스 및 리스크 관리 솔루션.
              </p>
              
              <a
                href="mailto:teheranroai@gmail.com?subject=B2B 제휴 및 도입 문의&body=안녕하세요, 엔터프라이즈 리스크 가드 도입에 관해 문의드립니다."
                className="inline-flex items-center justify-center px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-colors"
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
