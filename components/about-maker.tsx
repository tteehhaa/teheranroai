import { Code2, Scale, Lightbulb } from "lucide-react";

export function AboutMaker() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            About
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-foreground">
            Who is the Maker?
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Abstract Avatar / Graphic */}
          <div className="flex justify-center lg:justify-end order-2 lg:order-1">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Abstract minimalist graphic */}
              <div className="absolute inset-0 bg-primary/5 rounded-3xl rotate-6" />
              <div className="absolute inset-0 bg-primary/10 rounded-3xl -rotate-3" />
              <div className="absolute inset-0 bg-card rounded-3xl border border-border shadow-lg flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Code2 className="w-8 h-8 text-primary" />
                    </div>
                    <div className="w-8 h-0.5 bg-border" />
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Scale className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-0.5 h-8 bg-border" />
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
                    <Lightbulb className="w-8 h-8 text-primary-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="order-1 lg:order-2">
            <p className="text-2xl md:text-3xl font-bold text-foreground leading-snug mb-8">
              전직 6년 차 소프트웨어 개발자.
              <br />
              현직 뉴욕주 변호사.
            </p>
            <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
              <p className="text-pretty">
                글로벌 IT 기업에서 C++ 코드를 짜며 하드웨어와 소프트웨어를 최적화하던 엔지니어가,
                글로벌 로펌에서 복잡한 규제와 기술 리스크를 조율하는 변호사가 되었습니다.
              </p>
              <p className="text-pretty">
                이제는 테헤란로에서 기술과 법의 경계를 넘어,
                세상에 꼭 필요한 AI 프로덕트를 직접 만듭니다.
              </p>
            </div>

            {/* Credential Badges */}
            <div className="mt-10 flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-secondary rounded-full text-sm font-medium text-secondary-foreground">
                Software Engineer
              </span>
              <span className="px-4 py-2 bg-secondary rounded-full text-sm font-medium text-secondary-foreground">
                NY Bar Licensed
              </span>
              <span className="px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
                AI Product Maker
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
