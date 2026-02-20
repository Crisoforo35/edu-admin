import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import GroupDetails from "@/components/groups/GroupDetails";

export default async function GroupsPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    // Get teacher info by email
    const { data: teacher } = await supabase
        .from("teachers")
        .select("id, first_name, last_name")
        .eq("email", user.email)
        .maybeSingle();

    const subjectsWithStudents = [];
    if (teacher) {
        const { data } = await supabase
            .from("subjects")
            .select("*")
            .eq("teacher_id", teacher.id);

        // Get students for each subject via enrollments
        for (const subject of data || []) {
            const { data: enrollments } = await supabase
                .from("enrollments")
                .select("profiles!enrollments_student_id_profiles_fkey(id, full_name, correo, numero_de_control)")
                .eq("subject_id", subject.id);

            subjectsWithStudents.push({
                ...subject,
                students: enrollments?.map((enrollment: any) => ({
                    ...enrollment.profiles,
                    email: enrollment.profiles?.correo || '',
                    numero_de_control: enrollment.profiles?.numero_de_control || ''
                })) || []
            });
        }
    }

    const totalStudents = new Set(
        subjectsWithStudents.flatMap(s => s.students.map((st: any) => st.id))
    ).size;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="backdrop-blur-xl bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-white/[0.06] rounded-2xl p-6">
                <h1 className="text-xl font-bold text-white mb-1">
                    Gestión de Grupos Asignados
                </h1>
                <p className="text-sm text-blue-200/50">
                    Visualiza y administra los estudiantes de tus materias.
                </p>
            </div>

            {/* Stats summary */}
            {subjectsWithStudents.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                        <p className="text-[11px] uppercase tracking-wider text-blue-300/40 font-medium">Materias</p>
                        <p className="text-3xl font-bold text-white mt-1">{subjectsWithStudents.length}</p>
                    </div>
                    <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                        <p className="text-[11px] uppercase tracking-wider text-blue-300/40 font-medium">Alumnos únicos</p>
                        <p className="text-3xl font-bold text-white mt-1">{totalStudents}</p>
                    </div>
                </div>
            )}

            {/* Subject cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {subjectsWithStudents.map((subject: any) => (
                    <GroupDetails key={subject.id} subject={subject} students={subject.students} />
                ))}
            </div>

            {subjectsWithStudents.length === 0 && (
                <div className="text-center py-20 bg-white/[0.02] rounded-2xl border border-white/[0.05]">
                    <svg className="w-12 h-12 text-blue-200/20 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                    <p className="text-blue-200/50 text-lg">No tienes grupos asignados actualmente.</p>
                </div>
            )}
        </div>
    );
}
