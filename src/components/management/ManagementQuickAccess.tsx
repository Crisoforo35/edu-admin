'use client';

import Link from "next/link";

export default function ManagementQuickAccess({ institucionPath }: { institucionPath: string }) {
    const sections = [
        {
            title: "Asistencia",
            description: "Registra la asistencia diaria de tus estudiantes",
            icon: "✓",
            href: `/${institucionPath}/attendance`,
            color: "emerald"
        },
        {
            title: "Gestión de Grupos",
            description: "Visualiza e administra tus grupos y estudiantes",
            icon: "👥",
            href: `/${institucionPath}/groups`,
            color: "blue"
        },
        {
            title: "Calificaciones",
            description: "Registra y administra las calificaciones",
            icon: "📊",
            href: `/${institucionPath}/grades`,
            color: "purple"
        }
    ];

    const colorMap: { [key: string]: string } = {
        emerald: "from-emerald-600/10 to-teal-600/10 border-emerald-500/20 hover:border-emerald-500/40",
        blue: "from-blue-600/10 to-indigo-600/10 border-blue-500/20 hover:border-blue-500/40",
        purple: "from-purple-600/10 to-pink-600/10 border-purple-500/20 hover:border-purple-500/40"
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sections.map((section) => (
                <Link
                    key={section.href}
                    href={section.href}
                    className={`backdrop-blur-xl bg-gradient-to-br ${colorMap[section.color]} border rounded-2xl p-6 transition-all duration-300 hover:scale-105`}
                >
                    <div className="text-3xl mb-3">{section.icon}</div>
                    <h3 className="text-white font-semibold text-lg mb-2">{section.title}</h3>
                    <p className="text-blue-200/60 text-sm">{section.description}</p>
                </Link>
            ))}
        </div>
    );
}
