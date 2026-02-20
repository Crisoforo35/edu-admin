"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateUser(formData: FormData) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("No authenticated user");
    }

    const updates = {
        full_name: formData.get("full_name") as string,
        sexo: formData.get("sexo") as string,
        entidad: formData.get("entidad") as string,
        municipio: formData.get("municipio") as string,
        fecha_nacimiento: formData.get("fecha_nacimiento") as string,
        estado_civil: formData.get("estado_civil") as string,
        telefono: formData.get("telefono") as string,
        direccion: formData.get("direccion") as string,
        nombre_padre: formData.get("nombre_padre") as string,
        telefono_padre: formData.get("telefono_padre") as string,
        numero_afiliacion: formData.get("numero_afiliacion") as string,
        talla: formData.get("talla") as string,
        peso: formData.get("peso") as string,
        tipo_sangre: formData.get("tipo_sangre") as string,
        correo: formData.get("correo") as string,
        role: formData.get("role") as string,
        updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

    if (error) {
        console.error("Error updating profile:", error);
        return { error: "Error al actualizar el perfil" };
    }

    // Get the institution from the URL or profile to redirect back correctly
    const { data: profile } = await supabase
        .from("profiles")
        .select(`
            institute_id,
            institutes (
                slug
            )
        `)
        .eq("id", user.id)
        .single();

    console.log(profile);

    // @ts-ignore
    const institute = profile?.institutes?.slug || "edu-admin";
    console.log(institute);


    revalidatePath(`/${institute}/home`);
    revalidatePath(`/${institute}/data-update`);

    return { success: "Perfil actualizado correctamente" };
}
