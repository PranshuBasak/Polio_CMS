import { Skeleton } from "./skeleton"

export function HeroSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center py-20">
      <div className="text-center space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-32 w-32 rounded-full mx-auto" />
        <Skeleton className="h-12 w-96 mx-auto" />
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-24 w-full" />
        <div className="flex gap-4 justify-center">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  )
}

export function ProjectsSkeleton() {
  return (
    <section className="py-20">
      <div className="space-y-8">
        <Skeleton className="h-12 w-64 mx-auto" />
        <Skeleton className="h-6 w-96 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function BlogSkeleton() {
  return (
    <section className="py-20">
      <div className="space-y-8">
        <Skeleton className="h-12 w-64 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-10 w-24 mt-4" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function SkillsSkeleton() {
  return (
    <section className="py-20">
      <div className="space-y-8">
        <Skeleton className="h-12 w-64 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function TestimonialsSkeleton() {
  return (
    <section className="py-20">
      <div className="space-y-8">
        <Skeleton className="h-12 w-64 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-4 p-6 border rounded-lg">
              <Skeleton className="h-20 w-full" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ContactSkeleton() {
  return (
    <section className="py-20">
      <div className="space-y-8 max-w-2xl mx-auto">
        <Skeleton className="h-12 w-64 mx-auto" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </section>
  )
}
