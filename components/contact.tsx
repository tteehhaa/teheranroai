export function Contact() {
  return (
    <section id="contact" className="py-24 px-6 bg-background">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-8">
          비즈니스 및 제휴 문의
        </p>

        <a
          href="mailto:teheranroai@gmail.com"
          className="font-serif italic text-3xl md:text-4xl lg:text-5xl text-foreground hover:text-accent transition-colors duration-200 cursor-pointer"
        >
          teheranroai@gmail.com
        </a>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border bg-background">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-sm text-muted-foreground">
          © 2026 Teheran-ro AI Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
