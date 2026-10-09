<template>
  <div class="min-h-screen flex flex-col bg-[#000201] text-slate-100 selection:bg-emerald-500 selection:text-black relative overflow-x-hidden font-sans" @mousemove="handleMouseMove" @click="playClickSound">
    <!-- Interactive Cursor Spotlight Aura -->
    <div class="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300" :style="{ background: `radial-gradient(600px at ${cursorX}px ${cursorY}px, rgba(16, 185, 129, 0.08), transparent 80%)` }"></div>

    <!-- Ultra-Subtle CRT Monitor Scanline Overlay -->
    <div class="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] opacity-40"></div>

    <!-- Cyberpunk Boot-up Intro Overlay Animation -->
    <div v-if="loading" class="fixed inset-0 z-50 bg-[#000201] flex flex-col items-center justify-center font-mono text-emerald-400 p-6 transition-opacity duration-700">
      <div class="w-full max-w-md space-y-4">
        <div class="flex items-center space-x-2 text-xs uppercase tracking-widest text-emerald-500">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>BOOTING_SEQUENCE // JERICHO_FRAGATA_OS</span>
        </div>
        <div class="bg-black border border-emerald-900/90 rounded-2xl p-5 shadow-[0_0_30px_rgba(4,120,87,0.2)] space-y-2 text-xs">
          <p v-for="(log, index) in bootLogs" :key="index" class="animate-fadeIn">
            <span class="text-emerald-500 mr-2">></span>{{ log }}
          </p>
          <div class="pt-2 flex items-center space-x-2 text-emerald-300">
            <span class="animate-pulse">_</span>
            <span class="text-[10px] text-slate-600">Initializing dark-mode neural matrix...</span>
          </div>
        </div>
        <div class="w-full bg-black h-1.5 rounded-full overflow-hidden border border-emerald-950">
          <div class="bg-emerald-400 h-full transition-all duration-300 shadow-[0_0_12px_rgba(16,185,129,0.9)]" :style="{ width: bootProgress + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- Konami Code Easter Egg Notification Banner -->
    <div v-if="matrixOverdrive" class="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-black/95 border-2 border-emerald-400 px-6 py-3 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.8)] text-emerald-300 font-mono text-xs flex items-center gap-3 animate-bounce">
      <i class="fa-solid fa-terminal text-emerald-400 text-base"></i>
      <span>SYSTEM OVERDRIVE UNLOCKED: Neural Matrix Synchronized!</span>
    </div>

    <!-- Interactive Neural Matrix Particle Canvas Background -->
    <canvas ref="matrixCanvas" class="absolute inset-0 pointer-events-none z-0 opacity-40"></canvas>

    <!-- Deep Midnight & Emerald Cyber-Grid Background Overlay -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#022c1410_1px,transparent_1px),linear-gradient(to_bottom,#022c1410_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-1"></div>

    <!-- Pulsing Deep Ambient Emerald Glows -->
    <div class="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-600/10 rounded-full filter blur-[200px] pointer-events-none animate-pulse"></div>
    <div class="absolute top-1/2 right-5 w-[500px] h-[500px] bg-green-700/10 rounded-full filter blur-[200px] pointer-events-none"></div>

    <!-- Live System Telemetry Bar with Local Weather & CPU/RAM Metrics -->
    <div class="bg-black/80 border-b border-emerald-950 py-1.5 px-4 text-[11px] font-mono text-emerald-400 flex items-center justify-between z-40 backdrop-blur-md">
      <div class="flex items-center space-x-3 overflow-hidden">
        <span class="flex items-center space-x-1.5"><span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span><span>LOC: Isabela, PH</span></span>
        <span class="hidden sm:inline text-emerald-800">|</span>
        <span class="hidden sm:inline">TEMP: 28°C (Humid)</span>
        <span class="hidden md:inline text-emerald-800">|</span>
        <span class="hidden md:inline">TIME: {{ liveTime }}</span>
      </div>
      <div class="flex items-center space-x-4">
        <span class="hidden md:inline text-slate-400">CPU: <span class="text-emerald-300">{{ cpuLoad }}%</span></span>
        <span class="hidden md:inline text-slate-400">RAM: <span class="text-emerald-300">4.2/16GB</span></span>
        <button @click="terminalOpen = !terminalOpen" class="bg-emerald-950 hover:bg-emerald-900 px-2.5 py-0.5 rounded text-emerald-300 border border-emerald-800/60 transition-all cursor-pointer">
          <i class="fa-solid fa-terminal mr-1"></i> [CLI]
        </button>
      </div>
    </div>

    <!-- Navigation Header -->
    <header class="sticky top-0 z-40 bg-[#000201]/90 backdrop-blur-2xl border-b border-emerald-950 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <a href="#about" class="flex items-center space-x-3 group">
          <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center text-black font-black text-lg shadow-lg shadow-emerald-500/20 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300">
            {{ profile.initials }}
          </div>
          <div>
            <span class="font-bold text-lg tracking-tight block group-hover:text-emerald-400 transition-colors">{{ profile.name }}</span>
            <span class="text-xs text-emerald-400 font-mono tracking-wider flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> ONLINE
            </span>
          </div>
        </a>

        <!-- Desktop Nav Links -->
        <nav class="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <a href="#about" class="hover:text-emerald-400 transition-colors">About</a>
          <a href="#projects" class="hover:text-emerald-400 transition-colors">Projects</a>
          <a href="#skills" class="hover:text-emerald-400 transition-colors">Skills</a>
          <a href="#achievements" class="hover:text-emerald-400 transition-colors">Achievements</a>
          <a href="#certificates" class="hover:text-emerald-400 transition-colors">Certificates</a>
          <a href="#contact" class="hover:text-emerald-400 transition-colors">Contact</a>
        </nav>

        <!-- Audio Toggle & CV Download & Mobile Toggle -->
        <div class="flex items-center space-x-3">
          <!-- Ambient Sound FX Toggle -->
          <button @click="toggleAudio" :class="audioEnabled ? 'border-emerald-500 text-emerald-400 bg-emerald-950/60' : 'border-emerald-950 text-slate-500 bg-black'" class="p-2.5 rounded-xl border transition-all text-xs font-mono flex items-center gap-1.5 cursor-pointer" title="Toggle UI Sound Effects">
            <i :class="audioEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark'"></i>
            <span class="hidden lg:inline">{{ audioEnabled ? 'SFX: ON' : 'SFX: OFF' }}</span>
          </button>

          <button @click="downloadCV" class="hidden sm:inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-black font-extrabold text-sm shadow-lg shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5">
            <i class="fa-solid fa-download"></i>
            <span>Download CV</span>
          </button>
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2.5 rounded-xl bg-black border border-emerald-950 text-slate-300 hover:text-white">
            <i :class="mobileMenuOpen ? 'fa-solid fa-xmark text-lg' : 'fa-solid fa-bars text-lg'"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown -->
      <div v-if="mobileMenuOpen" class="md:hidden bg-black/95 backdrop-blur-3xl border-b border-emerald-950 px-4 pt-3 pb-6 space-y-3 shadow-2xl">
        <a @click="mobileMenuOpen = false" href="#about" class="block py-2 text-base font-medium hover:text-emerald-400">About</a>
        <a @click="mobileMenuOpen = false" href="#projects" class="block py-2 text-base font-medium hover:text-emerald-400">Projects</a>
        <a @click="mobileMenuOpen = false" href="#skills" class="block py-2 text-base font-medium hover:text-emerald-400">Skills</a>
        <a @click="mobileMenuOpen = false" href="#achievements" class="block py-2 text-base font-medium hover:text-emerald-400">Achievements</a>
        <a @click="mobileMenuOpen = false" href="#certificates" class="block py-2 text-base font-medium hover:text-emerald-400">Certificates</a>
        <a @click="mobileMenuOpen = false" href="#contact" class="block py-2 text-base font-medium hover:text-emerald-400">Contact</a>
        <button @click="downloadCV" class="w-full py-3 rounded-xl bg-emerald-600 text-black font-extrabold text-center shadow-lg shadow-emerald-600/30">
          <i class="fa-solid fa-download mr-2"></i> Download CV
        </button>
      </div>
    </header>

    <!-- About / Hero Section -->
    <section id="about" class="pt-28 pb-16 md:pt-36 md:pb-24 relative animate-fadeIn z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div class="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-xs font-mono tracking-wider uppercase shadow-inner backdrop-blur-md">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>SYSTEM_READY // READY FOR HIRE</span>
            </div>
            <h1 class="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
              Hi, I'm <span class="bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(16,185,129,0.4)] animate-pulse">{{ profile.name }}</span>
            </h1>
            <p class="text-xl sm:text-2xl font-bold text-slate-300">{{ profile.title }}</p>
            <p class="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">{{ profile.description }}</p>

            <!-- Unified Clean Contact & Social Badges Bar -->
            <div class="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2 text-xs font-mono">
              <div class="flex items-center space-x-2 bg-black/75 backdrop-blur-md px-3.5 py-2 rounded-xl border border-emerald-950 shadow-sm text-slate-300 hover:border-emerald-600/50 transition-all">
                <i class="fa-solid fa-location-dot text-emerald-400"></i>
                <span>{{ profile.address }}</span>
              </div>
              <button @click="copyEmail" class="flex items-center space-x-2 bg-black/75 backdrop-blur-md hover:bg-slate-900 px-3.5 py-2 rounded-xl border border-emerald-950 hover:border-emerald-600/60 text-slate-300 hover:text-white transition-all shadow-sm group cursor-pointer">
                <i class="fa-solid fa-envelope text-emerald-400 group-hover:scale-110 transition-transform"></i>
                <span>{{ copied ? 'Copied to Clipboard!' : profile.email }}</span>
              </button>
              <a :href="profile.githubUrl" target="_blank" class="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-black/75 border border-emerald-950 text-slate-300 hover:text-emerald-400 hover:border-emerald-600 transition-all shadow-sm group">
                <i class="fa-brands fa-github text-emerald-400 group-hover:scale-110 transition-transform"></i>
                <span>GitHub</span>
              </a>
              <a :href="profile.linkedinUrl" target="_blank" class="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-black/75 border border-emerald-950 text-slate-300 hover:text-emerald-400 hover:border-emerald-600 transition-all shadow-sm group">
                <i class="fa-brands fa-linkedin-in text-emerald-400 group-hover:scale-110 transition-transform"></i>
                <span>LinkedIn</span>
              </a>
              <a :href="profile.facebookUrl" target="_blank" class="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-black/75 border border-emerald-950 text-slate-300 hover:text-emerald-400 hover:border-emerald-600 transition-all shadow-sm group">
                <i class="fa-brands fa-facebook-f text-emerald-400 group-hover:scale-110 transition-transform"></i>
                <span>Facebook</span>
              </a>
              <a :href="profile.instagramUrl" target="_blank" class="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-black/75 border border-emerald-950 text-slate-300 hover:text-emerald-400 hover:border-emerald-600 transition-all shadow-sm group">
                <i class="fa-brands fa-instagram text-emerald-400 group-hover:scale-110 transition-transform"></i>
                <span>Instagram</span>
              </a>
            </div>
          </div>

          <!-- Cyberpunk Biometric HUD Avatar Card with Duotone & Glitch -->
          <div class="lg:col-span-5 flex justify-center">
            <div class="relative group cursor-pointer" @mousemove="handleTilt" @mouseleave="resetTilt" ref="tiltCard">
              <div class="absolute -inset-2.5 bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600 rounded-[38px] blur-3xl opacity-25 group-hover:opacity-60 transition duration-700 animate-pulse"></div>
              
              <div class="relative bg-black/85 backdrop-blur-2xl p-4 rounded-[32px] shadow-2xl border border-emerald-500/40 max-w-sm transition-transform duration-200 ease-out">
                <div class="relative overflow-hidden rounded-2xl w-full h-[380px] border border-emerald-900">
                  
                  <!-- Sci-Fi HUD Targeting Reticles & Corners -->
                  <div class="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-emerald-400 z-20 pointer-events-none"></div>
                  <div class="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-emerald-400 z-20 pointer-events-none"></div>
                  <div class="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-emerald-400 z-20 pointer-events-none"></div>
                  <div class="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-emerald-400 z-20 pointer-events-none"></div>

                  <!-- Live Biometric Scanner Status Tag -->
                  <div class="absolute top-3 left-8 z-20 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-emerald-500/40 text-[9px] font-mono text-emerald-400 animate-pulse">
                    BIOMETRIC_FEED // SECURE
                  </div>

                  <!-- Avatar with Emerald Duotone Tint & Hover Glitch -->
                  <img :src="myPhoto" :alt="profile.name" class="w-full h-full object-cover filter contrast-125 saturate-125 group-hover:scale-105 transition-transform duration-700">
                  
                  <!-- Emerald Duotone Overlay Gradient -->
                  <div class="absolute inset-0 bg-emerald-950/30 mix-blend-color pointer-events-none"></div>
                  <div class="absolute inset-0 bg-gradient-to-t from-[#000201] via-transparent to-transparent"></div>

                  <div class="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-600/40 text-[10px] font-mono text-emerald-400 z-20">
                    <i class="fa-solid fa-microchip mr-1"></i> ARM / MCU
                  </div>
                </div>
                
                <div class="absolute bottom-6 left-6 right-6 bg-[#000201]/95 backdrop-blur-xl p-4 rounded-xl border border-emerald-600/30 shadow-2xl flex items-center justify-between">
                  <div>
                    <p class="text-xs text-emerald-400 font-mono font-bold uppercase tracking-wider">Major</p>
                    <p class="text-base font-bold text-white">Computer Engineering</p>
                  </div>
                  <div class="w-10 h-10 rounded-xl bg-emerald-600/10 flex items-center justify-center text-emerald-400 border border-emerald-600/40 shadow-inner animate-bounce">
                    <i class="fa-solid fa-code text-lg"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quantified Engineering Quick-Stat Metrics Bar & Live Oscilloscope Wave -->
    <section class="py-12 border-y border-emerald-950 bg-black/40 backdrop-blur-md relative overflow-hidden z-10">
      <!-- Live Oscilloscope Signal Wave Background Graphic -->
      <div class="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
        <svg class="w-full h-16 text-emerald-400" viewBox="0 0 1200 100" fill="none" preserveAspectRatio="none">
          <path d="M0,50 Q150,10 300,50 T600,50 T900,50 T1200,50" stroke="currentColor" stroke-width="2" class="animate-pulse" />
        </svg>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center font-mono">
          <div class="bg-black/80 border border-emerald-950 p-6 rounded-2xl shadow-lg">
            <span class="text-3xl sm:text-4xl font-black text-emerald-400 block mb-1">03+</span>
            <span class="text-xs text-slate-400 uppercase tracking-wider">Featured Systems Built</span>
          </div>
          <div class="bg-black/80 border border-emerald-950 p-6 rounded-2xl shadow-lg">
            <span class="text-3xl sm:text-4xl font-black text-green-400 block mb-1">&lt; 5ms</span>
            <span class="text-xs text-slate-400 uppercase tracking-wider">Control Loop Latency</span>
          </div>
          <div class="bg-black/80 border border-emerald-950 p-6 rounded-2xl shadow-lg">
            <span class="text-3xl sm:text-4xl font-black text-teal-400 block mb-1">100%</span>
            <span class="text-xs text-slate-400 uppercase tracking-wider">Vue 3 & TS Stack</span>
          </div>
          <div class="bg-black/80 border border-emerald-950 p-6 rounded-2xl shadow-lg">
            <span class="text-3xl sm:text-4xl font-black text-emerald-300 block mb-1">ARM/PIC</span>
            <span class="text-xs text-slate-400 uppercase tracking-wider">Hardware Architecture</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Live GitHub Activity / Commit Ticker Bar -->
    <div class="bg-black/90 border-b border-emerald-950 py-3 px-4 text-xs font-mono text-emerald-400 flex items-center justify-between z-20 backdrop-blur-md">
      <div class="flex items-center space-x-3 overflow-hidden">
        <span class="flex items-center space-x-2"><i class="fa-brands fa-github text-emerald-400"></i><span class="font-bold text-slate-300">GIT_ACTIVITY:</span></span>
        <span class="text-emerald-300 truncate">commit 8f9b21c: optimized PID motor controller firmware algorithm in C++</span>
      </div>
      <div class="hidden sm:flex items-center space-x-2 text-[10px] text-emerald-500 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/40">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
        <span>MAIN BRANCH // STABLE</span>
      </div>
    </div>

    <!-- Live Tech Stats Marquee Ticker Tape -->
    <div class="bg-emerald-950/40 border-b border-emerald-900/40 py-3 overflow-hidden whitespace-nowrap font-mono text-xs text-emerald-400 select-none z-10">
      <div class="inline-block animate-marquee space-x-8 uppercase tracking-widest">
        <span>// VUE 3 & TYPESCRIPT</span>
        <span>✦</span>
        <span>EMBEDDED C FIRMWARE</span>
        <span>✦</span>
        <span>PIC MICROCONTROLLERS</span>
        <span>✦</span>
        <span>KICAD PCB DESIGN</span>
        <span>✦</span>
        <span>TAILWIND CSS</span>
        <span>✦</span>
        <span>PID CONTROL LOOPS</span>
        <span>✦</span>
        <span>DIGITAL LOGIC SIMULATION</span>
        <span>✦</span>
      </div>
    </div>

    <!-- Projects Section with Interactive Tech Tag Filter -->
    <section id="projects" class="py-24 bg-black/60 border-t border-emerald-950 relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div class="space-y-3">
            <h2 class="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">// PORTFOLIO_INDEX</h2>
            <h3 class="text-3xl sm:text-4xl font-black tracking-tight">Featured Hardware & Software</h3>
          </div>
          <!-- Category Filters -->
          <div class="flex flex-wrap gap-2 mt-6 md:mt-0 bg-black/90 backdrop-blur-md p-1.5 rounded-2xl border border-emerald-950 shadow-inner">
            <button @click="selectedTag = null; projectFilter = 'all'" :class="projectFilter === 'all' && !selectedTag ? 'bg-emerald-600 text-black font-extrabold shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:text-white'" class="px-5 py-2 rounded-xl text-sm transition-all font-mono">All</button>
            <button @click="selectedTag = null; projectFilter = 'Embedded Systems'" :class="projectFilter === 'Embedded Systems' && !selectedTag ? 'bg-emerald-600 text-black font-extrabold shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:text-white'" class="px-5 py-2 rounded-xl text-sm transition-all font-mono">Embedded</button>
            <button @click="selectedTag = null; projectFilter = 'Electronics'" :class="projectFilter === 'Electronics' && !selectedTag ? 'bg-emerald-600 text-black font-extrabold shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:text-white'" class="px-5 py-2 rounded-xl text-sm transition-all font-mono">Electronics</button>
          </div>
        </div>

        <!-- Tech Tag Filter Pills -->
        <div class="flex flex-wrap items-center gap-2 mb-12">
          <span class="text-xs font-mono text-emerald-400 mr-2"><i class="fa-solid fa-filter mr-1"></i> Filter by Tech:</span>
          <button v-for="tag in allTechTags" :key="tag" @click="selectedTag = selectedTag === tag ? null : tag" :class="selectedTag === tag ? 'bg-emerald-600 text-black font-bold border-emerald-500 shadow-md' : 'bg-black/80 text-slate-300 border-emerald-950 hover:border-emerald-600/50'" class="px-3 py-1 rounded-lg text-xs font-mono border transition-all">
            {{ tag }}
          </button>
          <button v-if="selectedTag" @click="selectedTag = null" class="text-xs font-mono text-red-400 hover:underline ml-2">Clear Filter</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="project in filteredProjects" :key="project.id" class="bg-black/70 backdrop-blur-xl rounded-3xl overflow-hidden border border-emerald-950 hover:border-emerald-600/60 shadow-xl transition-all duration-300 flex flex-col group transform hover:-translate-y-2">
            <div class="relative overflow-hidden h-56">
              <img :src="getProjectImage(project.id)" :alt="project.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
              <div class="absolute inset-0 bg-gradient-to-t from-[#000201] via-transparent opacity-75"></div>
              <div class="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-600/30 text-[11px] font-mono text-emerald-400">
                {{ project.year }}
              </div>
            </div>
            <div class="p-7 flex-1 flex flex-col justify-between space-y-5">
              <div>
                <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">{{ project.category }}</span>
                <h4 class="text-xl font-bold mt-1.5 mb-2.5 text-white group-hover:text-emerald-400 transition-colors">{{ project.title }}</h4>
                <p class="text-slate-400 text-sm leading-relaxed line-clamp-2">{{ project.description }}</p>
              </div>
              <div class="space-y-4 pt-3 border-t border-emerald-950 flex items-center justify-between">
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="tag in project.tags.slice(0, 2)" :key="tag" class="px-2.5 py-1 rounded-lg bg-black/80 text-emerald-300 text-xs font-mono border border-emerald-950">{{ tag }}</span>
                </div>
                <button @click="openProjectModal(project)" class="px-4 py-2 rounded-xl bg-emerald-600/10 hover:bg-emerald-600 text-emerald-300 hover:text-black hover:font-bold text-xs font-semibold border border-emerald-600/30 transition-all shadow-sm">
                  Inspect <i class="fa-solid fa-arrow-right ml-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills Section with Glowing Tech Meters -->
    <section id="skills" class="py-24 border-t border-emerald-950 relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 class="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">// TECH_STACK</h2>
          <h3 class="text-3xl sm:text-4xl font-black tracking-tight">Skills & Hardware Proficiency</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Frontend & Software -->
          <div class="bg-black/70 backdrop-blur-xl p-8 rounded-3xl border border-emerald-950 shadow-xl hover:border-emerald-600/40 transition-all space-y-6 group">
            <h4 class="text-xl font-bold text-emerald-400 flex items-center gap-2.5"><i class="fa-solid fa-code text-emerald-500"></i> Frontend & Software</h4>
            <div class="space-y-5" v-for="s in skills.frontend" :key="s.name">
              <div class="flex justify-between items-center text-sm font-semibold text-slate-300 font-mono">
                <span class="flex items-center space-x-2.5">
                  <i :class="getSkillIcon(s.name)" class="text-base w-5 text-center"></i>
                  <span>{{ s.name }}</span>
                </span>
                <span class="text-emerald-400 text-xs font-bold">{{ s.level }}%</span>
              </div>
              <div class="w-full h-2.5 bg-black rounded-full overflow-hidden p-0.5 border border-emerald-950">
                <div class="h-full bg-gradient-to-r from-emerald-600 to-green-400 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-all duration-1000" :style="{ width: s.level + '%' }"></div>
              </div>
            </div>
          </div>

          <!-- Backend & Database -->
          <div class="bg-black/70 backdrop-blur-xl p-8 rounded-3xl border border-emerald-950 shadow-xl hover:border-emerald-600/40 transition-all space-y-6 group">
            <h4 class="text-xl font-bold text-green-400 flex items-center gap-2.5"><i class="fa-solid fa-database text-green-500"></i> Backend & Database</h4>
            <div class="space-y-5" v-for="s in skills.backend" :key="s.name">
              <div class="flex justify-between items-center text-sm font-semibold text-slate-300 font-mono">
                <span class="flex items-center space-x-2.5">
                  <i :class="getSkillIcon(s.name)" class="text-base w-5 text-center"></i>
                  <span>{{ s.name }}</span>
                </span>
                <span class="text-green-400 text-xs font-bold">{{ s.level }}%</span>
              </div>
              <div class="w-full h-2.5 bg-black rounded-full overflow-hidden p-0.5 border border-emerald-950">
                <div class="h-full bg-gradient-to-r from-green-600 to-teal-400 rounded-full shadow-[0_0_12px_rgba(34,197,94,0.5)] transition-all duration-1000" :style="{ width: s.level + '%' }"></div>
              </div>
            </div>
          </div>

          <!-- Hardware & Tools -->
          <div class="bg-black/70 backdrop-blur-xl p-8 rounded-3xl border border-emerald-950 shadow-xl hover:border-emerald-600/40 transition-all space-y-6 group">
            <h4 class="text-xl font-bold text-teal-400 flex items-center gap-2.5"><i class="fa-solid fa-microchip text-teal-500"></i> Hardware & Tools</h4>
            <div class="space-y-5" v-for="s in skills.tools" :key="s.name">
              <div class="flex justify-between items-center text-sm font-semibold text-slate-300 font-mono">
                <span class="flex items-center space-x-2.5">
                  <i :class="getSkillIcon(s.name)" class="text-base w-5 text-center"></i>
                  <span>{{ s.name }}</span>
                </span>
                <span class="text-teal-400 text-xs font-bold">{{ s.level }}%</span>
              </div>
              <div class="w-full h-2.5 bg-black rounded-full overflow-hidden p-0.5 border border-emerald-950">
                <div class="h-full bg-gradient-to-r from-teal-600 to-emerald-400 rounded-full shadow-[0_0_12px_rgba(20,184,166,0.5)] transition-all duration-1000" :style="{ width: s.level + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Achievements Section -->
    <section id="achievements" class="py-24 bg-black/60 border-t border-emerald-950 relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 class="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">// MILESTONES</h2>
          <h3 class="text-3xl sm:text-4xl font-black tracking-tight">Achievements & Awards</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="ach in achievements" :key="ach.title" class="bg-black/70 backdrop-blur-xl p-7 rounded-3xl border border-emerald-950 hover:border-emerald-600/60 shadow-xl space-y-4 group transition-all transform hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div class="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center text-xl border border-emerald-600/30 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-black transition-all"><i :class="ach.icon"></i></div>
              <span class="text-xs font-mono font-bold text-slate-400 bg-black px-3 py-1 rounded-xl border border-emerald-950">{{ ach.year }}</span>
            </div>
            <div>
              <h4 class="text-lg font-bold mb-1.5 text-white">{{ ach.title }}</h4>
              <p class="text-sm text-slate-400 leading-relaxed">{{ ach.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Certificates Section -->
    <section id="certificates" class="py-24 border-t border-emerald-950 relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 class="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">// CREDENTIALS</h2>
          <h3 class="text-3xl sm:text-4xl font-black tracking-tight">Licenses & Certificates</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="cert in certificates" :key="cert.title" class="bg-black/70 backdrop-blur-xl p-8 rounded-3xl border border-emerald-950 hover:border-emerald-600/60 shadow-xl flex flex-col justify-between space-y-6 group transition-all">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-600/30 group-hover:rotate-12 transition-transform"><i class="fa-solid fa-award"></i></div>
                <span class="text-xs font-mono text-emerald-400 bg-black px-2.5 py-1 rounded-lg border border-emerald-950">Issued {{ cert.date }}</span>
              </div>
              <h4 class="text-xl font-bold text-white">{{ cert.title }}</h4>
              <p class="text-sm text-emerald-400 font-mono font-bold">{{ cert.issuer }}</p>
              <p class="text-sm text-slate-400 leading-relaxed">{{ cert.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-24 bg-black/60 border-t border-emerald-950 relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-gradient-to-br from-black to-[#000201] backdrop-blur-2xl rounded-3xl p-8 sm:p-16 border border-emerald-950 shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div class="space-y-6">
            <h2 class="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">// GET_IN_TOUCH</h2>
            <h3 class="text-3xl sm:text-4xl font-black tracking-tight">Let's build something amazing together</h3>
            <p class="text-slate-400 leading-relaxed">Have a project in mind, an embedded system to design, or just want to chat? Drop me a message!</p>
            <div class="space-y-4 pt-2 text-slate-300 font-mono text-sm">
              <button @click="copyEmail" class="flex items-center space-x-3.5 group cursor-pointer text-left w-full">
                <div class="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-black transition-all"><i class="fa-solid fa-envelope"></i></div>
                <span class="group-hover:text-emerald-400 transition-colors">{{ copied ? 'Copied to Clipboard!' : profile.email }}</span>
              </button>
              <div class="flex items-center space-x-3.5"><div class="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-emerald-400"><i class="fa-solid fa-phone"></i></div><span>{{ profile.phone }}</span></div>
              <div class="flex items-center space-x-3.5"><div class="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-emerald-400"><i class="fa-solid fa-location-dot"></i></div><span>{{ profile.address }}</span></div>
            </div>
          </div>
          <form @submit.prevent="submitForm" class="space-y-4 bg-black/90 p-8 rounded-2xl border border-emerald-950 shadow-inner">
            <div><label class="block text-xs font-mono text-emerald-400 uppercase mb-1">Your Name</label><input v-model="form.name" type="text" required placeholder="John Doe" class="w-full bg-slate-950 border border-emerald-950 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 font-mono text-sm"></div>
            <div><label class="block text-xs font-mono text-emerald-400 uppercase mb-1">Your Email</label><input v-model="form.email" type="email" required placeholder="john@example.com" class="w-full bg-slate-950 border border-emerald-950 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 font-mono text-sm"></div>
            <div><label class="block text-xs font-mono text-emerald-400 uppercase mb-1">Message</label><textarea v-model="form.message" rows="4" required placeholder="Your message..." class="w-full bg-slate-950 border border-emerald-950 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 font-mono text-sm"></textarea></div>
            <button type="submit" class="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold shadow-lg shadow-emerald-600/30 transition-all font-mono tracking-wide">TRANSMIT MESSAGE</button>
            <p v-if="formSuccess" class="text-emerald-400 text-xs font-mono text-center font-medium mt-2"><i class="fa-solid fa-circle-check mr-1"></i> Transmission successful! Message dispatched.</p>
          </form>
        </div>
      </div>
    </section>

    <!-- Footer with Export JSON Config Easter Egg -->
    <footer class="py-10 bg-[#000201] border-t border-emerald-950 text-center text-xs font-mono text-slate-500 space-y-4 relative z-10">
      <p>&copy; {{ new Date().getFullYear() }} {{ profile.name }} // ALL RIGHTS RESERVED.</p>
      <button @click="exportConfigJSON" class="px-4 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/50 transition-all inline-flex items-center gap-2 cursor-pointer">
        <i class="fa-solid fa-file-code"></i>
        <span>[ EXPORT_CONFIG.JSON ]</span>
      </button>
    </footer>

    <!-- Interactive In-Browser CLI Terminal Drawer -->
    <div v-if="terminalOpen" class="fixed bottom-6 right-6 z-50 w-full max-w-lg bg-black/95 border-2 border-emerald-600/80 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.3)] backdrop-blur-2xl overflow-hidden font-mono text-xs animate-fadeIn">
      <div class="bg-emerald-950/80 px-4 py-2.5 border-b border-emerald-900/60 flex items-center justify-between text-emerald-300">
        <span class="flex items-center gap-2"><i class="fa-solid fa-terminal text-emerald-400"></i> jericho@os-terminal:~</span>
        <button @click="terminalOpen = false" class="text-slate-400 hover:text-white p-1"><i class="fa-solid fa-xmark text-base"></i></button>
      </div>
      <div class="p-4 h-64 overflow-y-auto space-y-2 text-emerald-400 flex flex-col justify-end" ref="terminalBody">
        <div class="text-slate-500 text-[11px]">
          Welcome to Jericho OS v3.2. Type <span class="text-emerald-300 font-bold">'help'</span> for available commands.
        </div>
        <div v-for="(hist, idx) in terminalHistory" :key="idx" class="space-y-1">
          <div class="text-slate-300">> {{ hist.cmd }}</div>
          <div class="text-emerald-300 whitespace-pre-line pl-2">{{ hist.res }}</div>
        </div>
        <div class="flex items-center gap-2 pt-2 border-t border-emerald-950">
          <span class="text-emerald-500">$</span>
          <input v-model="terminalInput" @keyup.enter="handleTerminalCommand" type="text" placeholder="type a command..." class="w-full bg-transparent text-white focus:outline-none font-mono text-xs" autofocus />
        </div>
      </div>
    </div>

    <!-- Interactive Project Modal with Firmware Code Viewer & Hardware Simulator -->
    <div v-if="selectedProject" class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div class="bg-black border border-emerald-600/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        <button @click="selectedProject = null" class="absolute top-6 right-6 text-slate-400 hover:text-white p-2">
          <i class="fa-solid fa-xmark text-xl"></i>
        </button>
        <div class="space-y-2">
          <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">{{ selectedProject.category }} // {{ selectedProject.year }}</span>
          <h3 class="text-2xl font-bold text-white">{{ selectedProject.title }}</h3>
        </div>

        <img :src="getProjectImage(selectedProject.id)" :alt="selectedProject.title" class="w-full h-52 object-cover rounded-2xl border border-emerald-950">
        <p class="text-slate-300 text-sm leading-relaxed">{{ selectedProject.description }}</p>

        <!-- Engineering Specs Badges -->
        <div class="grid grid-cols-3 gap-3 font-mono text-xs text-center">
          <div class="bg-black border border-emerald-950 p-2.5 rounded-xl">
            <span class="text-slate-400 block text-[10px]">CONTROL LOOP</span>
            <span class="text-emerald-400 font-bold">PID Algorithmic</span>
          </div>
          <div class="bg-black border border-emerald-950 p-2.5 rounded-xl">
            <span class="text-slate-400 block text-[10px]">RESPONSE TIME</span>
            <span class="text-emerald-400 font-bold">&lt; 5ms Latency</span>
          </div>
          <div class="bg-black border border-emerald-950 p-2.5 rounded-xl">
            <span class="text-slate-400 block text-[10px]">STATUS</span>
            <span class="text-emerald-400 font-bold">Verified Stable</span>
          </div>
        </div>

        <!-- Virtual Hardware Simulator Widget -->
        <div v-if="selectedProject.hardwareSim" class="bg-slate-950 border border-emerald-950 rounded-2xl p-4 font-mono text-xs space-y-3">
          <div class="flex items-center justify-between text-emerald-400 pb-2 border-b border-emerald-950">
            <span><i class="fa-solid fa-microchip mr-1.5"></i> Virtual MCU Simulator</span>
            <span class="text-[10px] bg-emerald-950 px-2 py-0.5 rounded text-emerald-300 animate-pulse">ACTIVE</span>
          </div>
          <div class="flex items-center justify-between text-slate-300">
            <span>Sensor Signal State:</span>
            <span :class="simulatedState ? 'text-emerald-400 font-bold' : 'text-slate-500'">{{ simulatedState ? 'HIGH [1] (Path Detected)' : 'LOW [0] (Searching)' }}</span>
          </div>
          <button @click="simulatedState = !simulatedState" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold text-xs transition-all w-full">
            Toggle Signal Input
          </button>
        </div>

        <!-- Firmware Code Snippet Drawer -->
        <div class="bg-slate-950 border border-emerald-950 rounded-2xl p-4 font-mono text-xs space-y-2">
          <div class="flex items-center justify-between text-emerald-400 border-b border-emerald-950 pb-2">
            <span><i class="fa-solid fa-code mr-1"></i> Firmware Source (C++ / Arduino)</span>
            <span class="text-[10px] text-slate-600">main.cpp</span>
          </div>
          <pre class="text-emerald-300 overflow-x-auto p-2 bg-black rounded-lg text-[11px] leading-relaxed"><code>{{ getProjectCodeSnippet(selectedProject.id) }}</code></pre>
        </div>

        <div class="flex flex-wrap gap-2">
          <span v-for="tag in selectedProject.tags" :key="tag" class="px-3 py-1 rounded-lg bg-black text-emerald-300 text-xs font-mono border border-emerald-950">{{ tag }}</span>
        </div>
        <div class="flex items-center justify-end space-x-4 pt-4 border-t border-emerald-950">
          <button @click="selectedProject = null" class="px-6 py-2.5 rounded-xl bg-slate-900 text-slate-300 hover:bg-slate-800 font-semibold text-sm">Close Inspection</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted, nextTick } from 'vue';
import { portfolioData } from './portfolioData';
import myPhoto from './assets/avatar1.jpg';
import picBoardPhoto from './assets/PicBoard.jpg';
import lineFollowerPhoto from './assets/LineFollower.jpg';
import logicGates from './assets/LogicGates.jpg';


const profile = portfolioData.profile;
const projects = portfolioData.projects;
const skills = portfolioData.skills;
const achievements = portfolioData.achievements;
const certificates = portfolioData.certificates;

const loading = ref(true);
const bootProgress = ref(0);
const bootLogs = ref<string[]>([]);
const mobileMenuOpen = ref(false);
const projectFilter = ref('all');
const selectedTag = ref<string | null>(null);
const formSuccess = ref(false);
const copied = ref(false);
const tiltCard = ref<HTMLElement | null>(null);
const selectedProject = ref<any>(null);
const simulatedState = ref(false);
const liveTime = ref('');
const cpuLoad = ref(14);
const cursorX = ref(0);
const cursorY = ref(0);
const audioEnabled = ref(false);
const matrixCanvas = ref<HTMLCanvasElement | null>(null);
const matrixOverdrive = ref(false);

// Terminal CLI State
const terminalOpen = ref(false);
const terminalInput = ref('');
const terminalHistory = ref<Array<{ cmd: string, res: string }>>([]);
const terminalBody = ref<HTMLElement | null>(null);

const handleMouseMove = (e: MouseEvent) => {
  cursorX.value = e.clientX;
  cursorY.value = e.clientY;
};

// Web Audio API Synthesizer for Hacker UI Clicks
const toggleAudio = () => {
  audioEnabled.value = !audioEnabled.value;
  if (audioEnabled.value) {
    playBeep(800, 0.05);
  }
};

const playBeep = (freq: number, duration: number) => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio context restricted before user interaction
  }
};

const playClickSound = () => {
  if (!audioEnabled.value) return;
  playBeep(600, 0.03);
};

// CLI Terminal Command Handler
const handleTerminalCommand = () => {
  const query = terminalInput.value.trim().toLowerCase();
  if (!query) return;

  let response = '';
  if (query === 'help') {
    response = 'Available commands:\n- whoami: Display profile summary\n- skills: List technical competencies\n- projects: Show hardware & software systems\n- contact: Get communication channels\n- sudo hire: Unlock recruiter priority mode\n- clear: Clear terminal output';
  } else if (query === 'whoami') {
    response = `${profile.name} // ${profile.title}\nMajor: Computer Engineering\nLocation: ${profile.address}`;
  } else if (query === 'skills') {
    response = 'Frontend: Vue 3, TypeScript, Tailwind CSS\nBackend & DB: Node.js, SQL\nHardware: PIC Microcontrollers, Embedded C, KiCad, PCB Design';
  } else if (query === 'projects') {
    response = projects.map(p => `[${p.year}] ${p.title} (${p.category})`).join('\n');
  } else if (query === 'contact') {
    response = `Email: ${profile.email}\nPhone: ${profile.phone}\nGitHub: ${profile.githubUrl}`;
  } else if (query === 'sudo hire') {
    response = 'ACCESS GRANTED! Priority recruiter status verified. Reach out directly at jerichofragata811@gmail.com!';
  } else if (query === 'clear') {
    terminalHistory.value = [];
    terminalInput.value = '';
    return;
  } else {
    response = `Command not recognized: '${query}'. Type 'help' for valid commands.`;
  }

  terminalHistory.value.push({ cmd: terminalInput.value, res: response });
  terminalInput.value = '';
  nextTick(() => {
    if (terminalBody.value) {
      terminalBody.value.scrollTop = terminalBody.value.scrollHeight;
    }
  });
};

// Konami Code Listener
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

const handleKeyDown = (e: KeyboardEvent) => {
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (key === konamiSequence[konamiIndex].toLowerCase()) {
    konamiIndex++;
    if (konamiIndex === konamiSequence.length) {
      matrixOverdrive.value = true;
      playBeep(1000, 0.3);
      setTimeout(() => matrixOverdrive.value = false, 5000);
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
};

// Neural Matrix Particle Constellation Canvas Simulation
let animationFrameId: number;
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);

  const logs = [
    'Loading system kernel...',
    'Mounting hardware drivers & GPIO...',
    'Linking Vue 3 & TypeScript modules...',
    'Establishing secure telemetry link...',
    'System ready. Welcome, visitor!'
  ];

  let i = 0;
  const interval = setInterval(() => {
    if (i < logs.length) {
      bootLogs.value.push(logs[i]);
      bootProgress.value += 20;
      i++;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        loading.value = false;
      }, 500);
    }
  }, 250);

  const updateTelemetry = () => {
    const now = new Date();
    liveTime.value = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Manila' });
    cpuLoad.value = Math.floor(Math.random() * 15) + 10;
  };
  updateTelemetry();
  setInterval(updateTelemetry, 2000);

  // Particle Canvas Setup
  const canvas = matrixCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const handleResize = () => {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', handleResize);

  const particles: Array<{ x: number, y: number, vx: number, vy: number, size: number }> = [];
  const particleCount = 45;
  for (let p = 0; p < particleCount; p++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      size: Math.random() * 2 + 1
    });
  }

  const render = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.7)';
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';

    particles.forEach((pt, index) => {
      pt.x += pt.vx;
      pt.y += pt.vy;
      if (pt.x < 0 || pt.x > width) pt.vx *= -1;
      if (pt.y < 0 || pt.y > height) pt.vy *= -1;

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
      ctx.fill();

      for (let j = index + 1; j < particles.length; j++) {
        const pt2 = particles[j];
        const dist = Math.hypot(pt.x - pt2.x, pt.y - pt2.y);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y);
          ctx.lineTo(pt2.x, pt2.y);
          ctx.stroke();
        }
      }
    });

    animationFrameId = requestAnimationFrame(render);
  };
  render();

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('resize', handleResize);
    cancelAnimationFrame(animationFrameId);
  });
});

// Extract all unique tags for tag filtering
const allTechTags = computed(() => {
  const tagsSet = new Set<string>();
  projects.forEach(p => p.tags.forEach(t => tagsSet.add(t)));
  return Array.from(tagsSet);
});

const form = reactive({ name: '', email: '', message: '' });

const filteredProjects = computed(() => {
  let list = projects;
  if (selectedTag.value) {
    return list.filter(p => p.tags.includes(selectedTag.value!));
  }
  if (projectFilter.value !== 'all') {
    return list.filter(p => p.category === projectFilter.value);
  }
  return list;
});

const getProjectImage = (id: number) => {
  if (id === 1) return lineFollowerPhoto;
  if (id === 2) return picBoardPhoto;
  if (id === 3) return logicGates;
  return myPhoto;
};

// Firmware code snippets for project inspection drawer
const getProjectCodeSnippet = (id: number) => {
  if (id === 1) {
    return `#include <PID_v1.h>\n// Line Follower PID Control Loop\ndouble Setpoint, Input, Output;\ndouble Kp=2.0, Ki=5.0, Kd=1.0;\nPID myPID(&Input, &Output, &Setpoint, Kp, Ki, Kd, DIRECT);\n\nvoid setup() {\n  pinMode(A0, INPUT); // IR Sensor Array\n  myPID.SetMode(AUTOMATIC);\n}\nvoid loop() {\n  Input = analogRead(A0);\n  myPID.Compute();\n  motorDrive(Output);\n}`;
  } else if (id === 2) {
    return `// PIC Microcontroller I/O & Sensor Polling\n#include <xc.h>\nvoid main(void) {\n  TRISB = 0x01; // Set RB0 as input\n  PORTC = 0x00; // Clear output port\n  while(1) {\n    if(PORTBbits.RB0 == 1) {\n      PORTCbits.RC0 = 1; // Trigger IoT Module\n    }\n  }\n}`;
  } else {
    return `// Digital Logic Gates Simulation\nfunction evaluateGate(type, a, b) {\n  if (type === 'AND') return a && b;\n  if (type === 'OR') return a || b;\n  if (type === 'XOR') return a !== b;\n  if (type === 'NOT') return !a;\n  return 0;\n}`;
  }
};

// Skill Icon Mapping helper
const getSkillIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('vue')) return 'fa-brands fa-vuejs text-emerald-400';
  if (n.includes('typescript')) return 'fa-solid fa-code text-blue-400';
  if (n.includes('tailwind')) return 'fa-solid fa-palette text-cyan-400';
  if (n.includes('html')) return 'fa-brands fa-html5 text-orange-400';
  if (n.includes('node')) return 'fa-brands fa-node-js text-green-400';
  if (n.includes('python')) return 'fa-brands fa-python text-yellow-400';
  if (n.includes('java') && !n.includes('script')) return 'fa-brands fa-java text-red-400';
  if (n.includes('c++') || n.includes('c (embedded)')) return 'fa-solid fa-file-code text-blue-500';
  if (n.includes('sql') || n.includes('database')) return 'fa-solid fa-database text-emerald-400';
  if (n.includes('api')) return 'fa-solid fa-network-wired text-teal-400';
  if (n.includes('git')) return 'fa-brands fa-git-alt text-red-400';
  if (n.includes('docker') || n.includes('aws')) return 'fa-brands fa-aws text-amber-400';
  if (n.includes('vite') || n.includes('webpack')) return 'fa-solid fa-bolt text-yellow-400';
  return 'fa-solid fa-check text-emerald-400';
};

const openProjectModal = (project: any) => {
  selectedProject.value = project;
  simulatedState.value = false;
};

const copyEmail = () => {
  navigator.clipboard.writeText(profile.email);
  copied.value = true;
  setTimeout(() => copied.value = false, 3000);
};

// Interactive 3D Tilt Effect
const handleTilt = (e: MouseEvent) => {
  if (!tiltCard.value) return;
  const card = tiltCard.value.querySelector('div:nth-child(2)') as HTMLElement;
  if (!card) return;
  const rect = tiltCard.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const rotateX = ((y - centerY) / centerY) * -10;
  const rotateY = ((x - centerX) / centerX) * 10;
  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
};

const resetTilt = () => {
  if (!tiltCard.value) return;
  const card = tiltCard.value.querySelector('div:nth-child(2)') as HTMLElement;
  if (!card) return;
  card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
};

const downloadCV = () => {
  const link = document.createElement('a');
  link.href = profile.cvUrl;
  link.download = 'Jericho_Fragata_Resume.pdf';
  link.click();
};

const exportConfigJSON = () => {
  const configData = {
    profile,
    skills,
    projects,
    achievements,
    certificates,
    exportTimestamp: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Jericho_Fragata_Profile_Config.json';
  link.click();
  URL.revokeObjectURL(url);
};

const submitForm = () => {
  formSuccess.value = true;
  form.name = ''; form.email = ''; form.message = '';
  setTimeout(() => formSuccess.value = false, 5000);
};
</script>

<style>
@keyframes marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}
.animate-marquee {
  display: inline-block;
  animation: marquee 25s linear infinite;
}
</style>