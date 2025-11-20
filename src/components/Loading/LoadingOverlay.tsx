"use client";

export function LoadingOverlay({ message = "Carregando..." }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="h-12 w-12 border-4 border-gray-600 border-t-white rounded-full animate-spin" />

        <p className="text-white text-sm opacity-80">{message}</p>
      </div>
    </div>
  );
}
