import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PrintButton from "@/components/ui/PrintButton";
import { Grade, Subject, GradeRecord, GradesBySemester } from "@/types/grades";

export default async function GradesPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    // Get user profile for name
    const { data: profile } = await supabase
        .from("profiles")
        .select(`
            full_name,
            institutes (
                name
            )
        `)
        .eq("id", user.id)
        .maybeSingle();

    const userName = profile?.full_name || user.email?.split("@")[0] || "Estudiante";
    // @ts-ignore
    const institucion = profile?.institutes?.name || "Institución";

    const { data: gradesData, error } = await supabase
        .from("grades")
        .select(`
            id,
            grade,
            unit,
            subjects (
                id,
                name,
                semester,
                teachers (
                    first_name,
                    last_name,
                    email,
                    phone
                )
            )
        `)
        .eq("user_id", user.id);

    if (error) {
        console.error("Error fetching grades:", error);
        return <div>Error loading grades</div>;
    }

    const grades = gradesData as unknown as GradeRecord[];

    // Process data: Group by Semester -> Subject
    const gradesBySemester: GradesBySemester = {};

    grades?.forEach((record) => {
        const semester = record.subjects.semester;
        const subjectId = record.subjects.id;

        if (!gradesBySemester[semester]) {
            gradesBySemester[semester] = {};
        }

        if (!gradesBySemester[semester][subjectId]) {
            gradesBySemester[semester][subjectId] = {
                subject: record.subjects,
                grades: []
            };
        }

        gradesBySemester[semester][subjectId].grades.push({
            id: record.id,
            grade: record.grade,
            unit: record.unit
        });
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-xl bg-linear-to-r from-blue-600/10 to-indigo-600/10 border border-white/6 rounded-2xl p-6">
                <div>
                    <h1 className="text-xl font-bold text-white mb-1">
                        Boleta de Calificaciones
                    </h1>
                    <p className="text-sm text-blue-200/50">
                        Consulta tus calificaciones y promedios por semestre
                    </p>
                </div>
                <PrintButton
                    userName={userName}
                    institucion={institucion}
                    gradesBySemester={gradesBySemester}
                />
            </div>

            {Object.entries(gradesBySemester).sort(([a], [b]) => Number(b) - Number(a)).map(([semester, subjectsObj]) => {
                const subjects = Object.values(subjectsObj);

                // Calculate max number of grades to handle table columns if we wanted strict align, 
                // but for now we'll just list them.

                return (
                    <div key={semester} className="backdrop-blur-xl bg-white/2 border border-white/6 rounded-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/6 bg-white/5">
                            <h2 className="text-lg font-semibold text-white">
                                Semestre {semester}
                            </h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-blue-200">
                                <thead className="text-xs uppercase bg-white/5 text-blue-300">
                                    <tr>
                                        <th className="px-6 py-4 w-1/3 min-w-[300px]">Materia / Profesor</th>
                                        <th className="px-6 py-4">Calificaciones por Tema</th>
                                        <th className="px-6 py-4 text-right whitespace-nowrap w-24">Promedio</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {subjects.map(({ subject, grades }) => {
                                        const average = grades.length > 0
                                            ? grades.reduce((sum, g) => sum + g.grade, 0) / grades.length
                                            : 0;

                                        return (
                                            <tr key={subject.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-white text-base mb-1">
                                                        {subject.name}
                                                    </div>
                                                    <div className="text-xs text-blue-300/70 flex flex-col gap-0.5">
                                                        <span>{subject.teachers?.first_name} {subject.teachers?.last_name}</span>
                                                        {subject.teachers?.email && (
                                                            <span className="opacity-70">{subject.teachers.email}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-3">
                                                        {grades.map((grade) => (
                                                            <div key={grade.id} className="flex flex-col items-center bg-slate-900/50 rounded-lg p-2 min-w-[80px] border border-white/5">
                                                                <span className="text-[10px] uppercase tracking-wider text-blue-300/60 mb-1 max-w-[100px] truncate text-center" title={grade.unit}>
                                                                    {grade.unit}
                                                                </span>
                                                                <span className="text-lg font-bold text-white font-mono">
                                                                    {grade.grade}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className={`inline-flex items-center justify-center min-w-12 h-10 px-2 rounded-lg font-mono font-bold text-lg border ${average >= 70
                                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                        : "bg-red-500/10 text-red-400 border-red-500/20"
                                                        }`}>
                                                        {average.toFixed(1)}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            })}

            {Object.keys(gradesBySemester).length === 0 && (
                <div className="text-center py-20 bg-white/2 rounded-2xl border border-white/5">
                    <p className="text-blue-200/50 text-lg">No se encontraron calificaciones registradas.</p>
                </div>
            )}
        </div>
    );
}
