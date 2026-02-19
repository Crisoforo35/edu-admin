"use client";

import { useRouter } from "next/navigation";

export default function Header({
    userName,
    institucion,
}: {
    userName: string;
    institucion: string;
}) {
    const router = useRouter();

    const handleSignOut = async () => {
        await fetch("/api/auth/signout", { method: "POST" });
        router.push("/sign-in");
    };

    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/[0.06]">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
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

                    {/* Right: User info & actions */}
                    <div className="flex items-center gap-4">
                        {/* Notification bell */}
                        <button className="relative p-2 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer">
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
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
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
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs font-bold uppercase">
                                {userName.charAt(0)}
                            </div>
                            <span className="hidden md:block text-sm font-medium text-blue-100/80 max-w-[140px] truncate">
                                {userName}
                            </span>
                        </div>

                        {/* Sign out button */}
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 py-2 px-3 rounded-lg text-sm font-medium text-red-300/70 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
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
                    </div>
                </div>
            </div>
        </header>
    );
}
