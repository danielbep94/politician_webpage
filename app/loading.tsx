/**
 * app/loading.tsx — shown by Next.js during server component data fetching.
 * Matches the visual layout of the homepage hero + section grid.
 */

function SkeletonBar({
  className = ""
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-slate-200 ${className}`}
      aria-hidden="true"
    />
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-[1.75rem] border border-line bg-white p-5 sm:p-6">
      <SkeletonBar className="h-4 w-1/3" />
      <SkeletonBar className="mt-4 h-6 w-3/4" />
      <SkeletonBar className="mt-3 h-4 w-full" />
      <SkeletonBar className="mt-2 h-4 w-5/6" />
      <SkeletonBar className="mt-6 h-10 w-32 rounded-full" />
    </div>
  );
}

export default function Loading() {
  return (
    <div aria-label="Cargando contenido..." aria-busy="true">
      {/* Hero skeleton */}
      <div className="border-b border-line bg-hero-grid py-14 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16">
            <div className="space-y-7">
              <SkeletonBar className="h-6 w-44 rounded-full" />
              <div className="space-y-4">
                <SkeletonBar className="h-12 w-full" />
                <SkeletonBar className="h-12 w-5/6" />
                <SkeletonBar className="h-12 w-4/6" />
                <SkeletonBar className="mt-4 h-5 w-full" />
                <SkeletonBar className="h-5 w-3/4" />
              </div>
              <div className="flex gap-3">
                <SkeletonBar className="h-12 w-44 rounded-full" />
                <SkeletonBar className="h-12 w-44 rounded-full" />
              </div>
            </div>
            <SkeletonBar className="hidden h-72 rounded-[2rem] md:block" />
          </div>
        </div>
      </div>

      {/* Section skeleton — repeated twice */}
      {[0, 1].map((i) => (
        <div
          key={i}
          className={`py-14 sm:py-16 lg:py-20 ${i % 2 === 1 ? "bg-surface-alt" : ""}`}
        >
          <div className="mx-auto max-w-7xl space-y-8 px-5 sm:px-6 sm:space-y-10 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-3">
                <SkeletonBar className="h-4 w-24" />
                <SkeletonBar className="h-8 w-96 max-w-full" />
              </div>
              <SkeletonBar className="h-10 w-28 rounded-full" />
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((j) => (
                <SkeletonCard key={j} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
