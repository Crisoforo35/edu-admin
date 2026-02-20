'use client';

import { useState } from 'react';

interface Student {
    id: string;
    full_name: string;
    email: string;
}

interface GroupDetailsProps {
    subject: any;
    students: Student[];
}

export default function GroupDetails({ subject, students }: GroupDetailsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    const filteredStudents = students.filter((s) =>
        s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/[0.1]">
            {/* Header */}
            <div className="p-6 pb-4">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center border border-blue-500/20 shrink-0">
                        <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-lg">{subject.name}</h3>
                        <p className="text-blue-200/40 text-sm mt-0.5">Semestre {subject.semester}º</p>
                    </div>
                </div>
            </div>

            {/* Stats bar */}
            <div className="mx-6 mb-4 flex gap-3">
                <div className="flex-1 px-4 py-3 bg-blue-500/[0.08] rounded-xl border border-blue-500/[0.15]">
                    <p className="text-[11px] uppercase tracking-wider text-blue-300/50 font-medium">Inscritos</p>
                    <p className="text-2xl font-bold text-blue-400 mt-0.5">{students.length}</p>
                </div>
                <div className="flex-1 px-4 py-3 bg-emerald-500/[0.08] rounded-xl border border-emerald-500/[0.15]">
                    <p className="text-[11px] uppercase tracking-wider text-emerald-300/50 font-medium">Activos</p>
                    <p className="text-2xl font-bold text-emerald-400 mt-0.5">{students.length}</p>
                </div>
            </div>

            {/* Toggle button */}
            <div className="px-6 pb-4">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                    <span className={isOpen ? 'text-blue-400' : 'text-blue-200/60'}>
                        {isOpen ? 'Ocultar lista' : 'Ver estudiantes'}
                    </span>
                    <svg
                        className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-400' : 'text-blue-200/40'}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {/* Student list (expandable) */}
            {isOpen && (
                <div className="border-t border-white/[0.06] px-6 py-4 space-y-3">
                    {/* Search */}
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-200/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar estudiante..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder-blue-200/30 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.08] transition-all"
                        />
                    </div>

                    {/* Student list */}
                    <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student, idx) => (
                                <div key={student.id} className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/[0.06] hover:bg-white/[0.06] transition-colors">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-500/30 flex items-center justify-center text-xs font-bold text-blue-300 border border-blue-500/20 shrink-0">
                                        {student.full_name?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm font-medium truncate">{idx + 1}. {student.full_name}</p>
                                        <p className="text-blue-200/40 text-xs truncate">{student.email}</p>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/[0.1] text-emerald-400 text-[10px] font-semibold border border-emerald-500/20 shrink-0">
                                        Activo
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-blue-200/40 py-6 text-sm">
                                {search ? 'No se encontraron resultados' : 'No hay estudiantes en este grupo'}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
