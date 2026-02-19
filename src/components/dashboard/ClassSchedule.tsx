const schedule = [
    {
        hora: "07:00 - 08:00",
        lunes: { materia: "Matemáticas IV", color: "blue" },
        martes: { materia: "Física II", color: "indigo" },
        miercoles: { materia: "Programación", color: "emerald" },
        jueves: { materia: "Matemáticas IV", color: "blue" },
        viernes: { materia: "Inglés V", color: "amber" },
    },
    {
        hora: "08:00 - 09:00",
        lunes: { materia: "Física II", color: "indigo" },
        martes: { materia: "Programación", color: "emerald" },
        miercoles: { materia: "Base de Datos", color: "rose" },
        jueves: { materia: "Física II", color: "indigo" },
        viernes: { materia: "Programación", color: "emerald" },
    },
    {
        hora: "09:00 - 10:00",
        lunes: { materia: "Programación", color: "emerald" },
        martes: { materia: "Inglés V", color: "amber" },
        miercoles: { materia: "Matemáticas IV", color: "blue" },
        jueves: { materia: "Base de Datos", color: "rose" },
        viernes: { materia: "Física II", color: "indigo" },
    },
    {
        hora: "10:00 - 11:00",
        lunes: { materia: "Base de Datos", color: "rose" },
        martes: { materia: "Matemáticas IV", color: "blue" },
        miercoles: { materia: "Inglés V", color: "amber" },
        jueves: { materia: "Programación", color: "emerald" },
        viernes: { materia: "Base de Datos", color: "rose" },
    },
    {
        hora: "11:00 - 12:00",
        lunes: { materia: "Inglés V", color: "amber" },
        martes: { materia: "Base de Datos", color: "rose" },
        miercoles: { materia: "Física II", color: "indigo" },
        jueves: { materia: "Inglés V", color: "amber" },
        viernes: { materia: "Matemáticas IV", color: "blue" },
    },
];

const colorStyles: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    indigo: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-300 border-rose-500/20",
};

const days = ["lunes", "martes", "miercoles", "jueves", "viernes"] as const;
const dayLabels: Record<string, string> = {
    lunes: "Lun",
    martes: "Mar",
    miercoles: "Mié",
    jueves: "Jue",
    viernes: "Vie",
};

export default function ClassSchedule() {
    return (
        <div className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 h-full">
            <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <svg
                        className="w-5 h-5 text-emerald-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                        />
                    </svg>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-white">
                        Horario de Clases
                    </h3>
                    <p className="text-xs text-blue-200/40">Semestre actual</p>
                </div>
            </div>

            <div className="overflow-x-auto -mx-2">
                <table className="w-full text-xs">
                    <thead>
                        <tr>
                            <th className="text-left text-blue-200/40 font-medium pb-3 px-2 whitespace-nowrap">
                                Hora
                            </th>
                            {days.map((day) => (
                                <th
                                    key={day}
                                    className="text-center text-blue-200/40 font-medium pb-3 px-1 whitespace-nowrap"
                                >
                                    {dayLabels[day]}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map((row, i) => (
                            <tr key={i}>
                                <td className="py-1.5 px-2 text-blue-200/50 font-mono whitespace-nowrap">
                                    {row.hora}
                                </td>
                                {days.map((day) => {
                                    const cell = row[day];
                                    return (
                                        <td key={day} className="py-1.5 px-1">
                                            <div
                                                className={`px-2 py-2 rounded-lg border text-center text-[11px] font-medium leading-tight ${colorStyles[cell.color]}`}
                                            >
                                                {cell.materia}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
