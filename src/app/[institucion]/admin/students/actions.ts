
"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function getStudents(instituteSlug: string) {
    const supabase = createAdminClient();

    // First get institute id - search by slug OR name for robustness
    const { data: institute, error: instError } = await supabase
        .from("institutes")
        .select("id")
        .or(`slug.eq."${instituteSlug}",name.eq."${decodeURIComponent(instituteSlug)}"`)
        .single();

    if (instError) console.error("Institute lookup error:", instError);
    if (!institute) {
        console.log("No institute found for slug:", instituteSlug);
        return { error: `Institución no encontrada (${instituteSlug})` };
    }

    const { data: students, error } = await supabase
        .from("profiles")
        .select("*, roles(name)")
        .eq("institute_id", institute.id)
        .eq("role_id", 2); // 2 = Estudiante

    if (error) return { error: error.message };
    return { data: students };
}

export async function createStudent(formData: FormData, instituteSlug: string) {
    const supabase = createAdminClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("full_name") as string;
    const numeroControl = formData.get("numero_control") as string;
    const semester = parseInt(formData.get("semester") as string);
    const racingId = formData.get("racing_id") as string;

    // 1. Get institute id - search by slug OR name for robustness
    const { data: institute } = await supabase
        .from("institutes")
        .select("id")
        .or(`slug.eq."${instituteSlug}",name.eq."${decodeURIComponent(instituteSlug)}"`)
        .single();

    if (!institute) return { error: "Institución no encontrada" };

    // 2. Create Auth User
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName }
    });

    if (authError) return { error: authError.message };

    // 3. Create Profile
    const { error: profileError } = await supabase
        .from("profiles")
        .insert({
            id: authData.user.id,
            full_name: fullName,
            numero_de_control: numeroControl,
            semester: semester,
            racing_id: racingId,
            role_id: 2, // Estudiante
            institute_id: institute.id,
            correo: email
        });

    if (profileError) {
        await supabase.auth.admin.deleteUser(authData.user.id);
        return { error: profileError.message };
    }

    revalidatePath(`/${instituteSlug}/admin/students`);
    return { success: true };
}

export async function deleteStudent(studentId: string, instituteSlug: string) {
    const supabase = createAdminClient();

    const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", studentId);

    if (profileError) return { error: profileError.message };

    const { error: authError } = await supabase.auth.admin.deleteUser(studentId);

    if (authError) return { error: authError.message };

    revalidatePath(`/${instituteSlug}/admin/students`);
    return { success: true };
}

export async function updateStudent(studentId: string, formData: FormData, instituteSlug: string) {
    const supabase = createAdminClient();

    const fullName = formData.get("full_name") as string;
    const numeroControl = formData.get("numero_control") as string;
    const semester = parseInt(formData.get("semester") as string);
    const racingId = formData.get("racing_id") as string;

    const { error } = await supabase
        .from("profiles")
        .update({
            full_name: fullName,
            numero_de_control: numeroControl,
            semester: semester,
            racing_id: racingId,
        })
        .eq("id", studentId);

    if (error) return { error: error.message };

    revalidatePath(`/${instituteSlug}/admin/students`);
    return { success: true };
}
