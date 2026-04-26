export default function CompanionCard() {
  return (
    <div className="relative flex h-full min-h-[300px] flex-col items-center justify-end overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-md transition-all hover:shadow-lg cursor-pointer">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.03] mix-blend-multiply"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=800&auto=format&fit=crop)" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50/80 via-white/40 to-transparent"></div>
      </div>

      <div className="relative z-10 flex w-full flex-col">
        <div className="mx-auto mb-3 w-fit rounded-full bg-purple-100 px-3 py-1 text-[10px] font-bold tracking-widest text-purple-600 uppercase">
          COMPANION VER. 2.4
        </div>
        <h3 className="mb-2 text-center text-2xl font-extrabold tracking-wide text-gray-900">
          AURA-01
        </h3>
        <p className="mb-6 text-center text-xs font-medium text-gray-500">
          "Your focus score is up by 12% today. Shall we begin the next session?"
        </p>

        <div className="w-full">
          <div className="mb-1 flex items-center justify-between text-[10px] font-bold tracking-widest text-purple-600 uppercase">
            <span>Evolution</span>
            <span>75%</span>
          </div>
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-purple-100">
            <div className="w-[75%] rounded-full bg-purple-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
