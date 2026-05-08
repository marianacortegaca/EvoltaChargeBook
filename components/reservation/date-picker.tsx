'use client'

import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DatePickerProps {
  selectedDate: Date
  onSelectDate: (date: Date) => void
}

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export function DatePicker({ selectedDate, onSelectDate }: DatePickerProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const currentYear = today.getFullYear()
  const availableYears = [currentYear, currentYear + 1]
  
  const selectedYear = selectedDate.getFullYear()
  const selectedMonth = selectedDate.getMonth()
  const selectedDay = selectedDate.getDate()
  
  // Get days in the selected month
  const daysInMonth = useMemo(() => {
    const days: Date[] = []
    const year = selectedYear
    const month = selectedMonth
    const lastDay = new Date(year, month + 1, 0).getDate()
    
    for (let day = 1; day <= lastDay; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }, [selectedYear, selectedMonth])
  
  // Get first day of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay()
  
  // Handle year change
  const handleYearChange = (year: string) => {
    const newDate = new Date(selectedDate)
    newDate.setFullYear(parseInt(year))
    // Adjust day if it exceeds the new month's days
    const lastDayOfNewMonth = new Date(parseInt(year), newDate.getMonth() + 1, 0).getDate()
    if (newDate.getDate() > lastDayOfNewMonth) {
      newDate.setDate(lastDayOfNewMonth)
    }
    onSelectDate(newDate)
  }
  
  // Handle month change
  const handleMonthChange = (month: string) => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(parseInt(month))
    // Adjust day if it exceeds the new month's days
    const lastDayOfNewMonth = new Date(newDate.getFullYear(), parseInt(month) + 1, 0).getDate()
    if (newDate.getDate() > lastDayOfNewMonth) {
      newDate.setDate(lastDayOfNewMonth)
    }
    onSelectDate(newDate)
  }
  
  // Handle day selection
  const handleDaySelect = (day: Date) => {
    onSelectDate(day)
  }
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    const newDate = new Date(selectedYear, selectedMonth - 1, 1)
    // Don't go before current month
    if (newDate >= new Date(currentYear, today.getMonth(), 1)) {
      const lastDayOfNewMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate()
      newDate.setDate(Math.min(selectedDay, lastDayOfNewMonth))
      onSelectDate(newDate)
    }
  }
  
  // Navigate to next month
  const goToNextMonth = () => {
    const newDate = new Date(selectedYear, selectedMonth + 1, 1)
    // Don't go beyond next year December
    if (newDate <= new Date(currentYear + 1, 11, 31)) {
      const lastDayOfNewMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate()
      newDate.setDate(Math.min(selectedDay, lastDayOfNewMonth))
      onSelectDate(newDate)
    }
  }
  
  // Check if we can go to previous month
  const canGoPrevious = selectedYear > currentYear || selectedMonth > today.getMonth()
  
  // Check if we can go to next month
  const canGoNext = selectedYear < currentYear + 1 || selectedMonth < 11
  
  // Check if a day is in the past
  const isPastDay = (day: Date) => {
    return day < today
  }
  
  // Check if a day is today
  const isToday = (day: Date) => {
    return day.toDateString() === today.toDateString()
  }
  
  // Check if a day is selected
  const isSelected = (day: Date) => {
    return day.toDateString() === selectedDate.toDateString()
  }
  
  return (
    <div className="space-y-4">
      {/* Year and Month Selectors */}
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPreviousMonth}
          disabled={!canGoPrevious}
          className="h-9 w-9 shrink-0"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Mês anterior</span>
        </Button>
        
        <div className="flex flex-1 items-center justify-center gap-2">
          <Select value={selectedMonth.toString()} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[140px] border-gold/30 focus:ring-gold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {monthNames.map((month, index) => {
                // Disable past months in current year
                const isDisabled = selectedYear === currentYear && index < today.getMonth()
                return (
                  <SelectItem 
                    key={month} 
                    value={index.toString()}
                    disabled={isDisabled}
                  >
                    {month}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          
          <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[100px] border-gold/30 focus:ring-gold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextMonth}
          disabled={!canGoNext}
          className="h-9 w-9 shrink-0"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Próximo mês</span>
        </Button>
      </div>
      
      {/* Day Names Header */}
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map(dayName => (
          <div
            key={dayName}
            className="py-2 text-center text-xs font-medium text-muted-foreground"
          >
            {dayName}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before the first day of the month */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="h-10" />
        ))}
        
        {/* Day buttons */}
        {daysInMonth.map(day => {
          const past = isPastDay(day)
          const todayDate = isToday(day)
          const selected = isSelected(day)
          
          return (
            <button
              key={day.toISOString()}
              onClick={() => !past && handleDaySelect(day)}
              disabled={past}
              className={cn(
                'flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium transition-all duration-150',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1',
                selected && 'bg-gold text-charcoal shadow-md shadow-gold/20',
                !selected && !past && 'hover:bg-gold/10',
                !selected && todayDate && 'border-2 border-gold/50',
                past && 'cursor-not-allowed text-muted-foreground/40'
              )}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
