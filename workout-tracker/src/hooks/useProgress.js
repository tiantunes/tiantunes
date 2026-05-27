import { useState, useCallback, useEffect } from 'react'
import { WORKOUT_PLAN } from '../data/workouts'

const STORAGE_KEY = 'treino15dias_v1'

function buildInitialState() {
  const days = {}
  for (let d = 1; d <= 15; d++) {
    const plan = WORKOUT_PLAN[d]
    const exercises = {}
    for (const ex of plan.exercises) {
      exercises[ex.id] = { completed: false, completedAt: null }
    }
    days[d] = {
      completed: false,
      completedAt: null,
      exercises,
      steps: null,
    }
  }
  return {
    startDate: null,
    days,
    measurements: {
      day1: { weight: null, waist: null, hip: null, arm: null },
      day15: { weight: null, waist: null, hip: null, arm: null },
    },
  }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return buildInitialState()
    const saved = JSON.parse(raw)
    // merge in case new exercises were added
    const fresh = buildInitialState()
    return {
      ...fresh,
      ...saved,
      days: Object.fromEntries(
        Object.entries(fresh.days).map(([d, freshDay]) => [
          d,
          {
            ...freshDay,
            ...(saved.days?.[d] ?? {}),
            exercises: {
              ...freshDay.exercises,
              ...(saved.days?.[d]?.exercises ?? {}),
            },
          },
        ])
      ),
      measurements: {
        ...fresh.measurements,
        ...(saved.measurements ?? {}),
      },
    }
  } catch {
    return buildInitialState()
  }
}

function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

export function useProgress() {
  const [state, setState] = useState(() => load())

  useEffect(() => {
    save(state)
  }, [state])

  const toggleExercise = useCallback((dayNum, exerciseId) => {
    setState((prev) => {
      const day = prev.days[dayNum]
      const ex = day.exercises[exerciseId]
      const nowCompleted = !ex.completed
      return {
        ...prev,
        days: {
          ...prev.days,
          [dayNum]: {
            ...day,
            exercises: {
              ...day.exercises,
              [exerciseId]: {
                completed: nowCompleted,
                completedAt: nowCompleted ? new Date().toISOString() : null,
              },
            },
          },
        },
      }
    })
  }, [])

  const completeDay = useCallback((dayNum) => {
    setState((prev) => ({
      ...prev,
      startDate: prev.startDate ?? new Date().toISOString().split('T')[0],
      days: {
        ...prev.days,
        [dayNum]: {
          ...prev.days[dayNum],
          completed: true,
          completedAt: new Date().toISOString(),
        },
      },
    }))
  }, [])

  const uncompleteDay = useCallback((dayNum) => {
    setState((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [dayNum]: {
          ...prev.days[dayNum],
          completed: false,
          completedAt: null,
        },
      },
    }))
  }, [])

  const setSteps = useCallback((dayNum, steps) => {
    setState((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [dayNum]: { ...prev.days[dayNum], steps },
      },
    }))
  }, [])

  const saveMeasurements = useCallback((which, data) => {
    setState((prev) => ({
      ...prev,
      measurements: { ...prev.measurements, [which]: data },
    }))
  }, [])

  const reset = useCallback(() => {
    const fresh = buildInitialState()
    setState(fresh)
  }, [])

  // derived stats
  const completedDays = Object.values(state.days).filter((d) => d.completed).length

  const gymDays = Object.entries(state.days).filter(([d, day]) => {
    const plan = WORKOUT_PLAN[d]
    return day.completed && plan.type === 'strength'
  }).length

  const streak = (() => {
    let s = 0
    for (let d = 15; d >= 1; d--) {
      if (state.days[d].completed) s++
      else break
    }
    return s
  })()

  const activeDayNum = (() => {
    for (let d = 1; d <= 15; d++) {
      if (!state.days[d].completed) return d
    }
    return null
  })()

  return {
    state,
    completedDays,
    gymDays,
    streak,
    activeDayNum,
    toggleExercise,
    completeDay,
    uncompleteDay,
    setSteps,
    saveMeasurements,
    reset,
  }
}
