"use client";

import { useState } from "react";
import { ExternalLink, X } from "lucide-react";

function Badge({ 
  label, 
  variant 
}: { 
  label: string; 
  variant: "live" | "development" | "planning" 
}) {
  const variants = {
    live: "bg-success/10 text-success",
    development: "bg-warning/10 text-warning",
    planning: "bg-info/10 text-info",
  };

  const icons = {
    live: <span className="w-2 h-2 rounded-full bg-success animate-pulse" />,
    development: <span className="text-sm">&#9203;</span>,
    planning: <span className="text-sm">&#128161;</span>,
  };

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className="relative bg-card rounded-2xl border border-border p-8 md:p-10 shadow-2xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-2xl font-bold text-card-foreground mb-2">
          출시 알림 신청
        </h3>
        <p className="text-muted-foreground mb-6">
          프로젝트 펜타곤 출시 소식을 가장 먼저 받아보세요.
        </p>

        {submitted ? (
          <div className="py-4 text-center">
            <p className="text-success font-medium">
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
              className="w-full px-4 py-3 rounded-full border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
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
      </div>
    </div>
  );
}

export function ProductGallery() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section id="projects" className="py-20 px-6 bg-background">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col gap-6">
            {/* Card 1: AI Life Shift - Live */}
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <h3 className="text-xl md:text-2xl font-semibold text-card-foreground">
                  AI Life Shift
                </h3>
                <Badge label="Live" variant="live" />
              </div>
          
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                당신의 24시간을 분석하여 AI로 대체될 위기와 기회를 진단합니다.
              </p>
              
              <div className="p-3 bg-secondary rounded-lg mb-5">
                <p className="text-xs text-secondary-foreground">
                  <span className="font-medium">누적 진단 완료:</span> 3,420건 | <span className="font-medium">절약된 기회비용:</span> ₩1.2B+
                </p>
              </div>
              
              <a
                href="https://ai-shift-compass.lovable.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                지금 진단하기
              </a>
            </div>

            {/* Card 2: Project Pentagon - In Development */}
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <h3 className="text-xl md:text-2xl font-semibold text-card-foreground">
                  프로젝트 펜타곤
                </h3>
                <Badge label="In Development" variant="development" />
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                사용자들이 가장 큰 위협을 느끼는 상위 3개 업무 영역을 타겟팅한 초자동화(Hyper-automation) 서비스.
              </p>
              
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                출시 알림 신청하기
              </button>
            </div>

            {/* Card 3: Enterprise Risk Guard - Planning */}
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <h3 className="text-xl md:text-2xl font-semibold text-card-foreground">
                  엔터프라이즈 리스크 진단
                </h3>
                <Badge label="Planning" variant="planning" />
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                리걸테크 기반의 정교하고 실질적인 B2B AI 컴플라이언스 및 리스크 관리 솔루션.
              </p>
              
              <a
                href="mailto:teheranroai@gmail.com?subject=B2B 제휴 및 도입 문의&body=안녕하세요, 엔터프라이즈 리스크 가드 도입에 관해 문의드립니다."
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                B2B 제휴 및 도입 문의
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Modal */}
      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
