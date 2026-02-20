
"use client";

import { useState } from "react";
import { createStudent, deleteStudent, updateStudent } from "./actions";
import { useRouter } from "next/navigation";

interface Student {
    id: string;
    full_name: string;
    numero_de_control: string;
    correo: string;
    semester: number;
    racing_id: string;
}

export default function StudentList({
    students,
    instituteSlug
}: {
    students: Student[];
    instituteSlug: string
}) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        const formData = new FormData(e.currentTarget);

        const result = await createStudent(formData, instituteSlug);
        if (result.error) {
            setError(result.error);
        } else {
            setIsAddModalOpen(false);
            router.refresh();
        }
        setIsSubmitting(false);
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingStudent) return;
        setIsSubmitting(true);
        setError(null);
        const formData = new FormData(e.currentTarget);

        const result = await updateStudent(editingStudent.id, formData, instituteSlug);
        if (result.error) {
            setError(result.error);
        } else {
            setEditingStudent(null);
            router.refresh();
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de que deseas eliminar este alumno? Se eliminarán también su cuenta de acceso.")) return;
        setIsSubmitting(true);
        const result = await deleteStudent(id, instituteSlug);
        if (result.error) {
            alert(result.error);
        } else {
            router.refresh();
        }
        setIsSubmitting(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Lista de Alumnos</h2>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nuevo Alumno
                </button>
            </div>

            <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                            <th className="px-6 py-4 text-xs font-semibold text-purple-200/50 uppercase tracking-wider">Nombre Completo</th>
                            <th className="px-6 py-4 text-xs font-semibold text-purple-200/50 uppercase tracking-wider">N° Control</th>
                            <th className="px-6 py-4 text-xs font-semibold text-purple-200/50 uppercase tracking-wider">Carrera</th>
                            <th className="px-6 py-4 text-xs font-semibold text-purple-200/50 uppercase tracking-wider text-center">Semestre</th>
                            <th className="px-6 py-4 text-xs font-semibold text-purple-200/50 uppercase tracking-wider text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-purple-200/30">No hay alumnos registrados.</td>
                            </tr>
                        ) : (
                            students.map((student) => (
                                <tr key={student.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4 text-sm text-white font-medium">{student.full_name}</td>
                                    <td className="px-6 py-4 text-sm text-purple-200/70">{student.numero_de_control}</td>
                                    <td className="px-6 py-4 text-sm text-purple-200/70 uppercase">{student.racing_id || "—"}</td>
                                    <td className="px-6 py-4 text-sm text-purple-200/70 text-center">{student.semester || "—"}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setEditingStudent(student)}
                                                className="p-2 rounded-lg text-purple-400 hover:bg-purple-400/10 transition-colors"
                                                title="Editar"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(student.id)}
                                                className="p-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
                                                title="Eliminar"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            {(isAddModalOpen || editingStudent) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => { setIsAddModalOpen(false); setEditingStudent(null); }} />
                    <div className="relative w-full max-w-md bg-slate-900 border border-white/[0.1] rounded-2xl p-6 shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">
                            {editingStudent ? "Editar Alumno" : "Nuevo Alumno"}
                        </h3>
                        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-4">{error}</div>}
                        <form onSubmit={editingStudent ? handleUpdate : handleCreate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-purple-200/50 mb-1">Nombre Completo</label>
                                    <input
                                        name="full_name"
                                        defaultValue={editingStudent?.full_name}
                                        required
                                        className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                                    />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium text-purple-200/50 mb-1">Número de Control</label>
                                    <input
                                        name="numero_control"
                                        defaultValue={editingStudent?.numero_de_control}
                                        required
                                        className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                                    />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium text-purple-200/50 mb-1">Semestre</label>
                                    <select
                                        name="semester"
                                        defaultValue={editingStudent?.semester || "1"}
                                        className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(s => (
                                            <option key={s} value={s} className="bg-slate-900 text-white">Semestre {s}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-purple-200/50 mb-1">Carrera (ID o Siglas)</label>
                                    <input
                                        name="racing_id"
                                        defaultValue={editingStudent?.racing_id}
                                        placeholder="EJ: ISC, II, IM"
                                        required
                                        className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                                    />
                                </div>
                            </div>
                            {!editingStudent && (
                                <>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-purple-200/50 mb-1">Correo Electrónico</label>
                                            <input
                                                name="email"
                                                type="email"
                                                required
                                                className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-purple-200/50 mb-1">Contraseña</label>
                                            <input
                                                name="password"
                                                type="password"
                                                required
                                                className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => { setIsAddModalOpen(false); setEditingStudent(null); }}
                                    className="flex-1 py-2 px-4 rounded-xl border border-white/[0.1] text-white font-medium hover:bg-white/5 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-2 px-4 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-500 transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? "Guardando..." : "Guardar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
