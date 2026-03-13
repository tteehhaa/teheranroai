"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";

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

function WaitlistForm({ buttonText }: { buttonText: string }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  if (submitted) {
    return (
      <p className="text-sm text-success font-medium py-3">
        등록되었습니다. 소식을 기다려주세요.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일 주소"
        required
        className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors whitespace-nowrap"
      >
        {buttonText}
      </button>
    </form>
  );
}

export function ProductGallery() {
  return (
    <section id="projects" className="py-24 px-6 bg-background">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col gap-8">
          {/* Card 1: AI Life Shift - Live */}
          <div className="bg-card rounded-2xl border border-border p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <h3 className="text-2xl md:text-3xl font-bold text-card-foreground">
                AI Life Shift
              </h3>
              <Badge label="Live" variant="live" />
            </div>
            
            
            <p className="text-muted-foreground leading-relaxed mb-6">
              당신의 24시간을 분석하여 AI로 대체될 위기와 기회를 진단합니다.
            </p>
            
            <div className="p-4 bg-secondary rounded-lg mb-6">
              <p className="text-sm text-secondary-foreground">
                <span className="font-medium">누적 진단 완료:</span> 3,420건 | <span className="font-medium">절약된 기회비용:</span> ₩1.2B+
              </p>
            </div>
            
            <a
              href="https://ai-shift-compass.lovable.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              지금 진단하기
            </a>
          </div>

          {/* Card 2: Project Pentagon - In Development */}
          <div className="bg-card rounded-2xl border border-border p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <h3 className="text-2xl md:text-3xl font-bold text-card-foreground">
                프로젝트 펜타곤 (가제)
              </h3>
              <Badge label="In Development" variant="development" />
            </div>
            
            <p className="text-muted-foreground leading-relaxed mb-8">
              대중이 가장 큰 위협을 느끼는 상위 5개 업무 영역을 타겟팅한 초자동화(Hyper-automation) 서비스.
            </p>
            
            <WaitlistForm buttonText="출시 알림 받기" />
          </div>

          {/* Card 3: Enterprise Risk Guard - Planning */}
          <div className="bg-card rounded-2xl border border-border p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <h3 className="text-2xl md:text-3xl font-bold text-card-foreground">
                엔터프라이즈 리스크 가드
              </h3>
              <Badge label="Planning" variant="planning" />
            </div>
            
            <p className="text-muted-foreground leading-relaxed mb-8">
              리걸테크 기반의 정교하고 실질적인 B2B AI 컴플라이언스 및 리스크 관리 솔루션.
            </p>
            
            <WaitlistForm buttonText="B2B 소식 받기" />
          </div>
        </div>
      </div>
    </section>
  );
}
