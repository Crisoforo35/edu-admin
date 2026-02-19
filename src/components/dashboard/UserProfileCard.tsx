interface UserProfileCardProps {
    fullName: string;
    email: string;
    numeroDeControl: string | null;
    carrera: string | null;
    semestre: number | null;
}

export default function UserProfileCard({
    fullName,
    email,
    numeroDeControl,
    carrera,
    semestre,
}: UserProfileCardProps) {
    return (
        <div className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 h-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <svg
                        className="w-5 h-5 text-cyan-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                        />
                    </svg>
                </div>
                <h3 className="text-sm font-semibold text-white">
                    Datos del Estudiante
                </h3>
            </div>

            {/* Avatar and name */}
            <div className="flex flex-col items-center mb-6">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold uppercase mb-3 shadow-lg shadow-blue-500/20">
                    {fullName.charAt(0)}
                </div>
                <h4 className="text-base font-semibold text-white text-center">
                    {fullName}
                </h4>
                <p className="text-xs text-blue-200/50 mt-0.5">{email}</p>
            </div>

            {/* Info grid */}
            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                    <span className="text-xs text-blue-200/50">No. de Control</span>
                    <span className="text-sm font-semibold text-white font-mono">
                        {numeroDeControl || "—"}
                    </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                    <span className="text-xs text-blue-200/50">Carrera</span>
                    <span className="text-sm font-medium text-blue-100/80">
                        {carrera || "—"}
                    </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                    <span className="text-xs text-blue-200/50">Semestre</span>
                    <span className="text-sm font-semibold text-white">
                        {semestre ? `${semestre}°` : "—"}
                    </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                    <span className="text-xs text-blue-200/50">Estatus</span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Activo
                    </span>
                </div>
            </div>
        </div>
    );
}
