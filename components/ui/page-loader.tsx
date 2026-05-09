import Image from 'next/image'

export function PageLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Image 
          src="/logo.png" 
          alt="EVOLTA" 
          width={48} 
          height={48} 
          className="animate-pulse rounded-xl"
          priority
        />
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold [animation-delay:-0.3s]" />
          <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold [animation-delay:-0.15s]" />
          <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold" />
        </div>
      </div>
    </div>
  )
}
