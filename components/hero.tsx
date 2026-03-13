"use client";

export function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-background">
      <div className="max-w-3xl mx-auto text-center">
        {/* Main Headline - Premium Serif with only AI italic */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight text-foreground font-medium">
          Teheran <span className="italic">AI</span> Studio
        </h1>
        
        {/* Korean Sub-Headline - Modern Sans with wide tracking */}
        <p className="mt-4 text-xs md:text-sm text-muted-foreground uppercase tracking-[0.3em] font-medium">
          테헤란로 AI 스튜디오
        </p>
        
        {/* Body Text - Tighter spacing */}
        <div className="mt-10 space-y-3">
          <p className="text-xl md:text-2xl font-semibold text-slate-800 tracking-tight">
            Not to be busy, but to do the right things.
          </p>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed">
            바쁘게 일하지 않고, 본질적인 일에 집중하도록.
          </p>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed">
            기술과 법의 교차점에서 일상과 비즈니스의 효율을 찾아봅니다.
          </p>
        </div>
      </div>
    </section>
  );
}
