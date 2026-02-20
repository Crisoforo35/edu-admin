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

    // Get profile for institution and role
    const { data: profile } = await supabase
        .from("profiles")
        .select("*, institutes(name), roles(name)")
        .eq("id", user!.id)
        .single();

    // @ts-ignore
    const institucion = profile?.institutes?.name || "edu-admin";
    // @ts-ignore
    const userRole = profile?.roles?.name;

    revalidatePath("/", "layout");

    if (userRole === "Administrador") {
        redirect(`/${institucion}/admin`);
    } else {
        redirect(`/${institucion}/home`);
    }
}
