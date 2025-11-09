// Landing.tsx - XPay: Stellar payments + X402 content protection
import React from "react";

export const Landing: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section - Dual value: Send/Receive + Content Protection */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 h-screen">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-20 blur-3xl"></div>
        </div>

        <div className="container relative mx-auto px-6 py-32 md:py-28 max-w-6xl">
          <div className="flex flex-col items-center text-center space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/30">
              <svg
                className="mr-2 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 9a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm1 4a1 1 0 100 2h2a1 1 0 100-2H9z" />
              </svg>
              Powered by Stellar + X402 Protocol
            </div>

            {/* Title */}
            <h1 className="text-5xl font-black tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              Payments & Content{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  United
                </span>
                <span className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-20 blur-2xl"></span>
              </span>
            </h1>

            {/* Description */}
            <p className="max-w-3xl text-md md:text-md text-gray-600 leading-relaxed">
              Send & receive XLM globally in seconds, plus protect and monetize
              your content with X402. The complete payment platform for the
              modern web.
            </p>

            {/* Triple CTA - Send/Receive/Protect */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl pt-6">
              <a
                href="/send-payment"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-left shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-105 transition-all"
              >
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm mb-3">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Send XLM
                  </h3>
                  <p className="text-blue-100 text-sm mb-3">
                    Transfer globally
                  </p>
                  <div className="flex items-center text-white font-semibold text-sm">
                    Start
                    <svg
                      className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>
                <div className="absolute top-0 right-0 h-24 w-24 bg-white/10 rounded-full blur-2xl"></div>
              </a>

              <a
                href="/generate-payment"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-left shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 hover:scale-105 transition-all"
              >
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm mb-3">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Receive XLM
                  </h3>
                  <p className="text-purple-100 text-sm mb-3">
                    Get paid instantly
                  </p>
                  <div className="flex items-center text-white font-semibold text-sm">
                    Generate
                    <svg
                      className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>
                <div className="absolute top-0 right-0 h-24 w-24 bg-white/10 rounded-full blur-2xl"></div>
              </a>

              <a
                href="/x402-protection"
                className="group relative overflow-hidden rounded-2xl bg-white border-2 border-purple-300 p-6 text-left shadow-xl hover:shadow-2xl hover:border-purple-400 hover:scale-105 transition-all"
              >
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 mb-3">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Protect Content
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Monetize with X402
                  </p>
                  <div className="flex items-center text-purple-600 font-semibold text-sm">
                    Learn more
                    <svg
                      className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold">Stellar blockchain</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold">3-5 second settlement</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold">X402 content protection</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats - XPay unified stats */}
      <section className="bg-white py-20 border-y border-gray-200">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              {
                value: "$2.5B+",
                label: "XLM Volume",
                color: "from-blue-500 to-cyan-500",
              },
              {
                value: "180+",
                label: "Countries",
                color: "from-purple-500 to-pink-500",
              },
              {
                value: "3-5s",
                label: "Settlement Time",
                color: "from-orange-500 to-red-500",
              },
              {
                value: "402",
                label: "HTTP Protocol",
                color: "from-green-500 to-emerald-500",
              },
            ].map((stat) => (
              <div key={stat.label} className="text-center group">
                <div
                  className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform`}
                >
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works - Dual flow */}
      <section className="py-32 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Two powerful solutions,{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                one platform
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Send/receive XLM or protect your premium content with X402
            </p>
          </div>

          {/* Two columns: P2P vs X402 */}
          <div className="grid gap-12 md:grid-cols-2 mb-16">
            {/* Column 1: P2P Payments */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                P2P Payments
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Send & Receive XLM
              </h3>
              <div className="space-y-4">
                {[
                  {
                    step: "01",
                    title: "Connect Wallet",
                    desc: "Link your Stellar wallet",
                  },
                  {
                    step: "02",
                    title: "Enter Details",
                    desc: "Amount and destination address",
                  },
                  {
                    step: "03",
                    title: "Confirm",
                    desc: "XLM arrives in 3-5 seconds",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold flex items-center justify-center text-sm">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: X402 Protection */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                X402 Content Protection
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Monetize Your Content
              </h3>
              <div className="space-y-4">
                {[
                  {
                    step: "01",
                    title: "Protect Resource",
                    desc: "Add X402 to your API/content",
                  },
                  {
                    step: "02",
                    title: "User Requests",
                    desc: "Server responds with 402 Payment Required",
                  },
                  {
                    step: "03",
                    title: "Auto Payment",
                    desc: "Content unlocks after payment proof",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold flex items-center justify-center text-sm">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Combined XPay features */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Why choose{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                XPay
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The complete payment platform for P2P transfers and content
              monetization
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "⚡",
                title: "Lightning Fast P2P",
                description:
                  "Send and receive XLM in 3-5 seconds globally with Stellar",
                gradient: "from-blue-400 to-cyan-500",
              },
              {
                icon: "🔒",
                title: "X402 Protection",
                description:
                  "Monetize APIs, articles, and premium content automatically",
                gradient: "from-purple-400 to-pink-500",
              },
              {
                icon: "💰",
                title: "Minimal Fees",
                description:
                  "Base fee of 0.00001 XLM per transaction - almost free",
                gradient: "from-green-400 to-emerald-500",
              },
              {
                icon: "📱",
                title: "QR Code Support",
                description:
                  "Generate QR codes instantly for seamless payments",
                gradient: "from-orange-400 to-red-500",
              },
              {
                icon: "🌍",
                title: "Global Network",
                description:
                  "Access 180+ countries with Stellar's distributed ledger",
                gradient: "from-indigo-400 to-blue-500",
              },
              {
                icon: "🛠️",
                title: "Developer SDK",
                description: "Complete API and SDK for React, Svelte, and more",
                gradient: "from-pink-400 to-rose-500",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-200"
              >
                <div
                  className={`absolute top-0 right-0 h-32 w-32 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}
                ></div>
                <div className="relative">
                  <div className="mb-5 text-5xl">{feature.icon}</div>
                  <h3 className="mb-3 text-xl font-bold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Restaurado con mejor contraste */}
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 h-96 w-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 h-96 w-96 bg-emerald-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:40px_40px]"></div>

        <div className="container relative mx-auto px-6 py-32 md:py-40 max-w-5xl">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-white shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Stellar + X402 Protocol Combined
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
              Start with XPay
              <br />
              <span className="relative inline-block mt-2">
                <span className="relative z-10">today</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-white/30"
                  viewBox="0 0 200 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,5 Q50,0 100,5 T200,5"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-emerald-50 max-w-2xl mx-auto leading-relaxed">
              Send XLM globally and protect your premium content - all in one
              platform
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <a
                href="#"
                className="group inline-flex items-center justify-center rounded-2xl bg-white px-10 py-5 text-lg font-bold text-emerald-600 shadow-2xl shadow-black/20 hover:shadow-emerald-900/30 hover:scale-105 transition-all"
              >
                Get Started Free
                <svg
                  className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="group inline-flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/30 px-10 py-5 text-lg font-bold text-white hover:bg-white/20 hover:border-white/50 transition-all"
              >
                View Documentation
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 pt-12 text-white/90">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-semibold">No setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-semibold">
                  P2P + Content protection
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-semibold">Complete SDK</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
