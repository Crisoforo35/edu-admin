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

        const { subjectId, unit, grades } = body;

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

        // Insert or update grades
        const gradeRecords = Object.entries(grades)
            .filter(([_, grade]) => grade !== '' && grade !== null)
            .map(([studentId, grade]) => ({
                user_id: studentId,
                subject_id: subjectId,
                grade: parseFloat(grade as string),
                unit: unit,
            }));

        if (gradeRecords.length === 0) {
            return NextResponse.json(
                { error: "No hay calificaciones para registrar" },
                { status: 400 }
            );
        }

        // Check for existing grades and update or insert
        for (const record of gradeRecords) {
            const { data: existingGrade } = await supabase
                .from("grades")
                .select("id")
                .eq("user_id", record.user_id)
                .eq("subject_id", record.subject_id)
                .eq("unit", record.unit)
                .maybeSingle();

            if (existingGrade) {
                // Update existing grade
                await supabase
                    .from("grades")
                    .update({ grade: record.grade })
                    .eq("id", existingGrade.id);
            } else {
                // Insert new grade
                await supabase
                    .from("grades")
                    .insert([record]);
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
