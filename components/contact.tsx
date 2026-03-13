export function Contact() {
  return (
    <section id="contact" className="py-20 px-6 bg-background">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-6">
          비즈니스 및 제휴 문의
        </p>

        <a
          href="mailto:teheranroai@gmail.com"
          className="font-serif italic text-2xl md:text-3xl lg:text-4xl text-foreground hover:text-accent transition-colors duration-200 cursor-pointer"
        >
          teheranroai@gmail.com
        </a>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="py-10 px-6 border-t border-border bg-background">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs text-muted-foreground">
          © 2026 Teheranro AI Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
