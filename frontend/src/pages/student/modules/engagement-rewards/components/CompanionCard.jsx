export default function CompanionCard() {
  return (
    <div className="group relative flex h-full min-h-[420px] flex-col items-center justify-end overflow-hidden rounded-[2rem] border border-blue-500/30 bg-gradient-to-tr from-[#0b121e] to-[#121c2c] p-8 shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all duration-700 hover:border-blue-400/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-x-0 top-10 bottom-0 bg-cover bg-bottom opacity-90 mix-blend-screen transition-transform duration-[1500ms] ease-out group-hover:scale-110 group-hover:-translate-y-2"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=800&auto=format&fit=crop)",
            filter: "hue-rotate(180deg) saturate(1.5) contrast(1.2)",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e19] via-[#0a0e19]/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e19]/50 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_100%)] opacity-0 transition-opacity duration-1000 group-hover:opacity-100"></div>
      </div>

      <div className="relative z-10 flex w-full flex-col">
        <div className="mx-auto mb-5 w-fit rounded-full border border-cyan-400/50 bg-blue-900/40 px-3.5 py-1.5 text-[9px] font-extrabold tracking-widest text-cyan-300 uppercase shadow-[0_0_15px_rgba(34,211,238,0.3)] backdrop-blur-md">
          COMPANION VER. 2.4
        </div>

        <h3 className="mb-3 text-center font-sans text-3xl font-extrabold tracking-widest text-white drop-shadow-[0_2px_10px_rgba(59,130,246,0.8)]">
          AURA-01
        </h3>

        <p className="mb-10 line-clamp-2 px-4 text-center text-[11px] font-bold tracking-wide text-blue-100/70">
          &quot;Your focus score is up by 12% today. Shall we begin the next
          session?&quot;
        </p>

        <div className="relative w-full">
          <div className="mb-2 flex items-center justify-end text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
            EVOLUTION 75%
          </div>
          <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-blue-900/60 shadow-inner">
            <div className="relative w-[75%] overflow-hidden rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-300 shadow-[0_0_15px_rgba(34,211,238,1)] after:absolute after:inset-0 after:-translate-x-full after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent after:transition-transform after:duration-1000 after:ease-in-out group-hover:after:translate-x-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
