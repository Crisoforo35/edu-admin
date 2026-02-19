"use client";

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";

const data = [
    { name: "Titulados", value: 68, color: "#3b82f6" },
    { name: "En proceso", value: 22, color: "#6366f1" },
    { name: "No titulados", value: 10, color: "#1e293b" },
];

export default function GraduationChart() {
    return (
        <div className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 h-full">
            <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <svg
                        className="w-5 h-5 text-blue-400"
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
                <div>
                    <h3 className="text-sm font-semibold text-white">
                        Porcentaje de Titulación
                    </h3>
                    <p className="text-xs text-blue-200/40">Último periodo</p>
                </div>
            </div>

            <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={4}
                            dataKey="value"
                            strokeWidth={0}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(15, 23, 42, 0.9)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "12px",
                                color: "white",
                                fontSize: "13px",
                            }}
                            formatter={(value: number) => [`${value}%`, ""]}
                        />
                        <Legend
                            verticalAlign="bottom"
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ fontSize: "12px", color: "rgba(148, 163, 184, 0.8)" }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Stat summary */}
            <div className="mt-4 flex items-center justify-center gap-2">
                <span className="text-3xl font-bold text-white">68%</span>
                <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full font-medium">
                    ↑ 5%
                </span>
            </div>
        </div>
    );
}
