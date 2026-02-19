import Link from "next/link";

export default function ErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-5">
                    <svg
                        className="w-8 h-8 text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                        />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                    Algo salió mal
                </h1>
                <p className="text-blue-200/60 mb-6">
                    Ocurrió un error inesperado. Por favor, intenta de nuevo.
                </p>
                <Link
                    href="/sign-in"
                    className="inline-flex py-2.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm hover:from-blue-500 hover:to-indigo-500 transition-all duration-200"
                >
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
}
