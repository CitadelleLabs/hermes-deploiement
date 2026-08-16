import { Link, router, usePage } from '@inertiajs/react'
import { LogOutIcon, Sun, Moon } from 'lucide-react'
import { cn } from '~/lib/utils'
import { useState, useEffect } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown_menu'

type User = {
    id: number
    username: string
}

export function Navbar() {
    const { url, props } = usePage<{ user: User }>()
    const user = props.user
    const [theme, setTheme] = useState<'light' | 'dark'>('light')

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const isDark = document.documentElement.classList.contains('dark')
            setTheme(isDark ? 'dark' : 'light')
        }
    }, [])

    const toggleTheme = () => {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
            setTheme('light')
        } else {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
            setTheme('dark')
        }
    }

    const handleLogout = () => {
        router.post('/logout')
    }

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-white border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
            <div className="max-w-6xl w-full mx-auto px-4 md:px-8 flex items-center justify-between h-16">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2 font-bold text-lg select-none">
                        <img src="/logo.png" alt="Logo" className="h-9 w-auto object-contain" />
                    </Link>
                    <nav className="flex items-center gap-6 text-sm font-medium">
                        <Link
                            href="/"
                            className={cn(
                                "transition-colors hover:text-foreground",
                                url === '/' ? "text-foreground font-semibold" : "text-muted-foreground"
                            )}
                        >
                            Accueil
                        </Link>
                        <Link
                            href="/servers"
                            className={cn(
                                "transition-colors hover:text-foreground",
                                url.startsWith('/servers') ? "text-foreground font-semibold" : "text-muted-foreground"
                            )}
                        >
                            Serveurs
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg border border-zinc-250 dark:border-zinc-800 hover:bg-neutral-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer select-none text-muted-foreground hover:text-foreground"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? (
                            <Sun className="h-4 w-4" />
                        ) : (
                            <Moon className="h-4 w-4" />
                        )}
                    </button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 text-sm font-medium hover:text-foreground focus:outline-hidden cursor-pointer select-none transition-colors">
                                <div className="h-8 w-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-bold border border-zinc-200 dark:border-zinc-700 capitalize text-sm">
                                    {user?.username?.[0] || 'U'}
                                </div>
                                <span className="hidden sm:inline select-none text-muted-foreground hover:text-foreground">{user?.username}</span>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 mt-1">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none capitalize">{user?.username}</p>
                                    <p className="text-[10px] leading-none text-muted-foreground">Utilisateur connecté</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:bg-red-50 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30">
                                <LogOutIcon className="mr-2 h-4 w-4" />
                                <span>Déconnexion</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
