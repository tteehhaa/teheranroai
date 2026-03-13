"use client";

export function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-background">
      <div className="max-w-3xl mx-auto text-center">
        {/* Main Headline - Elegant Cursive */}
        <h1 className="font-serif italic text-5xl md:text-7xl lg:text-8xl tracking-tight text-foreground">
          Teheran AI Studio
        </h1>
        
        {/* Korean Sub-Headline */}
        <p className="mt-6 text-xl md:text-2xl text-foreground">
          테헤란로 <span className="font-serif italic">AI</span> 스튜디오
        </p>
        
        {/* Body Text */}
        <div className="mt-12 space-y-4 text-muted-foreground leading-relaxed">
          <p className="text-lg md:text-xl font-medium text-foreground">
            Not to be busy, but to do the right things.
          </p>
          <p className="text-base md:text-lg">
            바쁘게 일하지 않고, 본질적인 일에 집중하도록.
          </p>
          <p className="text-base md:text-lg">
            기술과 법의 교차점에서 일상과 비즈니스의 효율을 찾아봅니다.
          </p>
        </div>
      </div>
    </section>
  );
}
