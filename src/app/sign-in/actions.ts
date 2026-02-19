"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
    const supabase = await createClient();

    const numeroDeControl = formData.get("numeroDeControl") as string;
    const password = formData.get("password") as string;

    // Use numero de control as the email identifier
    // Convention: numeroDeControl@eduadmin.local
    const email = `${numeroDeControl}@eduadmin.com.mx`;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return redirect(
            "/sign-in?error=" + encodeURIComponent("Número de control o contraseña incorrectos")
        );
    }

    // Get user to determine institution
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Get profile for institution slug
    const { data: profile } = await supabase
        .from("profiles")
        .select("institucion")
        .eq("id", user!.id)
        .single();

    const institucion = profile?.institucion || "edu-admin";

    revalidatePath("/", "layout");
    redirect(`/${institucion}/home`);
}
