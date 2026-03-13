export function AboutMaker() {
  return (
    <section id="about" className="py-20 px-6 bg-background">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-10">
          Philosophy
        </h2>

        <p className="text-base md:text-lg text-slate-600 leading-loose">
          엔지니어의 시스템적 사고와 변호사의 리스크 매니지먼트.
          <br />
          두 세계의 시선을 연결하여, 실질적인 효용을 만드는 프로덕트를 설계합니다.
        </p>

        {/* Thin divider line */}
        <div className="mt-16 border-t border-foreground/10 max-w-xs mx-auto" />
      </div>
    </section>
  );
}
