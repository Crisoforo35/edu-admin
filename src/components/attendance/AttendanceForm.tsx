'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Student {
    id: string;
    full_name: string;
    email: string;
}

interface AttendanceFormProps {
    subject: any;
    students: Student[];
}

export default function AttendanceForm({ subject, students }: AttendanceFormProps) {
    const [attendance, setAttendance] = useState<{ [key: string]: boolean }>({});
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [submitted, setSubmitted] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const fetchAttendance = useCallback(async () => {
        if (!date || !subject?.id) return;

        try {
            setFetching(true);
            const { data, error } = await supabase
                .from('attendance')
                .select('student_id, is_present')
                .eq('subject_id', subject.id)
                .eq('date', date);

            if (error) {
                console.error('Error fetching attendance:', error);
                return;
            }

            const newAttendance: { [key: string]: boolean } = {};
            // Default to false (absent) if no record found? 
            // Or keep empty to indicate "not registered"? 
            // The UI shows "Ausente" (red) if false.
            // If we want to distinguish "Not Registered", we need tristate.
            // But current UI is binary.
            // Let's assume unchecked (false) = Absent/Not Registered.

            // Initialize with false for all students
            students.forEach(s => { newAttendance[s.id] = false; });

            // Apply fetched data
            data?.forEach((record: any) => {
                newAttendance[record.student_id] = record.is_present;
            });

            setAttendance(newAttendance);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setFetching(false);
        }
    }, [date, subject?.id, students, supabase]);

    useEffect(() => {
        fetchAttendance();
    }, [fetchAttendance]);

    const toggleAttendance = (studentId: string) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: !prev[studentId]
        }));
    };

    const selectAll = () => {
        const allSelected = students.every(s => attendance[s.id]);
        const newAttendance: { [key: string]: boolean } = {};
        students.forEach(s => { newAttendance[s.id] = !allSelected; });
        setAttendance(newAttendance);
    };

    const stats = useMemo(() => {
        const present = Object.values(attendance).filter(Boolean).length;
        return { present, absent: students.length - present };
    }, [attendance, students.length]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Prepare attendance map for all students
        const attendanceMap: Record<string, boolean> = {};
        students.forEach(student => {
            attendanceMap[student.id] = attendance[student.id] || false;
        });

        try {
            const response = await fetch('/api/attendance/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subjectId: subject.id,
                    attendance: attendanceMap,
                    date,
                })
            });

            if (response.ok) {
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 3000);
                setAttendance({}); // Do not clear! Refresh triggers re-fetch. 
                // Actually, wait for re-fetch.
                await fetchAttendance();
                router.refresh();
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                {/* Subject header */}
                <div className="p-6 pb-0">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-emerald-500/20">
                            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-semibold text-lg">{subject.name}</h3>
                            <p className="text-blue-200/40 text-xs">Semestre {subject.semester}º</p>
                        </div>
                    </div>
                </div>

                {/* Date picker + stats */}
                <div className="px-6 pb-4 flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <label className="block text-[11px] uppercase tracking-wider text-blue-300/40 font-medium mb-1.5">Fecha</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-blue-500/40 transition-all"
                        />
                    </div>
                    <div className="flex gap-3">
                        <div className="px-4 py-2 bg-emerald-500/[0.08] rounded-xl border border-emerald-500/[0.15] text-center min-w-[80px]">
                            <p className="text-[10px] uppercase tracking-wider text-emerald-300/50">Presentes</p>
                            <p className="text-xl font-bold text-emerald-400">{stats.present}</p>
                        </div>
                        <div className="px-4 py-2 bg-red-500/[0.08] rounded-xl border border-red-500/[0.15] text-center min-w-[80px]">
                            <p className="text-[10px] uppercase tracking-wider text-red-300/50">Ausentes</p>
                            <p className="text-xl font-bold text-red-400">{stats.absent}</p>
                        </div>
                    </div>
                </div>

                {/* Select all */}
                <div className="px-6 pb-3">
                    <button
                        type="button"
                        onClick={selectAll}
                        className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                    >
                        {students.every(s => attendance[s.id]) ? '✕ Deseleccionar todos' : '✓ Seleccionar todos'}
                    </button>
                </div>

                {/* Student list */}
                <div className="px-6 pb-4 space-y-2 max-h-[400px] overflow-y-auto">
                    {students.map((student) => (
                        <label
                            key={student.id}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border ${attendance[student.id]
                                ? 'bg-emerald-500/[0.06] border-emerald-500/20'
                                : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={attendance[student.id] || false}
                                onChange={() => toggleAttendance(student.id)}
                                className="w-4 h-4 rounded border-white/20 accent-emerald-500"
                            />
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-500/30 flex items-center justify-center text-xs font-bold text-blue-300 border border-blue-500/20 shrink-0">
                                {student.full_name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium text-sm truncate">{student.full_name}</p>
                                <p className="text-blue-200/40 text-xs truncate">{student.email}</p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border shrink-0 ${attendance[student.id]
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                                }`}>
                                {attendance[student.id] ? 'Presente' : 'Ausente'}
                            </span>
                        </label>
                    ))}
                </div>

                {/* Actions */}
                <div className="p-6 pt-2 flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 text-sm font-semibold transition-all disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? 'Registrando...' : submitted ? '✓ Registrada' : 'Registrar Asistencia'}
                    </button>
                </div>
            </div>
        </form>
    );
}
