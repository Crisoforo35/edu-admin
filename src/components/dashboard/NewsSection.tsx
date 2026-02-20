import { SupabaseClient } from "@supabase/supabase-js";

const novedades = [
    {
        id: 1,
        title: "Inscripciones abiertas para el periodo 2026-B",
        description:
            "Las inscripciones para el próximo periodo están disponibles a partir del 1 de marzo.",
        date: "19 Feb 2026",
        tag: "Inscripciones",
        tagColor: "blue",
    },
    {
        id: 2,
        title: "Ceremonia de graduación generación 2025",
        description:
            "Se invita a todos los estudiantes próximos a egresar a la ceremonia del 15 de marzo.",
        date: "18 Feb 2026",
        tag: "Eventos",
        tagColor: "indigo",
    },
    {
        id: 3,
        title: "Actualización del reglamento escolar",
        description:
            "Consulta los cambios aplicados al reglamento interno vigente a partir de este mes.",
        date: "15 Feb 2026",
        tag: "Normativa",
        tagColor: "amber",
    },
    {
        id: 4,
        title: "Convocatoria para servicio social",
        description:
            "Estudiantes de 7mo semestre en adelante pueden registrarse en la plataforma.",
        date: "12 Feb 2026",
        tag: "Servicio Social",
        tagColor: "emerald",
    },
];

const tagStyles: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export default function NewsSection({ userRole }: { userRole: string }) {
    return (
        <div className={`${userRole === 'Maestro' ? 'col-span-2' : 'col-span-1'} backdrop-blur-xl bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 h-full`}>
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                        <svg
                            className="w-5 h-5 text-indigo-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6V7.5Z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-white">Novedades</h3>
                </div>
                <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium cursor-pointer">
                    Ver todas
                </button>
            </div>

            <div className="space-y-3">
                {novedades.map((item) => (
                    <div
                        key={item.id}
                        className="group p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-white/[0.08] transition-all duration-200 cursor-pointer"
                    >
                        <div className="flex items-start justify-between gap-3 mb-1.5">
                            <h4 className="text-sm font-medium text-blue-100/90 group-hover:text-white transition-colors line-clamp-1">
                                {item.title}
                            </h4>
                            <span
                                className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tagStyles[item.tagColor]}`}
                            >
                                {item.tag}
                            </span>
                        </div>
                        <p className="text-xs text-blue-200/40 line-clamp-1 mb-1.5">
                            {item.description}
                        </p>
                        <span className="text-[10px] text-blue-200/30">{item.date}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
