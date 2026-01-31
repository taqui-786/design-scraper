export function HeroSection({ result }: { result: boolean }) {
  return (
    <div
      className={`transition-all duration-700 ease-out relative ${
        result ? "opacity-0 h-0 overflow-hidden mb-0" : "opacity-100 mb-20"
      }`}
    >
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50 animate-pulse-slow" />

      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10 pt-12">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-foreground leading-[1.1] md:leading-[1.1] text-balance">
          Don't Just Scrape Websites,
          <br />
          Extract{" "}
          <span className="relative inline-block px-4 ml-1 transform -rotate-1">
            <span className="absolute inset-0 bg-primary/5 rounded-xl border border-primary/10 shadow-[0_4px_24px_-8px_rgba(var(--primary),0.2)] -skew-x-2" />
            <span className="relative bg-linear-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x bg-size-[200%_auto] pb-2 font-black tracking-tight filter drop-shadow-xs">
              Design Systems.
            </span>
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground/80 leading-relaxed max-w-2xl mx-auto font-medium">
          Extract 50+ data points including{" "}
          <span className="text-foreground font-semibold">Colors</span>,{" "}
          <span className="text-foreground font-semibold">Typography</span>, and{" "}
          <span className="text-foreground font-semibold">Brand Vibe</span>.
          Understand design patterns instantly.
        </p>

        <div className="absolute top-20 right-[5%] w-24 h-24 border border-dashed border-primary/20 rounded-full animate-float-delayed opacity-30" />
        <div className="absolute bottom-10 left-[5%] w-16 h-16 border border-dashed border-purple-500/20 rounded-xl rotate-12 animate-float opacity-30" />
      </div>
    </div>
  );
}
