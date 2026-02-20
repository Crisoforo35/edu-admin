"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
// @ts-ignore
// import { cn } from "@/lib/utils";

export default function Header({
    userName,
    institucion,
    role
}: {
    userName: string;
    institucion: string;
    role: string;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSignOut = async () => {
        await fetch("/api/auth/signout", { method: "POST" });
        router.push("/sign-in");
    };

    const isActive = (path: string) => pathname === path;

    const navLinks = role === "Maestro"
        ? [
            { href: `/${institucion}/home`, label: "Inicio" },
            { href: `/${institucion}/groups`, label: "Gestión de grupos" },
            { href: `/${institucion}/attendance`, label: "Asistencia" },
            { href: `/${institucion}/teacher-grades`, label: "Calificaciones" },
        ]
        : [
            { href: `/${institucion}/home`, label: "Inicio" },
            { href: `/${institucion}/data-update`, label: "Actualización de datos" },
            { href: `/${institucion}/grades`, label: "Boleta" },
        ];

    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/6 print:hidden">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                            <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.8}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                                />
                            </svg>
                        </div>
                        <span className="text-lg font-bold text-white tracking-tight">
                            EduAdmin
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden lg:flex items-center gap-1 mx-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.href)
                                    ? "bg-white/10 text-white shadow-sm shadow-white/5"
                                    : "text-blue-200/70 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right: User info & actions */}
                    <div className="flex items-center gap-4">
                        {/* Notification bell */}
                        <button className="relative p-2 rounded-lg hover:bg-white/6 transition-colors cursor-pointer">
                            <svg
                                className="w-5 h-5 text-blue-200/60"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                                />
                            </svg>
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
                        </button>

                        {/* Institution badge */}
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/4 border border-white/6">
                            <svg
                                className="w-4 h-4 text-blue-300/60"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
                                />
                            </svg>
                            <span className="text-xs font-medium text-blue-200/60 capitalize">
                                {institucion.replace(/-/g, " ")}
                            </span>
                        </div>

                        {/* User avatar & name */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-indigo-500 text-white text-xs font-bold uppercase">
                                {userName.charAt(0)}
                            </div>
                            <span className="hidden md:block text-sm font-medium text-blue-100/80 max-w-[140px] truncate">
                                {userName}
                            </span>
                        </div>

                        {/* Sign out button */}
                        <button
                            onClick={handleSignOut}
                            className="lg:flex hidden items-center gap-2 py-2 px-3 rounded-lg text-sm font-medium text-red-300/70 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                                />
                            </svg>
                            <span className="hidden sm:inline">Salir</span>
                        </button>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden shrink-0 p-2 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer"
                            aria-label="Toggle menu"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="lg:hidden absolute top-16 left-0 w-full bg-slate-900 border-b border-white/10 backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
                        <div className="flex flex-col p-4 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${isActive(link.href)
                                        ? "bg-white/10 text-white shadow-sm shadow-white/5"
                                        : "text-blue-200/70 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-2 border-t border-white/10 mt-2">
                                <div className="px-4 py-2 text-xs text-blue-200/40 uppercase tracking-wider font-semibold">
                                    Cuenta
                                </div>
                                <div className="flex items-center gap-3 px-4 py-3">
                                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold uppercase shrink-0">
                                        {userName.charAt(0)}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-medium text-white truncate">{userName}</span>
                                        <span className="text-xs text-blue-200/50 truncate capitalize">{institucion.replace(/-/g, " ")}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-300/70 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
