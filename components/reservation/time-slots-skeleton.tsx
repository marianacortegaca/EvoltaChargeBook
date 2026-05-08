import { Skeleton } from '@/components/ui/skeleton'

export function TimeSlotsSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
      {Array.from({ length: 16 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full rounded-lg" />
      ))}
    </div>
  )
}
