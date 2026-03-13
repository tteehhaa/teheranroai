"use client";

import { TrendingUp, Bell, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  title: string;
  badge: {
    label: string;
    icon: string;
    variant: "active" | "development" | "planning";
  };
  description: string;
  stats?: {
    label1: string;
    value1: string;
    label2: string;
    value2: string;
  };
  button: {
    label: string;
    variant: "primary" | "secondary" | "outline";
  };
}

const products: ProductCardProps[] = [
  {
    title: "AI Life Shift",
    badge: { label: "운영 중", icon: "active", variant: "active" },
    description: "당신의 24시간을 분석하여 AI로 대체될 위기와 기회를 진단합니다.",
    stats: {
      label1: "누적 참여자",
      value1: "12,450명",
      label2: "발견된 기회비용 가치",
      value2: "₩4.2B+",
    },
    button: { label: "직접 진단해보기", variant: "primary" },
  },
  {
    title: "프로젝트 펜타곤 (가제)",
    badge: { label: "개발 중", icon: "development", variant: "development" },
    description: "대중이 가장 큰 위협을 느끼는 상위 5개 업무 영역을 타겟팅한 초자동화(Hyper-automation) 서비스.",
    stats: {
      label1: "분석된 위협 데이터",
      value1: "54,000건",
      label2: "자동화 목표 시간",
      value2: "100만 시간",
    },
    button: { label: "출시 알림 받기", variant: "secondary" },
  },
  {
    title: "엔터프라이즈 리스크 가드",
    badge: { label: "기획 중", icon: "planning", variant: "planning" },
    description: "리걸테크 기반의 정교하고 실질적인 B2B AI 컴플라이언스 및 리스크 관리 솔루션.",
    button: { label: "B2B 도입 문의하기", variant: "outline" },
  },
];

function StatDisplay({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <TrendingUp className="w-4 h-4 text-success flex-shrink-0" />
      <div className="text-sm">
        <span className="text-muted-foreground">{label}: </span>
        <span className="font-semibold text-foreground">{value}</span>
      </div>
    </div>
  );
}

function Badge({ label, variant }: { label: string; variant: "active" | "development" | "planning" }) {
  const variants = {
    active: "bg-success/10 text-success",
    development: "bg-warning/10 text-warning",
    planning: "bg-info/10 text-info",
  };

  const icons = {
    active: <span className="w-2 h-2 rounded-full bg-success animate-pulse" />,
    development: <span className="w-2 h-2 rounded-full bg-warning" />,
    planning: <span className="w-2 h-2 rounded-full bg-info" />,
  };

  return (
    <span className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium", variants[variant])}>
      {icons[variant]}
      {label}
    </span>
  );
}

function ProductCard({ title, badge, description, stats, button }: ProductCardProps) {
  const buttonVariants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border-2 border-border text-foreground hover:bg-secondary",
  };

  const buttonIcons = {
    primary: null,
    secondary: <Bell className="w-4 h-4" />,
    outline: <MessageSquare className="w-4 h-4" />,
  };

  return (
    <div className="group bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="text-xl md:text-2xl font-bold text-card-foreground">{title}</h3>
          <Badge label={badge.label} variant={badge.variant} />
        </div>
        
        <p className="text-muted-foreground leading-relaxed mb-6 text-pretty">
          {description}
        </p>
        
        {stats && (
          <div className="flex flex-col gap-2 mb-6 p-4 bg-muted rounded-lg">
            <StatDisplay label={stats.label1} value={stats.value1} />
            <StatDisplay label={stats.label2} value={stats.value2} />
          </div>
        )}
        
        <div className="mt-auto">
          <button
            className={cn(
              "w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              buttonVariants[button.variant]
            )}
          >
            {buttonIcons[button.variant]}
            {button.label}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductGallery() {
  return (
    <section id="projects" className="py-24 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Projects
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-foreground">
            진행 중인 프로젝트
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.title} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
