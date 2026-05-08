'use client'

import { Check, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  chargerName: string
  date: string
  time: string
}

export function SuccessModal({ isOpen, onClose, chargerName, date, time }: SuccessModalProps) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-background p-8 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold">
          <Check className="h-10 w-10 text-charcoal" strokeWidth={3} />
        </div>
        
        <h2 className="mb-2 text-2xl font-semibold text-foreground">
          Reserva confirmada!
        </h2>
        <p className="mb-6 text-muted-foreground">
          O seu carregamento foi reservado com sucesso.
        </p>
        
        <div className="mb-8 rounded-2xl bg-gray-light p-4">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Zap className="h-5 w-5 text-gold" />
            <span className="font-medium text-foreground">{chargerName}</span>
          </div>
          <p className="text-sm text-muted-foreground">{date}</p>
          <p className="text-lg font-semibold text-foreground">{time}</p>
        </div>
        
        <Button
          onClick={onClose}
          className="w-full rounded-xl bg-charcoal py-5 text-base font-semibold text-white hover:bg-charcoal/90"
        >
          Fechar
        </Button>
      </div>
    </div>
  )
}
