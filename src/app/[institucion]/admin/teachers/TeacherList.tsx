
"use client";

import { useState } from "react";
import { createTeacher, deleteTeacher, updateTeacher } from "./actions";
import { useRouter } from "next/navigation";

interface Teacher {
    id: string;
    full_name: string;
    numero_de_control: string;
    correo: string;
}

export default function TeacherList({
    teachers,
    instituteSlug
}: {
    teachers: Teacher[];
    instituteSlug: string
}) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        const formData = new FormData(e.currentTarget);

        const result = await createTeacher(formData, instituteSlug);
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
        if (!editingTeacher) return;
        setIsSubmitting(true);
        setError(null);
        const formData = new FormData(e.currentTarget);

        const result = await updateTeacher(editingTeacher.id, formData, instituteSlug);
        if (result.error) {
            setError(result.error);
        } else {
            setEditingTeacher(null);
            router.refresh();
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de que deseas eliminar este maestro? Se eliminarán también su cuenta de acceso.")) return;
        setIsSubmitting(true);
        const result = await deleteTeacher(id, instituteSlug);
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
                <h2 className="text-lg font-semibold text-white">Lista de Maestros</h2>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nuevo Maestro
                </button>
            </div>

            <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                            <th className="px-6 py-4 text-xs font-semibold text-blue-200/50 uppercase tracking-wider">Nombre Completo</th>
                            <th className="px-6 py-4 text-xs font-semibold text-blue-200/50 uppercase tracking-wider">Número de Control</th>
                            <th className="px-6 py-4 text-xs font-semibold text-blue-200/50 uppercase tracking-wider">Correo</th>
                            <th className="px-6 py-4 text-xs font-semibold text-blue-200/50 uppercase tracking-wider text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                        {teachers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-blue-200/30">No hay maestros registrados.</td>
                            </tr>
                        ) : (
                            teachers.map((teacher) => (
                                <tr key={teacher.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4 text-sm text-white font-medium">{teacher.full_name}</td>
                                    <td className="px-6 py-4 text-sm text-blue-200/70">{teacher.numero_de_control}</td>
                                    <td className="px-6 py-4 text-sm text-blue-200/70">{teacher.correo}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setEditingTeacher(teacher)}
                                                className="p-2 rounded-lg text-blue-400 hover:bg-blue-400/10 transition-colors"
                                                title="Editar"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(teacher.id)}
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

            {/* Modals (Simulated with conditional rendering for speed) */}
            {(isAddModalOpen || editingTeacher) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => { setIsAddModalOpen(false); setEditingTeacher(null); }} />
                    <div className="relative w-full max-w-md bg-slate-900 border border-white/[0.1] rounded-2xl p-6 shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">
                            {editingTeacher ? "Editar Maestro" : "Nuevo Maestro"}
                        </h3>
                        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-4">{error}</div>}
                        <form onSubmit={editingTeacher ? handleUpdate : handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-blue-200/50 mb-1">Nombre Completo</label>
                                <input
                                    name="full_name"
                                    defaultValue={editingTeacher?.full_name}
                                    required
                                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-200/50 mb-1">Número de Control</label>
                                <input
                                    name="numero_control"
                                    defaultValue={editingTeacher?.numero_de_control}
                                    required
                                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                />
                            </div>
                            {!editingTeacher && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-blue-200/50 mb-1">Correo Electrónico</label>
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-blue-200/50 mb-1">Contraseña</label>
                                        <input
                                            name="password"
                                            type="password"
                                            required
                                            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                        />
                                    </div>
                                </>
                            )}
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => { setIsAddModalOpen(false); setEditingTeacher(null); }}
                                    className="flex-1 py-2 px-4 rounded-xl border border-white/[0.1] text-white font-medium hover:bg-white/5 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-2 px-4 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors disabled:opacity-50"
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
