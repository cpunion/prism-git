import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'prism-theme';

/**
 * Hook to manage theme (light/dark/system)
 */
export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return (saved as Theme) || 'system';
    });

    const getSystemTheme = useCallback((): 'light' | 'dark' => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }, []);

    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
        if (theme === 'system') return getSystemTheme();
        return theme;
    });

    // Apply theme to document
    useEffect(() => {
        const resolved = theme === 'system' ? getSystemTheme() : theme;
        setResolvedTheme(resolved);

        // Set data-theme attribute on html element
        document.documentElement.setAttribute('data-theme', resolved);

        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, theme);
    }, [theme, getSystemTheme]);

    // Listen for system theme changes
    useEffect(() => {
        if (theme !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = () => {
            const resolved = getSystemTheme();
            setResolvedTheme(resolved);
            document.documentElement.setAttribute('data-theme', resolved);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme, getSystemTheme]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => {
            if (prev === 'light') return 'dark';
            if (prev === 'dark') return 'system';
            return 'light';
        });
    }, []);

    return {
        theme,          // User preference: 'light' | 'dark' | 'system'
        resolvedTheme,  // Actual theme: 'light' | 'dark'
        setTheme,       // Set theme preference
        toggleTheme,    // Cycle through themes
    };
}
