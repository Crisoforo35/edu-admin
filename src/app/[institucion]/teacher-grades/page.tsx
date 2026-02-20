import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TeacherGradesClient from "@/components/grades/TeacherGradesClient";

export default async function TeacherGradesPage() {
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

    const subjectsWithStudents: any[] = [];

    if (teacher) {
        const { data: subjects } = await supabase
            .from("subjects")
            .select("*")
            .eq("teacher_id", teacher.id);

        for (const subject of subjects || []) {
            const { data: enrollments } = await supabase
                .from("enrollments")
                .select("*, profiles!enrollments_student_id_profiles_fkey(id, full_name, numero_de_control)")
                .eq("subject_id", subject.id);
            console.log(enrollments);


            subjectsWithStudents.push({
                ...subject,
                students: enrollments?.map((e: any) => ({
                    ...e.profiles,
                    numero_de_control: e.profiles?.numero_de_control || ''
                })) || []
            });
        }
    }

    return <TeacherGradesClient subjectsWithStudents={subjectsWithStudents} />;
}
