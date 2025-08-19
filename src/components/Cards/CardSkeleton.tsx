export function CardSkeleton() {
  return (
    <div className="relative w-[288px] h-[395px] rounded-2xl overflow-hidden bg-gray-700 animate-pulse">

      <div className="absolute w-full p-3 bottom-1 left-0 flex flex-col gap-2">
        <div className="flex w-full justify-between mb-1">
          <div className="bg-gray-600 px-3 rounded-full text-xs font-semibold w-16 h-6"></div>
          <div className="bg-gray-600 rounded-full w-6 h-6"></div>
        </div>

        <div className="h-6 bg-gray-600 rounded w-3/4 mb-1"></div>
        <div className="h-4 bg-gray-600 rounded w-1/2"></div>
      </div>
    </div>
  );
}
