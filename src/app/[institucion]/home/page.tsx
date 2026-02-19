import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import GraduationChart from "@/components/dashboard/GraduationChart";
import NewsSection from "@/components/dashboard/NewsSection";
import ClassSchedule from "@/components/dashboard/ClassSchedule";
import UserProfileCard from "@/components/dashboard/UserProfileCard";

export default async function HomePage() {
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
        <div className="space-y-4">
            {/* Welcome banner */}
            <div className="backdrop-blur-xl bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-white/[0.06] rounded-2xl p-6">
                <h1 className="text-xl font-bold text-white mb-1">
                    Bienvenido, {profile?.full_name || user.email}
                </h1>
                <p className="text-sm text-blue-200/50">
                    Panel de control académico — Semestre {profile?.semester || "—"}
                </p>
            </div>

            {/* Row 1: Graduation chart + News */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <GraduationChart />
                <NewsSection />
            </div>

            {/* Row 2: Class schedule + User profile */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <ClassSchedule />
                </div>
                <UserProfileCard
                    fullName={profile?.full_name || user.email || "Usuario"}
                    email={user.email || ""}
                    numeroDeControl={profile?.numero_de_control || null}
                    carrera={profile?.racing_id || null}
                    semestre={profile?.semester || null}
                />
            </div>
        </div>
    );
}
