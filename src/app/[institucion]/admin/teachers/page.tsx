
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTeachers } from "./actions";
import TeacherList from "./TeacherList";
import Link from "next/link";

export default async function TeachersPage({ params }: { params: Promise<{ institucion: string }> }) {
    const { institucion } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/sign-in");
    }

    // Verify admin role
    const { data: profile } = await supabase
        .from("profiles")
        .select("*, roles(name)")
        .eq("id", user.id)
        .single();

    // @ts-ignore
    const userRole = profile?.roles?.name;

    if (userRole !== "Administrador") {
        redirect(`/${institucion}/home`);
    }

    const { data: teachers, error } = await getTeachers(institucion);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href={`/${institucion}/admin`}
                    className="p-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-blue-200/50 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-white">Gestión de Maestros</h1>
                    <p className="text-sm text-blue-200/50">Alta, baja y edición de cuentas docentes</p>
                </div>
            </div>

            {error ? (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
                    Error al cargar maestros: {error}
                </div>
            ) : (
                <TeacherList
                    teachers={teachers || []}
                    instituteSlug={institucion}
                />
            )}
        </div>
    );
}
