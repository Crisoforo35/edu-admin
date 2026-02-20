import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AttendanceForm from "@/components/attendance/AttendanceForm";

export default async function AttendancePage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    // Get teacher info
    const { data: teacher } = await supabase
        .from("teachers")
        .select("id")
        .eq("email", user.email)
        .maybeSingle();

    let subjects: any[] = [];
    const subjectsWithStudents: any[] = [];

    if (teacher) {
        const { data } = await supabase
            .from("subjects")
            .select("*")
            .eq("teacher_id", teacher.id);
        subjects = data || [];

        for (const subject of subjects) {
            const { data: studentData } = await supabase
                .from("enrollments")
                .select("profiles!enrollments_student_id_profiles_fkey(id, full_name, correo, numero_de_control)")
                .eq("subject_id", subject.id);

            subjectsWithStudents.push({
                ...subject,
                students: studentData?.map((enrollment: any) => ({
                    ...enrollment.profiles,
                    email: enrollment.profiles?.correo || '',
                    numero_de_control: enrollment.profiles?.numero_de_control || ''
                })) || []
            });
        }
    }

    const today = new Date().toLocaleDateString('es-MX', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="space-y-6">
            <div className="backdrop-blur-xl bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border border-white/[0.06] rounded-2xl p-6">
                <h1 className="text-xl font-bold text-white mb-1">
                    Registro de Asistencia
                </h1>
                <p className="text-sm text-emerald-200/50">
                    Registra la asistencia de tus estudiantes — <span className="capitalize">{today}</span>
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {subjectsWithStudents.map((subject: any) => (
                    <AttendanceForm key={subject.id} subject={subject} students={subject.students} />
                ))}
            </div>

            {subjects.length === 0 && (
                <div className="text-center py-20 bg-white/[0.02] rounded-2xl border border-white/[0.05]">
                    <svg className="w-12 h-12 text-blue-200/20 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-blue-200/50 text-lg">No se encontraron materias para registrar asistencia.</p>
                </div>
            )}
        </div>
    );
}
