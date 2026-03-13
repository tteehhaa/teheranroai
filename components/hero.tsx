"use client";

export function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-background relative">
      {/* Location Badge - Top Right */}
      <div className="absolute top-6 right-6 md:top-8 md:right-8">
        <span className="text-xs text-gray-400 tracking-wide">Seoul, South Korea</span>
      </div>

      <div className="max-w-2xl mx-auto text-center">
        {/* Main Headline - Premium Serif with only AI italic */}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground font-medium">
          Teheranro <span className="italic">AI</span> Studio
        </h1>
        
        {/* Body Text - Large gap for Zen style */}
        <div className="mt-24 space-y-6">
          <p className="text-lg md:text-xl font-medium text-slate-700 tracking-tight">
            Not to be busy, but to do the right things.
          </p>
          <p className="text-sm md:text-base font-light text-slate-500 leading-loose max-w-lg mx-auto">
            불필요한 분주함 너머, 비즈니스의 본질에 집중합니다.
            <br />
            기술적 논리와 법률적 치밀함으로 설계한 AI 솔루션.
          </p>
        </div>
      </div>
    </section>
  );
}
