import { Skeleton } from '@/components/ui/skeleton'

export function ChargerSkeleton() {
  return (
    <div className="rounded-2xl border-2 border-border p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div>
            <Skeleton className="mb-2 h-5 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </div>
  )
}

export function ChargerListSkeleton() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <ChargerSkeleton />
      <ChargerSkeleton />
    </div>
  )
}
