export function AboutMaker() {
  return (
    <section id="about" className="py-20 px-6 bg-background">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-10">
          Philosophy
        </h2>

        <p className="text-base md:text-lg text-slate-600 leading-loose">
          코드 짜다가 계약서 읽는 사람이 만든 프로덕트.
          <br />
          완벽하지 않습니다만, 리스크는 찾아내고 버그는 고칩니다.
        </p>

        {/* Thin divider line */}
        <div className="mt-16 border-t border-foreground/10 max-w-xs mx-auto" />
      </div>
    </section>
  );
}
