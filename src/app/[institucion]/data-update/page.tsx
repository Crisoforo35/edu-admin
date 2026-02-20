import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import UserUpdateForm from "@/components/dashboard/UserUpdateForm";

export default async function DataUpdatePage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/sign-in");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    return (
        <div className="space-y-6">
            <div className="backdrop-blur-xl bg-linear-to-r from-blue-600/10 to-indigo-600/10 border border-white/6 rounded-2xl p-6">
                <h1 className="text-xl font-bold text-white mb-1">
                    Actualización de Datos
                </h1>
                <p className="text-sm text-blue-200/50">
                    Mantén tu información personal actualizada
                </p>
            </div>

            <div className="backdrop-blur-xl bg-white/2 border border-white/6 rounded-2xl p-6">
                <UserUpdateForm profile={profile || {}} />
            </div>
        </div>
    );
}
