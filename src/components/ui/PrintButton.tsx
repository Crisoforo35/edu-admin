"use client";

import { Printer } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { GradesBySemester } from "@/types/grades";

interface PrintButtonProps {
    userName: string;
    institucion: string;
    gradesBySemester: GradesBySemester;
}

export default function PrintButton({ userName, institucion, gradesBySemester }: PrintButtonProps) {
    const handlePrint = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(18);
        doc.text("Boleta de Calificaciones", 14, 20);

        doc.setFontSize(12);
        doc.text(`Alumno: ${userName}`, 14, 30);
        doc.text(`Institución: ${institucion.replace(/-/g, " ").toUpperCase()}`, 14, 36);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 42);

        let finalY = 45;

        // Process each semester
        Object.entries(gradesBySemester)
            .sort(([a], [b]) => Number(a) - Number(b)) // Sort ascending for report
            .forEach(([semester, subjectsObj]) => {
                const subjects = Object.values(subjectsObj);

                // Semester Header
                finalY += 10;
                doc.setFontSize(14);
                // @ts-ignore
                doc.text(`Semestre ${semester}`, 14, finalY);
                finalY += 5;

                // Prepare table data
                const tableBody = subjects.map(({ subject, grades }) => {
                    const average = grades.length > 0
                        ? grades.reduce((sum, g) => sum + g.grade, 0) / grades.length
                        : 0;

                    // Format: [Materia, Profesor, ...Grades(Unit: Grade), Promedio]
                    // Ideally we want a consistent number of columns, but for now let's just list units in one cell text
                    const gradesText = grades.map(g => `${g.unit}: ${g.grade}`).join("\n");

                    return [
                        subject.name,
                        `${subject.teachers?.first_name} ${subject.teachers?.last_name}`,
                        gradesText,
                        average.toFixed(1)
                    ];
                });

                autoTable(doc, {
                    startY: finalY,
                    head: [["Materia", "Profesor", "Calificaciones", "Promedio"]],
                    body: tableBody,
                    theme: 'grid',
                    headStyles: { fillColor: [66, 133, 244] }, // Blue header
                    // @ts-ignore
                    didDrawPage: (data) => {
                        // @ts-ignore
                        finalY = data.cursor.y;
                    }
                });

                // Update finalY slightly for next section
                // @ts-ignore
                if (doc.lastAutoTable) {
                    // @ts-ignore
                    finalY = doc.lastAutoTable.finalY;
                }
            });

        doc.save(`boleta_${userName.replace(/\s+/g, "_")}.pdf`);
    };

    return (
        <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors cursor-pointer shadow-lg shadow-blue-500/20"
        >
            <Printer size={18} />
            <span>Imprimir PDF</span>
        </button>
    );
}
