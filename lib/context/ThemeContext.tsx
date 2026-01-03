'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
    theme: Theme
    toggleTheme: () => void
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('light')

    useEffect(() => {
        // Initialize theme from localStorage or default to light
        const storedTheme = localStorage.getItem('nft-theme') as Theme | null
        const initialTheme = storedTheme || 'light'
        setThemeState(initialTheme)
        applyTheme(initialTheme)
    }, [])

    const applyTheme = (newTheme: Theme) => {
        const root = document.documentElement
        root.setAttribute('data-theme', newTheme)

        // Tailwind dark mode support
        if (newTheme === 'dark') {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }

        localStorage.setItem('nft-theme', newTheme)
    }

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
        applyTheme(newTheme)
    }

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light')
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
