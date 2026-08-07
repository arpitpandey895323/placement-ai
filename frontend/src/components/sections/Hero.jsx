import { useEffect, useState } from "react";
import {
  ArrowRight,
  FileText,
  MessageSquare,
  Play,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

function useCountUp(target, duration = 1600, delay = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame;
    const timeout = setTimeout(() => {
      const start = performance.now();

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(target * eased));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };

      frame = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [target, duration, delay]);

  return value;
}

function ScoreRing({ score, color, size = 56, stroke = 4, delay = 0 }) {
  const animatedScore = useCountUp(score, 1600, delay);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-white/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${color})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-300"
        />
        <defs>
          <linearGradient id={color} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
        {animatedScore}
      </span>
    </div>
  );
}

function MetricRow({ icon: Icon, label, score, delay }) {
  const animatedScore = useCountUp(score, 1600, delay);

  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20">
        <Icon className="h-5 w-5 text-blue-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-zinc-400">{label}</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="hero-progress-bar h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
            style={{
              width: `${animatedScore}%`,
              animationDelay: `${delay}ms`,
            }}
          />
        </div>
      </div>
      <span className="text-lg font-semibold tabular-nums text-white">
        {animatedScore}
      </span>
    </div>
  );
}

function DashboardPreview() {
  const placementScore = useCountUp(87, 1800, 200);

  return (
    <div className="hero-float relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-blue-500/40 via-violet-500/20 to-transparent opacity-60 blur-sm" />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 shadow-2xl shadow-blue-500/10 backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.08),_transparent_60%)]" />

        <div className="relative border-b border-white/5 px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Live Dashboard
              </p>
              <p className="mt-0.5 text-sm font-medium text-white">
                Career Readiness
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs font-medium text-emerald-400">Active</span>
            </div>
          </div>
        </div>

        <div className="relative space-y-5 p-5">
          <div className="flex items-center gap-5 rounded-xl border border-white/5 bg-gradient-to-br from-blue-500/10 to-violet-500/5 p-5">
            <ScoreRing score={87} color="placement-gradient" size={72} stroke={5} delay={200} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-400" />
                <p className="text-sm text-zinc-400">Placement Score</p>
              </div>
              <p className="mt-1 text-3xl font-bold tracking-tight text-white">
                {placementScore}
                <span className="text-lg font-normal text-zinc-500">/100</span>
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+12% this week</span>
              </div>
            </div>
          </div>

          <MetricRow
            icon={FileText}
            label="Resume ATS Score"
            score={92}
            delay={400}
          />
          <MetricRow
            icon={MessageSquare}
            label="Interview Score"
            score={78}
            delay={600}
          />

          <div className="flex items-end gap-1.5 pt-1">
            {[40, 65, 45, 80, 55, 90, 70, 85].map((h, i) => (
              <div
                key={i}
                className="hero-bar flex-1 rounded-sm bg-gradient-to-t from-blue-600/80 to-violet-400/80"
                style={{
                  height: `${h * 0.5}px`,
                  animationDelay: `${800 + i * 80}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute top-20 -right-32 h-[400px] w-[400px] rounded-full bg-violet-600/15 blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 sm:px-8 sm:pb-32 sm:pt-28 lg:px-12 lg:pb-40 lg:pt-32">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-12">
          <div className="mx-auto max-w-xl text-center lg:mx-0 lg:max-w-none lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              <span className="text-xs font-medium tracking-wide text-zinc-300">
                AI-Powered Career Intelligence
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              Navigate Your Career with{" "}
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-violet-300 bg-clip-text text-transparent">
                AI
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg lg:mx-0">
              CareerPilot AI helps students prepare smarter with AI-powered resume
              analysis, mock interviews, coding roadmaps, and personalized job
              recommendations.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <button
                type="button"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:brightness-110 sm:w-auto"
              >
                Start Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10 sm:w-auto"
              >
                <Play className="h-4 w-4 fill-current text-zinc-300" />
                Watch Demo
              </button>
            </div>

            <p className="mt-6 text-xs text-zinc-500">
              No credit card required · Free plan available
            </p>
          </div>

          <div className="relative lg:pl-4">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
