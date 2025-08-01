export function BackgroundEclipses() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Eclipse do topo */}
      <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#4338CA] opacity-30 blur-[200px] rounded-full" />

      {/* Eclipse de baixo */}
      <div className="absolute bottom-[-300px] right-1/2 translate-x-1/2 w-[700px] h-[700px] bg-[#4338CA] opacity-10 blur-[200px] rounded-full" />
    </div>
  );
}