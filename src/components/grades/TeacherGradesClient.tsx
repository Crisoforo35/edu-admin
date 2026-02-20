'use client';

import { useState, Fragment } from 'react';
import GradesTable from '@/components/grades/GradesTable';

interface Student {
    id: string;
    full_name: string;
    numero_de_control: string;
}

interface SubjectWithStudents {
    id: number;
    name: string;
    semester: number;
    students: Student[];
}

export default function TeacherGradesClient({ subjectsWithStudents }: { subjectsWithStudents: SubjectWithStudents[] }) {
    const [expandedSubject, setExpandedSubject] = useState<number | null>(null);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="backdrop-blur-xl bg-gradient-to-r from-amber-600/10 to-orange-600/10 border border-white/[0.06] rounded-2xl p-6">
                <h1 className="text-xl font-bold text-white mb-1">
                    Gestión de Calificaciones
                </h1>
                <p className="text-sm text-amber-200/50">
                    Captura y modifica las calificaciones de tus alumnos por unidad.
                </p>
            </div>

            {/* Subject table */}
            <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-blue-200">
                        <thead className="text-[11px] uppercase tracking-wider bg-white/[0.04] text-blue-300/50">
                            <tr>
                                <th className="px-6 py-4 font-medium">Materia</th>
                                <th className="px-6 py-4 font-medium">Semestre</th>
                                <th className="px-6 py-4 font-medium">Alumnos</th>
                                <th className="px-6 py-4 text-right font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {subjectsWithStudents.map((subject) => (
                                <Fragment key={subject.id}>
                                    <tr className="hover:bg-white/[0.03] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/20">
                                                    <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                                    </svg>
                                                </div>
                                                <span className="font-semibold text-white">{subject.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-blue-200/60 text-xs font-medium">
                                                {subject.semester}º
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex -space-x-2">
                                                    {subject.students.slice(0, 3).map((s, i) => (
                                                        <div key={i} className="w-7 h-7 rounded-full border-2 border-slate-900 bg-gradient-to-br from-blue-500/30 to-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-blue-300">
                                                            {s.full_name?.charAt(0)?.toUpperCase() || '?'}
                                                        </div>
                                                    ))}
                                                    {subject.students.length > 3 && (
                                                        <div className="w-7 h-7 rounded-full border-2 border-slate-900 bg-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400">
                                                            +{subject.students.length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-blue-200/40 text-xs">{subject.students.length} inscritos</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setExpandedSubject(expandedSubject === subject.id ? null : subject.id)}
                                                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${expandedSubject === subject.id
                                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                                    : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20'
                                                    }`}
                                            >
                                                {expandedSubject === subject.id ? 'Cerrar' : 'Capturar'}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedSubject === subject.id && (
                                        <tr>
                                            <td colSpan={4} className="p-4 bg-white/[0.01]">
                                                <GradesTable subject={subject} students={subject.students} />
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {subjectsWithStudents.length === 0 && (
                <div className="text-center py-20 bg-white/[0.02] rounded-2xl border border-white/[0.05]">
                    <svg className="w-12 h-12 text-blue-200/20 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <p className="text-blue-200/50 text-lg">No se encontraron grupos para gestionar calificaciones.</p>
                </div>
            )}
        </div>
    );
}
