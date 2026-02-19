import { login } from "./actions";

export default async function SignInPage(props: {
    searchParams: Promise<{ error?: string; message?: string }>;
}) {
    const searchParams = await props.searchParams;

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-blue-950 to-indigo-950 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
            </div>

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            />

            <div className="relative z-10 w-full max-w-md px-4">
                {/* Logo & Branding */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 mb-5">
                        <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        EduAdmin
                    </h1>
                    <p className="mt-2 text-sm text-blue-200/70 font-medium">
                        Sistema de gestión académica y escolar
                    </p>
                </div>

                {/* Login Card */}
                <div className="backdrop-blur-xl bg-white/[0.07] border border-white/10 rounded-2xl shadow-2xl shadow-black/20 p-8">
                    {/* Error message */}
                    {searchParams?.error && (
                        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                            <p className="text-sm text-red-300 text-center">
                                {searchParams.error}
                            </p>
                        </div>
                    )}

                    {/* Success message */}
                    {searchParams?.message && (
                        <div className="mb-6 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <p className="text-sm text-emerald-300 text-center">
                                {searchParams.message}
                            </p>
                        </div>
                    )}

                    <form className="space-y-5">
                        <div>
                            <label
                                htmlFor="numeroDeControl"
                                className="block text-sm font-medium text-blue-100/80 mb-1.5"
                            >
                                Número de control
                            </label>
                            <input
                                id="numeroDeControl"
                                name="numeroDeControl"
                                type="text"
                                required
                                placeholder="Ej: 20210001"
                                className="w-full px-4 py-3 rounded-xl bg-white/6 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 text-sm"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-blue-100/80 mb-1.5"
                            >
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl bg-white/6 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 text-sm"
                            />
                        </div>

                        <button
                            formAction={login}
                            className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/30 cursor-pointer"
                        >
                            Iniciar sesión
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center mt-6 text-xs text-blue-200/30">
                    © 2026 EduAdmin. Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
}
