'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface Student {
    id: string;
    full_name: string;
    numero_de_control: string;
}

interface GradesTableProps {
    subject: {
        id: number;
        name: string;
    };
    students: Student[];
}

const UNITS = ['Parcial 1', 'Parcial 2', 'Parcial 3', 'Ordinario'];

export default function GradesTable({ subject, students }: GradesTableProps) {
    const [grades, setGrades] = useState<Record<string, Record<string, string>>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const router = useRouter();
    const supabase = createClient();

    // Fetch existing grades on mount
    const fetchGrades = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('grades')
                .select('*')
                .eq('subject_id', subject.id);

            if (error) throw error;

            const loadedGrades: Record<string, Record<string, string>> = {};

            // Initialize structure for all students
            students.forEach(student => {
                loadedGrades[student.id] = {};
                UNITS.forEach(unit => {
                    loadedGrades[student.id][unit] = '';
                });
            });

            // Populate with data
            data?.forEach((g: any) => {
                if (loadedGrades[g.user_id]) {
                    loadedGrades[g.user_id][g.unit] = g.grade.toString();
                }
            });

            setGrades(loadedGrades);
        } catch (err) {
            console.error('Error fetching grades:', err);
            setMessage({ text: 'Error al cargar calificaciones', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // Fetch existing grades on mount
    useEffect(() => {
        fetchGrades();
    }, [subject.id, students, supabase]);

    const handleGradeChange = (studentId: string, unit: string, value: string) => {
        // Validate input (0-100)
        let processedValue = value;
        if (value !== '') {
            const num = parseFloat(value);
            if (num < 0) processedValue = '0';
            if (num > 100) processedValue = '100';
        }

        setGrades(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [unit]: processedValue
            }
        }));
    };

    const calculateAverage = (studentId: string) => {
        const studentGrades = grades[studentId];
        if (!studentGrades) return '-';

        let sum = 0;
        let count = 0;

        UNITS.forEach(unit => {
            const val = studentGrades[unit];
            if (val && val !== '') {
                sum += parseFloat(val);
                count++;
            }
        });

        if (count === 0) return '-';
        return (sum / count).toFixed(1);
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);

        const gradesToSave = [];

        // Flatten grades object to array for API
        for (const studentId of Object.keys(grades)) {
            for (const unit of Object.keys(grades[studentId])) {
                const val = grades[studentId][unit];
                if (val !== '') { // Only save non-empty grades? Or save 0? 
                    // The batch API logic handles upserts.
                    // If we want to allow deleting grades (setting to null), existing API might need tweaks.
                    // For now, let's assume we only save values entered.
                    // Actually, if a user clears a grade, maybe they intend to delete it?
                    // The batch API filters out empty strings.
                    // Let's stick to saving entered values.
                    gradesToSave.push({
                        studentId,
                        unit,
                        grade: val
                    });
                }
            }
        }

        try {
            const response = await fetch('/api/grades/batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subjectId: subject.id,
                    grades: gradesToSave
                })
            });

            if (!response.ok) throw new Error('Error saving');

            setMessage({ text: 'Calificaciones guardadas correctamente', type: 'success' });
            await fetchGrades(); // Re-fetch to ensure data consistency
            router.refresh();
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error(error);
            setMessage({ text: 'Error al guardar. Intenta de nuevo.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const getGradeColor = (val: string) => {
        if (!val) return 'text-gray-400';
        const num = parseFloat(val);
        if (num >= 90) return 'text-emerald-400 font-bold';
        if (num >= 70) return 'text-amber-400 font-bold';
        return 'text-red-400 font-bold';
    };

    if (loading) return <div className="p-8 text-center text-blue-200/50">Cargando calificaciones...</div>;

    return (
        <div className="space-y-4">
            {message && (
                <div className={`p-3 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/20' : 'bg-red-500/20 text-red-300 border border-red-500/20'}`}>
                    {message.text}
                </div>
            )}

            <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-black/20">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-white/[0.03] text-blue-200/60 uppercase text-xs">
                        <tr>
                            <th className="p-4 font-medium sticky left-0 bg-[#0f172a] z-10">Alumno</th>
                            <th className="p-4 font-medium text-center">No. Control</th>
                            {UNITS.map(unit => (
                                <th key={unit} className="p-4 font-medium text-center w-24">{unit}</th>
                            ))}
                            <th className="p-4 font-medium text-center text-amber-400">Promedio</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                        {students.map((student) => {
                            const avg = calculateAverage(student.id);
                            return (
                                <tr key={student.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4 sticky left-0 bg-[#0f172a] z-10 group-hover:bg-[#111a30] transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-300 border border-indigo-500/30">
                                                {student.full_name?.charAt(0)?.toUpperCase()}
                                            </div>
                                            <span className="text-blue-100 font-medium">{student.full_name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center text-blue-200/50 font-mono text-xs">
                                        {student.numero_de_control}
                                    </td>
                                    {UNITS.map(unit => (
                                        <td key={unit} className="p-2 text-center">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                className={`w-16 bg-white/[0.03] border border-white/[0.08] rounded-lg px-2 py-1.5 text-center text-sm focus:outline-none focus:bg-white/[0.08] focus:border-amber-500/40 transition-all ${getGradeColor(grades[student.id]?.[unit])}`}
                                                value={grades[student.id]?.[unit] || ''}
                                                onChange={(e) => handleGradeChange(student.id, unit, e.target.value)}
                                            />
                                        </td>
                                    ))}
                                    <td className="p-4 text-center">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${avg === '-' ? 'text-gray-500 bg-white/[0.02]' :
                                            parseFloat(avg) >= 70 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                'bg-red-500/10 text-red-400 border border-red-500/20'
                                            }`}>
                                            {avg}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end pt-2">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {saving ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Guardando...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Guardar Cambios
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
