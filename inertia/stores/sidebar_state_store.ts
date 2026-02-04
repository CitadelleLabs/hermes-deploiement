import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type State = {
  activeItems: string[]
}

type Actions = {
  toggleItem: (id: string) => void
  isActive: (id: string) => boolean
}

const storageKey = 'sidebar_state'

const initialState: State = {
  activeItems: ['statistics', 'leaderboard', 'tools', 'status'],
}

export const useSidebarStateStore = create(
  persist<State & Actions>(
    (set, get) => ({
      ...initialState,
      toggleItem(item) {
        set((state) => {
          const activeItems = state.activeItems.includes(item)
            ? state.activeItems.filter((i) => i !== item)
            : [...state.activeItems, item]

          return { activeItems }
        })
      },
      isActive(item) {
        return get().activeItems.includes(item)
      },
    }),
    {
      name: storageKey,
      storage: createJSONStorage(() => localStorage),
    }
  )
)