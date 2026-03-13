import { Mail, Coffee } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-24 px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance leading-tight">
          새로운 혁신을 함께 만들어갈
          <br className="hidden md:block" />
          파트너를 찾습니다.
        </h2>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="mailto:contact@teheranro.ai"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Mail className="w-5 h-5" />
            비즈니스 및 제휴 제안하기
          </a>
          <a
            href="mailto:coffee@teheranro.ai?subject=커피챗 신청"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-border text-foreground rounded-lg font-medium hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Coffee className="w-5 h-5" />
            가볍게 커피챗 신청하기
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-sm text-muted-foreground">
          © 2026 Teheran-ro AI Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
