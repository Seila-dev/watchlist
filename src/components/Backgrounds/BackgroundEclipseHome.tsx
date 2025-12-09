export function BackgroundHome() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Eclipse do topo */}
      <div
        className="absolute top-[-500px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[200px] transform-gpu"
        style={{ backgroundColor: 'rgba(67, 56, 202, 0.15)' }}
      />
    </div>
  );
}
