import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await request.json();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }

        const { subjectId, attendance, date } = body;

        // Get teacher info to verify ownership
        const { data: teacher } = await supabase
            .from("teachers")
            .select("id")
            .eq("email", user.email)
            .maybeSingle();

        if (!teacher) {
            return NextResponse.json(
                { error: "No eres profesor" },
                { status: 403 }
            );
        }

        // Verify teacher owns this subject
        const { data: subject } = await supabase
            .from("subjects")
            .select("id")
            .eq("id", subjectId)
            .eq("teacher_id", teacher.id)
            .maybeSingle();

        if (!subject) {
            return NextResponse.json(
                { error: "Materia no encontrada o no tienes permiso" },
                { status: 404 }
            );
        }

        // Insert attendance records
        const attendanceRecords = Object.entries(attendance).map(([studentId, isPresent]) => ({
            student_id: studentId,
            subject_id: subjectId,
            date: date || new Date().toISOString().split('T')[0],
            is_present: isPresent,
            created_by: teacher.id
        }));

        const { error } = await supabase
            .from("attendance")
            .upsert(attendanceRecords, { onConflict: 'student_id, subject_id, date' });

        if (error) {
            console.error("Error inserting attendance:", error);
            return NextResponse.json(
                { error: "Error al guardar asistencia" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
