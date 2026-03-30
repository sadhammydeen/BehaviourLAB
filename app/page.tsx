"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"

declare global {
  interface Window {
    AOS: {
      init: (options?: object) => void
      refresh: () => void
    }
    Chart: typeof import("chart.js")
  }
}

export default function BehaviouralEconomicsPage() {
  const [scrolled, setScrolled] = useState(false)
  const [chartsInitialized, setChartsInitialized] = useState(false)
  const barChartRef = useRef<HTMLCanvasElement>(null)
  const lineChartRef = useRef<HTMLCanvasElement>(null)
  const barChartInstance = useRef<InstanceType<typeof window.Chart> | null>(null)
  const lineChartInstance = useRef<InstanceType<typeof window.Chart> | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Counter animation for stats
  useEffect(() => {
    const counters = document.querySelectorAll("[data-counter]")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement
            const end = parseFloat(target.dataset.counter || "0")
            const suffix = target.dataset.suffix || ""
            const prefix = target.dataset.prefix || ""
            const duration = 1500
            const startTime = performance.now()

            const animate = (currentTime: number) => {
              const elapsed = currentTime - startTime
              const progress = Math.min(elapsed / duration, 1)
              const easeOut = 1 - Math.pow(1 - progress, 3)
              const current = end * easeOut

              if (end % 1 === 0) {
                target.textContent = prefix + Math.floor(current).toLocaleString() + suffix
              } else {
                target.textContent = prefix + current.toFixed(2) + suffix
              }

              if (progress < 1) {
                requestAnimationFrame(animate)
              }
            }
            requestAnimationFrame(animate)
            observer.unobserve(target)
          }
        })
      },
      { threshold: 0.5 }
    )

    counters.forEach((counter) => observer.observe(counter))
    return () => observer.disconnect()
  }, [])

  const initCharts = () => {
    if (chartsInitialized || !window.Chart || !barChartRef.current || !lineChartRef.current) return

    // Destroy existing charts if they exist
    if (barChartInstance.current) {
      barChartInstance.current.destroy()
    }
    if (lineChartInstance.current) {
      lineChartInstance.current.destroy()
    }

    // Bar Chart
    const barCtx = barChartRef.current.getContext("2d")
    if (barCtx) {
      barChartInstance.current = new window.Chart(barCtx, {
        type: "bar",
        data: {
          labels: ["Standard Framing", "Loss-Protection Framing", "Default Enrolment"],
          datasets: [
            {
              label: "Enrolment Rate %",
              data: [23, 51, 78],
              backgroundColor: "#2563EB",
              borderColor: "#0D0D0D",
              borderWidth: 3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 1200,
            easing: "easeOutQuart",
          },
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              grid: {
                color: "#0D0D0D20",
              },
              ticks: {
                font: {
                  family: "Space Grotesk",
                },
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                font: {
                  family: "Space Grotesk",
                  size: 11,
                },
              },
            },
          },
        },
      })
    }

    // Line Chart
    const lineCtx = lineChartRef.current.getContext("2d")
    if (lineCtx) {
      lineChartInstance.current = new window.Chart(lineCtx, {
        type: "line",
        data: {
          labels: ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6", "Month 7", "Month 8", "Month 9", "Month 10", "Month 11", "Month 12"],
          datasets: [
            {
              label: "Actual Value",
              data: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
              borderColor: "#0D9E75",
              backgroundColor: "#0D9E7520",
              borderWidth: 3,
              tension: 0,
              fill: false,
            },
            {
              label: "Perceived Value",
              data: [100, 72, 52, 38, 28, 22, 18, 15, 13, 12, 11, 10],
              borderColor: "#FF5C00",
              backgroundColor: "#FF5C0020",
              borderWidth: 3,
              tension: 0.3,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 1200,
            easing: "easeOutQuart",
          },
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                font: {
                  family: "Space Grotesk",
                },
              },
            },
            annotation: {
              annotations: {
                regretZone: {
                  type: "label",
                  xValue: 5,
                  yValue: 60,
                  content: ["Regret Zone"],
                  font: {
                    family: "Space Mono",
                    size: 12,
                  },
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 120,
              grid: {
                color: "#0D0D0D20",
              },
              ticks: {
                font: {
                  family: "Space Grotesk",
                },
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                font: {
                  family: "Space Grotesk",
                  size: 10,
                },
              },
            },
          },
        },
      })
    }

    setChartsInitialized(true)
  }

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"
        onLoad={() => {
          window.AOS?.init({ duration: 700, once: true, offset: 80 })
        }}
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js"
        onLoad={initCharts}
      />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" />

      <div className="min-h-screen bg-[#FFFBF0] antialiased">
        {/* STICKY NAV */}
        <nav
          className={`fixed top-0 left-0 right-0 z-50 bg-[#FFFBF0] border-b-3 border-[#0D0D0D] transition-all duration-300 ${scrolled ? "shadow-[0_4px_0px_#0D0D0D]" : ""}`}
        >
          <div className="max-w-6xl mx-auto px-8 py-5 flex items-center justify-between">
            <span className="font-fraunces text-xl font-bold text-[#0D0D0D] tracking-tight">BehaviourLab</span>
            <div className="hidden md:flex items-center gap-10">
              {[
                { href: "#problem", label: "About" },
                { href: "#biases", label: "Concepts" },
                { href: "#evidence", label: "Data" },
                { href: "#solutions", label: "Solutions" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-mono text-xs uppercase tracking-widest text-[#0D0D0D] hover:text-[#FF5C00] transition-colors relative group py-1"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#FF5C00] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>
            <a
              href="#references"
              className="brutal-btn bg-[#FF5C00] text-white font-mono text-xs uppercase tracking-wider px-5 py-2.5 border-3 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] hover:shadow-[6px_6px_0px_#0D0D0D] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              Read the Study
            </a>
          </div>
        </nav>

        {/* SECTION 1 — HERO */}
        <section className="min-h-screen bg-[#0D0D0D] pt-28 pb-20 flex flex-col justify-center relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-8">
            <span className="inline-block bg-[#FF5C00] text-white font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-2 mb-10">
              Behavioural Economics
            </span>
            <h1 className="font-fraunces text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-8 max-w-4xl text-balance">
              Why People Avoid Insurance Even When It Helps Them
            </h1>
            <p className="font-grotesk text-lg md:text-xl text-[#999999] max-w-2xl mb-16 leading-relaxed">
              A behavioural economics deep-dive into the psychology of risk avoidance, present bias, and the hidden cost of doing nothing.
            </p>

            {/* Stat Callouts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14" data-aos="fade-up">
              <div className="brutal-card-dark bg-[#161616] border-3 border-[#FF5C00] p-8 shadow-[4px_4px_0px_#FF5C00] hover:shadow-[6px_6px_0px_#FF5C00] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                <span className="font-fraunces text-5xl md:text-6xl font-bold text-white" data-counter="67" data-suffix="%">0%</span>
                <p className="font-grotesk text-sm text-[#888888] mt-3 leading-relaxed">of eligible individuals skip voluntary schemes</p>
              </div>
              <div className="brutal-card-dark bg-[#161616] border-3 border-[#FF5C00] p-8 shadow-[4px_4px_0px_#FF5C00] hover:shadow-[6px_6px_0px_#FF5C00] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                <span className="font-fraunces text-5xl md:text-6xl font-bold text-white" data-counter="2.25" data-suffix="x">0x</span>
                <p className="font-grotesk text-sm text-[#888888] mt-3 leading-relaxed">more pain from loss than pleasure from gain</p>
              </div>
              <div className="brutal-card-dark bg-[#161616] border-3 border-[#FF5C00] p-8 shadow-[4px_4px_0px_#FF5C00] hover:shadow-[6px_6px_0px_#FF5C00] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                <span className="font-fraunces text-5xl md:text-6xl font-bold text-white" data-counter="3500000" data-prefix="" data-suffix="">0</span>
                <p className="font-grotesk text-sm text-[#888888] mt-3 leading-relaxed">fake accounts — Wells Fargo&apos;s incentive failure</p>
              </div>
            </div>

            <a
              href="#problem"
              className="brutal-btn inline-flex items-center gap-3 bg-[#FFE500] text-[#0D0D0D] font-mono text-xs uppercase tracking-wider px-8 py-4 border-3 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] hover:shadow-[6px_6px_0px_#0D0D0D] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              Explore the Psychology
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </div>

          {/* Marquee Ticker */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#FF5C00] border-t-3 border-[#0D0D0D] py-3 overflow-hidden">
            <div className="marquee-container">
              <div className="marquee-content font-mono text-xs uppercase tracking-[0.15em] text-[#0D0D0D] font-medium">
                LOSS AVERSION · PRESENT BIAS · PROSPECT THEORY · AMBIGUITY AVERSION · CHOICE ARCHITECTURE · NUDGE THEORY · HYPERBOLIC DISCOUNTING ·&nbsp;
                LOSS AVERSION · PRESENT BIAS · PROSPECT THEORY · AMBIGUITY AVERSION · CHOICE ARCHITECTURE · NUDGE THEORY · HYPERBOLIC DISCOUNTING ·&nbsp;
                LOSS AVERSION · PRESENT BIAS · PROSPECT THEORY · AMBIGUITY AVERSION · CHOICE ARCHITECTURE · NUDGE THEORY · HYPERBOLIC DISCOUNTING ·&nbsp;
              </div>
            </div>
          </div>
        </section>

        {/* TRANSITION BRIDGE 1 */}
        <div className="bg-[#0D0D0D] py-10 border-y-3 border-[#333333]" data-aos="fade">
          <p className="font-fraunces text-xl md:text-2xl lg:text-3xl text-white text-center px-8 max-w-4xl mx-auto leading-relaxed italic">
            Rational theory says you&apos;d sign up. You didn&apos;t.
          </p>
        </div>

        {/* SECTION 2 — THE PROBLEM */}
        <section id="problem" className="bg-[#FFFBF0] py-20 lg:py-28 relative">
          <div className="max-w-6xl mx-auto px-8">
            {/* Section Header */}
            <div className="mb-16" data-aos="fade-right">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#FF5C00] mb-4 block">01 / The Problem</span>
              <h2 className="font-fraunces text-3xl md:text-4xl lg:text-5xl font-bold text-[#0D0D0D] leading-tight max-w-3xl text-balance">
                Expected Utility Theory assumed you&apos;d just... enrol.
              </h2>
            </div>

            {/* Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              <div
                className="brutal-card bg-white p-8 lg:p-10 border-3 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] hover:shadow-[6px_6px_0px_#0D0D0D] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                data-aos="fade-up"
              >
                <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#0D0D0D]/60 mb-8">What theory predicts</h3>
                <ul className="space-y-5">
                  {["Fair pricing", "Rational agent", "Enrolls", "Welfare improves"].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 font-grotesk text-base text-[#0D0D0D]">
                      <span className="w-7 h-7 flex items-center justify-center bg-[#0D9E75] text-white rounded-sm text-sm flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className="brutal-card bg-[#FFE500] p-8 lg:p-10 border-3 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] hover:shadow-[6px_6px_0px_#0D0D0D] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#0D0D0D]/60 mb-8">What actually happens</h3>
                <ul className="space-y-5">
                  {["Fair pricing", "Confusion", "Delay", "Never enrolls", "Regret"].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 font-grotesk text-base text-[#0D0D0D]">
                      <span className="w-7 h-7 flex items-center justify-center bg-[#FF5C00] text-white rounded-sm text-sm flex-shrink-0">✗</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pull Quote */}
            <blockquote className="font-fraunces text-xl md:text-2xl lg:text-3xl italic text-[#0D0D0D] text-center max-w-3xl mx-auto leading-relaxed" data-aos="fade-up">
              &ldquo;The gap between knowing and doing is where behavioural economics lives.&rdquo;
            </blockquote>
          </div>
        </section>

        {/* TRANSITION BRIDGE 2 */}
        <div className="bg-[#2563EB] py-10 border-y-3 border-[#0D0D0D]" data-aos="fade">
          <p className="font-fraunces text-xl md:text-2xl lg:text-3xl text-white text-center px-8 max-w-4xl mx-auto leading-relaxed italic">
            Your brain has a different operating system.
          </p>
        </div>

        {/* SECTION 3 — FOUR CONCEPTS */}
        <section id="biases" className="bg-white py-20 lg:py-28 relative">
          <div className="max-w-6xl mx-auto px-8">
            <div className="mb-16" data-aos="fade-right">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#2563EB] mb-4 block">02 / The Biases</span>
              <h2 className="font-fraunces text-3xl md:text-4xl lg:text-5xl font-bold text-[#0D0D0D] leading-tight max-w-3xl text-balance">
                Four reasons your brain says no
              </h2>
            </div>

            {/* 2x2 Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Card 1 - Prospect Theory */}
              <div
                className="brutal-card bg-[#FF5C00] p-8 lg:p-10 border-3 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] hover:shadow-[6px_6px_0px_#0D0D0D] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all group"
                data-aos="fade-up"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/60">Kahneman & Tversky, 1979</span>
                <h3 className="font-fraunces text-2xl lg:text-3xl font-bold text-white mt-3 mb-5">
                  Prospect Theory
                </h3>
                <p className="font-grotesk text-sm lg:text-base text-white/90 mb-6 leading-relaxed">
                  People evaluate outcomes relative to a reference point. Losses feel 2.25x more painful than equivalent gains feel good. Insurance premium = certain loss. Benefit = uncertain future gain.
                </p>
                {/* SVG S-Curve */}
                <div className="bg-[#0D0D0D] rounded-md p-4 mb-5">
                  <svg viewBox="0 0 200 100" className="w-full h-20">
                    <line x1="20" y1="50" x2="180" y2="50" stroke="#ffffff20" strokeWidth="1" />
                    <line x1="100" y1="10" x2="100" y2="90" stroke="#ffffff20" strokeWidth="1" />
                    <path d="M 20 50 Q 50 50 70 25 Q 85 10 100 10" fill="none" stroke="#FFE500" strokeWidth="2.5" />
                    <path d="M 100 50 Q 115 50 130 75 Q 145 90 180 90" fill="none" stroke="#FFE500" strokeWidth="2.5" />
                    <text x="160" y="40" fill="#ffffff60" className="text-[7px] font-mono">GAINS</text>
                    <text x="25" y="40" fill="#ffffff60" className="text-[7px] font-mono">LOSSES</text>
                  </svg>
                </div>
                <span className="inline-block bg-white text-[#0D0D0D] font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border-2 border-[#0D0D0D]">
                  Reference Dependence
                </span>
              </div>

              {/* Card 2 - Loss Aversion */}
              <div
                className="brutal-card bg-[#FFE500] p-8 lg:p-10 border-3 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] hover:shadow-[6px_6px_0px_#0D0D0D] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all group"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#0D0D0D]/60">Thaler & Sunstein, 2008</span>
                <h3 className="font-fraunces text-2xl lg:text-3xl font-bold text-[#0D0D0D] mt-3 mb-5">
                  Loss Aversion
                </h3>
                <p className="font-grotesk text-sm lg:text-base text-[#0D0D0D]/90 mb-6 leading-relaxed">
                  &ldquo;Loss protection&rdquo; framing doubles enrolment vs &ldquo;financial investment&rdquo; framing. The product doesn&apos;t change. Only the words do.
                </p>
                {/* Visual */}
                <div className="flex items-center justify-center gap-10 mb-5">
                  <div className="text-center">
                    <span className="font-fraunces text-3xl font-bold text-[#CC0000]">-$1000</span>
                    <div className="flex justify-center mt-2 gap-0.5">
                      <span className="w-3 h-10 bg-[#CC0000] rounded-sm"></span>
                      <span className="w-3 h-10 bg-[#CC0000] rounded-sm"></span>
                      <span className="w-3 h-10 bg-[#CC0000] rounded-sm"></span>
                    </div>
                    <span className="font-mono text-[10px] text-[#0D0D0D]/60 mt-2 block">feels like this</span>
                  </div>
                  <div className="text-center">
                    <span className="font-fraunces text-3xl font-bold text-[#0D9E75]">+$1000</span>
                    <div className="flex justify-center mt-2">
                      <span className="w-3 h-4 bg-[#0D9E75] rounded-sm"></span>
                    </div>
                    <span className="font-mono text-[10px] text-[#0D0D0D]/60 mt-2 block">feels like this</span>
                  </div>
                </div>
                <span className="inline-block bg-[#0D0D0D] text-white font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border-2 border-[#0D0D0D]">
                  Framing Effect
                </span>
              </div>

              {/* Card 3 - Present Bias */}
              <div
                className="brutal-card bg-[#0D0D0D] p-8 lg:p-10 border-3 border-[#0D0D0D] shadow-[4px_4px_0px_#2563EB] hover:shadow-[6px_6px_0px_#2563EB] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all group"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/60">Laibson, 1997</span>
                <h3 className="font-fraunces text-2xl lg:text-3xl font-bold text-white mt-3 mb-5">
                  Present Bias
                </h3>
                <p className="font-grotesk text-sm lg:text-base text-white/85 mb-6 leading-relaxed">
                  Paying the premium happens NOW. Getting sick happens MAYBE LATER. Hyperbolic discounting means future you is a stranger.
                </p>
                {/* Timeline Visual */}
                <div className="relative mb-5">
                  <div className="h-2 bg-white/15 rounded-full relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1/4 bg-[#FF5C00] rounded-full" />
                  </div>
                  <div className="flex justify-between mt-3">
                    <span className="font-mono text-[10px] text-[#FF5C00] font-bold tracking-wider">TODAY</span>
                    <span className="font-mono text-[10px] text-white/40 tracking-wider">FUTURE</span>
                  </div>
                </div>
                <span className="inline-block bg-white text-[#0D0D0D] font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border-2 border-[#0D0D0D]">
                  Hyperbolic Discounting
                </span>
              </div>

              {/* Card 4 - Ambiguity Aversion */}
              <div
                className="brutal-card bg-[#0D9E75] p-8 lg:p-10 border-3 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] hover:shadow-[6px_6px_0px_#0D0D0D] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all group"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/60">Ellsberg, 1961</span>
                <h3 className="font-fraunces text-2xl lg:text-3xl font-bold text-white mt-3 mb-5">
                  Ambiguity Aversion
                </h3>
                <p className="font-grotesk text-sm lg:text-base text-white/85 mb-6 leading-relaxed">
                  You don&apos;t know if you&apos;ll get sick. You don&apos;t know if the claim will be approved. When probabilities are unclear, the brain defaults to avoidance.
                </p>
                {/* 2x2 Grid Visual */}
                <div className="grid grid-cols-2 gap-2 mb-5">
                  <div className="bg-white/15 p-4 text-center rounded-sm">
                    <span className="font-mono text-[10px] text-white/60 block mb-1 tracking-wider">Known Risk</span>
                    <span className="font-grotesk text-sm text-white font-medium">Tolerable</span>
                  </div>
                  <div className="bg-[#FF5C00] p-4 text-center rounded-sm">
                    <span className="font-mono text-[10px] text-white/80 block mb-1 tracking-wider">Unknown Risk</span>
                    <span className="font-grotesk text-sm text-white font-medium">Paralyzing</span>
                  </div>
                </div>
                <span className="inline-block bg-white text-[#0D0D0D] font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border-2 border-[#0D0D0D]">
                  Ellsberg Paradox
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* TRANSITION BRIDGE 3 */}
        <div className="bg-[#0D9E75] py-10 border-y-3 border-[#0D0D0D]" data-aos="fade">
          <p className="font-fraunces text-xl md:text-2xl lg:text-3xl text-white text-center px-8 max-w-4xl mx-auto leading-relaxed italic">
            It gets worse before it gets better.
          </p>
        </div>

        {/* SECTION 4 — REAL-WORLD DATA */}
        <section id="evidence" className="bg-[#FFFBF0] py-20 lg:py-28 relative">
          <div className="max-w-6xl mx-auto px-8">
            <div className="mb-16" data-aos="fade-right">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#0D9E75] mb-4 block">03 / The Evidence</span>
              <h2 className="font-fraunces text-3xl md:text-4xl lg:text-5xl font-bold text-[#0D0D0D] leading-tight max-w-3xl text-balance">
                The numbers that prove it
              </h2>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
              <div
                className="brutal-card bg-[#FF5C00] p-8 border-3 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] hover:shadow-[6px_6px_0px_#0D0D0D] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                data-aos="fade-up"
              >
                <span className="font-fraunces text-4xl lg:text-5xl font-bold text-white" data-counter="85" data-suffix="%">0%</span>
                <p className="font-grotesk text-sm text-white/80 mt-3 leading-relaxed">Gallup 2023: employees globally disengaged when incentives feel unfair</p>
              </div>
              <div
                className="brutal-card bg-[#2563EB] p-8 border-3 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] hover:shadow-[6px_6px_0px_#0D0D0D] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <span className="font-fraunces text-4xl lg:text-5xl font-bold text-white" data-counter="3.4" data-suffix="%">0%</span>
                <p className="font-grotesk text-sm text-white/80 mt-3 leading-relaxed">Odean 1998: annual underperformance of stocks investors held vs sold</p>
              </div>
              <div
                className="brutal-card bg-[#FFE500] p-8 border-3 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] hover:shadow-[6px_6px_0px_#0D0D0D] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <span className="font-fraunces text-4xl lg:text-5xl font-bold text-[#0D0D0D]" data-counter="13.6" data-suffix="%">0%</span>
                <p className="font-grotesk text-sm text-[#0D0D0D]/80 mt-3 leading-relaxed">SMarT programme: savings rate after auto-escalation vs 3.5% voluntary</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div
                className="brutal-card bg-white p-8 border-3 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D]"
                data-aos="fade-up"
              >
                <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#0D0D0D]/60 mb-6">Enrolment rate by framing type</h3>
                <div className="h-56">
                  <canvas ref={barChartRef} />
                </div>
              </div>
              <div
                className="brutal-card bg-white p-8 border-3 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D]"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#0D0D0D]/60 mb-6">Perceived value vs actual value over time</h3>
                <div className="h-56">
                  <canvas ref={lineChartRef} />
                </div>
                <div className="text-center mt-4">
                  <span className="font-mono text-[10px] text-[#FF5C00] bg-[#FF5C00]/10 px-3 py-1.5 rounded tracking-wider">Regret Zone: where perceived drops below threshold</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRANSITION BRIDGE 4 */}
        <div className="bg-[#FFE500] py-10 border-y-3 border-[#0D0D0D]" data-aos="fade">
          <p className="font-fraunces text-xl md:text-2xl lg:text-3xl text-[#0D0D0D] text-center px-8 max-w-4xl mx-auto leading-relaxed italic">
            But here&apos;s the thing — it&apos;s fixable.
          </p>
        </div>

        {/* SECTION 5 — SOLUTIONS & NUDGES */}
        <section id="solutions" className="bg-white py-20 lg:py-28 relative">
          <div className="max-w-6xl mx-auto px-8">
            <div className="mb-16" data-aos="fade-right">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#0D0D0D]/40 mb-4 block">04 / The Fixes</span>
              <h2 className="font-fraunces text-3xl md:text-4xl lg:text-5xl font-bold text-[#0D0D0D] leading-tight max-w-3xl text-balance">
                Choice architecture that actually works
              </h2>
            </div>

            {/* Nudges Grid */}
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
                {/* Nudge 1 */}
                <div
                  className="brutal-card bg-[#FFFBF0] p-6 lg:p-8 border-3 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] hover:shadow-[6px_6px_0px_#0D0D0D] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                  data-aos="fade-up"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-[#0D9E75] text-white rounded-full text-lg mb-5 border-2 border-[#0D0D0D]">
                    ✓
                  </div>
                  <h3 className="font-fraunces text-lg lg:text-xl font-bold text-[#0D0D0D] mb-3">Default Enrolment</h3>
                  <p className="font-grotesk text-sm text-[#0D0D0D]/70 mb-5 leading-relaxed">
                    Make inaction work FOR the person. Opt-out enrolment exploits status quo bias.
                  </p>
                  <span className="inline-block bg-[#0D9E75] text-white font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border-2 border-[#0D0D0D]">
                    +55% enrolment
                  </span>
                </div>

                {/* Nudge 2 */}
                <div
                  className="brutal-card bg-[#FFFBF0] p-6 lg:p-8 border-3 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] hover:shadow-[6px_6px_0px_#0D0D0D] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-[#2563EB] text-white rounded-full mb-5 border-2 border-[#0D0D0D]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="font-fraunces text-lg lg:text-xl font-bold text-[#0D0D0D] mb-3">Loss-Framed Messaging</h3>
                  <p className="font-grotesk text-sm text-[#0D0D0D]/70 mb-5 leading-relaxed">
                    Don&apos;t sell coverage. Prevent loss. Loss framing doubles conversion rate.
                  </p>
                  <span className="inline-block bg-[#2563EB] text-white font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border-2 border-[#0D0D0D]">
                    2x conversion
                  </span>
                </div>

                {/* Nudge 3 */}
                <div
                  className="brutal-card bg-[#FFFBF0] p-6 lg:p-8 border-3 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] hover:shadow-[6px_6px_0px_#0D0D0D] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-[#FF5C00] text-white rounded-full mb-5 border-2 border-[#0D0D0D]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-fraunces text-lg lg:text-xl font-bold text-[#0D0D0D] mb-3">Simplified Communication</h3>
                  <p className="font-grotesk text-sm text-[#0D0D0D]/70 mb-5 leading-relaxed">
                    Remove ambiguity. Replace 40-page documents with a visual one-pager.
                  </p>
                  <span className="inline-block bg-[#FF5C00] text-white font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border-2 border-[#0D0D0D]">
                    -40% drop-off
                  </span>
                </div>

                {/* Nudge 4 */}
                <div
                  className="brutal-card bg-[#FFFBF0] p-6 lg:p-8 border-3 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] hover:shadow-[6px_6px_0px_#0D0D0D] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-[#FFE500] text-[#0D0D0D] rounded-full mb-5 border-2 border-[#0D0D0D]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-fraunces text-lg lg:text-xl font-bold text-[#0D0D0D] mb-3">Commitment Devices</h3>
                  <p className="font-grotesk text-sm text-[#0D0D0D]/70 mb-5 leading-relaxed">
                    Let future-you decide now. Allow pre-commitment to bypass present-bias.
                  </p>
                  <span className="inline-block bg-[#0D0D0D] text-white font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border-2 border-[#0D0D0D]">
                    3.9x savings rate
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRANSITION BRIDGE 5 */}
        <div className="bg-[#0D0D0D] py-10 border-y-3 border-[#333333]" data-aos="fade">
          <p className="font-fraunces text-xl md:text-2xl lg:text-3xl text-white text-center px-8 max-w-4xl mx-auto leading-relaxed italic">
            Policy that ignores psychology is just wishful thinking.
          </p>
        </div>

        {/* SECTION 6 — CONCLUSION */}
        <section className="bg-[#FF5C00] py-20 lg:py-28 relative">
          <div className="max-w-6xl mx-auto px-8">
            <div className="mb-12" data-aos="fade-right">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 mb-4 block">05 / The Takeaway</span>
            </div>

            <h2 className="font-fraunces text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-14 max-w-4xl text-balance" data-aos="fade-up">
              Rational models design for the human we wish people were. Behavioural economics designs for the human they actually are.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
              <div
                className="brutal-card bg-white p-6 lg:p-8 border-3 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] hover:shadow-[6px_6px_0px_#0D0D0D] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                data-aos="fade-up"
              >
                <h3 className="font-fraunces text-lg font-bold text-[#0D0D0D] mb-3">The bias is not a bug</h3>
                <p className="font-grotesk text-sm text-[#0D0D0D]/70 leading-relaxed">
                  Loss aversion and present bias are evolved responses, not stupidity. Good policy works with them.
                </p>
              </div>
              <div
                className="brutal-card bg-white p-6 lg:p-8 border-3 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] hover:shadow-[6px_6px_0px_#0D0D0D] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <h3 className="font-fraunces text-lg font-bold text-[#0D0D0D] mb-3">The nudge is not manipulation</h3>
                <p className="font-grotesk text-sm text-[#0D0D0D]/70 leading-relaxed">
                  Default enrolment preserves full choice. It just makes the right choice the easy choice.
                </p>
              </div>
              <div
                className="brutal-card bg-white p-6 lg:p-8 border-3 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] hover:shadow-[6px_6px_0px_#0D0D0D] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <h3 className="font-fraunces text-lg font-bold text-[#0D0D0D] mb-3">The data is clear</h3>
                <p className="font-grotesk text-sm text-[#0D0D0D]/70 leading-relaxed">
                  Behavioural interventions consistently outperform information campaigns at improving real welfare outcomes.
                </p>
              </div>
            </div>

            <div className="text-center" data-aos="fade-up">
              <a
                href="#references"
                className="brutal-btn inline-block bg-[#0D0D0D] text-white font-mono text-xs uppercase tracking-wider px-8 py-4 border-3 border-[#FFE500] shadow-[4px_4px_0px_#FFE500] hover:shadow-[6px_6px_0px_#FFE500] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                Read the Full Analysis
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 7 — TEAM & REFERENCES */}
        <section id="references" className="bg-[#FFFBF0] py-24 relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <span className="font-mono text-sm uppercase tracking-widest text-[#0D0D0D] mb-8 block" data-aos="fade-right">TEAM</span>

            {/* Team Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
              {[
                { name: "Sadham Mydeen", roll: "RA2311042010053" },
                { name: "Sanjay VV", roll: "RA2311042010021" },
                { name: "Nakul Raj", roll: "RA2311042010068" },
                { name: "Krishna P", roll: "RA2311042010017" },
                { name: "Manthra K", roll: "RA2311042010019" },
              ].map((member, i) => (
                <div
                  key={i}
                  className="brutal-card bg-white p-4 border-[3px] border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] hover:shadow-[6px_6px_0px_#0D0D0D] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
                  data-aos="fade-up"
                  data-aos-delay={i * 50}
                >
                  <h4 className="font-fraunces text-lg font-bold text-[#0D0D0D]">{member.name}</h4>
                  <p className="font-mono text-xs text-[#0D0D0D]/60">{member.roll}</p>
                  <span className="inline-block mt-2 bg-[#2563EB]/10 text-[#2563EB] font-mono text-[10px] uppercase px-2 py-1">
                    CSBS · 21CSE317T
                  </span>
                </div>
              ))}
            </div>

            {/* References */}
            <div className="mb-12" data-aos="fade-up">
              <span className="font-mono text-sm uppercase tracking-widest text-[#0D0D0D] mb-6 block">REFERENCES</span>
              <div className="font-mono text-xs text-[#0D0D0D]/70 space-y-2 max-w-3xl">
                <p>Kahneman, D., & Tversky, A. (1979). Prospect Theory: An Analysis of Decision under Risk. Econometrica, 47(2), 263-291.</p>
                <p>Thaler, R. H., & Sunstein, C. R. (2008). Nudge: Improving Decisions about Health, Wealth, and Happiness. Yale University Press.</p>
                <p>Laibson, D. (1997). Golden Eggs and Hyperbolic Discounting. The Quarterly Journal of Economics, 112(2), 443-478.</p>
                <p>Ellsberg, D. (1961). Risk, Ambiguity, and the Savage Axioms. The Quarterly Journal of Economics, 75(4), 643-669.</p>
                <p>Odean, T. (1998). Are Investors Reluctant to Realize Their Losses? The Journal of Finance, 53(5), 1775-1798.</p>
                <p>Thaler, R. H., & Benartzi, S. (2004). Save More Tomorrow: Using Behavioral Economics to Increase Employee Saving. Journal of Political Economy, 112(S1), S164-S187.</p>
                <p>Gallup (2023). State of the Global Workplace Report.</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t-[3px] border-[#0D0D0D] py-6">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
              <p className="font-mono text-sm text-[#0D0D0D]/60">
                Behavioural Economics (21CSE317T) · Academic Year 2025–26 · SRM Institute of Science and Technology
              </p>
            </div>
          </footer>
        </section>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;1,400&family=Space+Grotesk:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap');

        html {
          scroll-behavior: smooth;
        }

        .font-fraunces {
          font-family: 'Fraunces', serif;
        }

        .font-grotesk {
          font-family: 'Space Grotesk', sans-serif;
        }

        .font-mono {
          font-family: 'Space Mono', monospace;
        }

        /* Marquee Animation */
        .marquee-container {
          overflow: hidden;
          white-space: nowrap;
        }

        .marquee-content {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }

        .marquee-container:hover .marquee-content {
          animation-play-state: paused;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }

        /* Mobile shadow adjustment */
        @media (max-width: 768px) {
          .brutal-card,
          .brutal-card-dark,
          .brutal-btn {
            box-shadow: 4px 4px 0px #0D0D0D !important;
          }
          .brutal-card:hover,
          .brutal-card-dark:hover,
          .brutal-btn:hover {
            box-shadow: 6px 6px 0px #0D0D0D !important;
          }
        }
      `}</style>
    </>
  )
}
