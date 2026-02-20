
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboard({ params }: { params: Promise<{ institucion: string }> }) {
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

    return (
        <div className="space-y-6">
            <div className="backdrop-blur-xl bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-white/[0.06] rounded-2xl p-6">
                <h1 className="text-xl font-bold text-white mb-1">
                    Panel de Administración
                </h1>
                <p className="text-sm text-blue-200/50">
                    Gestión de usuarios y configuración del sistema
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Teachers Card */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.04] transition-colors group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Maestros</h3>
                            <p className="text-sm text-blue-200/50">Gestionar cuentas docentes</p>
                        </div>
                    </div>
                    <Link
                        href={`/${institucion}/admin/teachers`}
                        className="flex items-center justify-center w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
                    >
                        Administrar Maestros
                    </Link>
                </div>

                {/* Students Card */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.04] transition-colors group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                            <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Alumnos</h3>
                            <p className="text-sm text-blue-200/50">Gestionar cuentas de alumnos</p>
                        </div>
                    </div>
                    <Link
                        href={`/${institucion}/admin/students`}
                        className="flex items-center justify-center w-full py-2 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors"
                    >
                        Administrar Alumnos
                    </Link>
                </div>
            </div>
        </div>
    );
}
