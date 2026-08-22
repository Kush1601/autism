export function GameProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Round ${current + 1} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={
            i < current
              ? "h-2 w-2 rounded-full bg-pine-500"
              : i === current
                ? "h-2.5 w-2.5 rounded-full bg-pine-600 ring-4 ring-pine-100"
                : "h-2 w-2 rounded-full bg-pine-100"
          }
        />
      ))}
    </div>
  );
}
