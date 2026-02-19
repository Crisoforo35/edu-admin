import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Header from "@/components/layout/Header";

export default async function InstitutionLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ institucion: string }>;
}) {
    const { institucion } = await params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/sign-in");
    }

    // Fetch user profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    const userName = profile?.full_name || user.email || "Usuario";

    return (
        <div className="min-h-screen bg-slate-950">
            <Header
                userName={userName}
                institucion={institucion}
            />
            <main className="pt-4 pb-8 px-4 lg:px-8 max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
}
