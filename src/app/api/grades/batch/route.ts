import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await request.json();
        const { subjectId, grades } = body;

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }

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

        if (!grades || !Array.isArray(grades) || grades.length === 0) {
            return NextResponse.json(
                { error: "No hay calificaciones para registrar" },
                { status: 400 }
            );
        }

        // Process batch upsert
        for (const record of grades) {
            // Validate grade value
            if (record.grade === '' || record.grade === null || record.grade === undefined) continue;

            const numericGrade = parseFloat(record.grade);
            if (isNaN(numericGrade)) continue;

            const { data: existingGrade } = await supabase
                .from("grades")
                .select("id")
                .eq("user_id", record.studentId)
                .eq("subject_id", subjectId)
                .eq("unit", record.unit)
                .maybeSingle();

            if (existingGrade) {
                // Update
                await supabase
                    .from("grades")
                    .update({ grade: numericGrade })
                    .eq("id", existingGrade.id);
            } else {
                // Insert
                await supabase
                    .from("grades")
                    .insert({
                        user_id: record.studentId,
                        subject_id: subjectId,
                        unit: record.unit,
                        grade: numericGrade
                    });
            }
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
