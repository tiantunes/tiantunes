import { useState, useEffect } from 'react'
import Home from './components/Home'
import DayDetail from './components/DayDetail'
import { useProgress } from './hooks/useProgress'

function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-emerald-600 text-white rounded-full shadow-xl text-sm font-bold whitespace-nowrap animate-fade-in-down">
      {message}
    </div>
  )
}

export default function App() {
  const [view, setView] = useState('home') // 'home' | 'day'
  const [selectedDay, setSelectedDay] = useState(null)
  const [toast, setToast] = useState(null)
  const progress = useProgress()

  const handleSelectDay = (dayNum) => {
    setSelectedDay(dayNum)
    setView('day')
  }

  const handleBack = () => {
    setView('home')
    setSelectedDay(null)
  }

  const showToast = (msg) => {
    setToast(msg)
  }

  return (
    <>
      {view === 'home' && (
        <Home progress={progress} onSelectDay={handleSelectDay} />
      )}
      {view === 'day' && selectedDay && (
        <DayDetail
          dayNum={selectedDay}
          progress={progress}
          onBack={handleBack}
          onShowToast={showToast}
        />
      )}
      {toast && (
        <Toast message={toast} onDone={() => setToast(null)} />
      )}
    </>
  )
}
