"use client";

import { useState } from "react";
import { updateUser } from "@/app/[institucion]/data-update/actions";
import { toast } from "sonner";
import ButtonLoading from "../ui/ButtonLoading";

interface Profile {
    full_name?: string | null;
    sexo?: string | null;
    entidad?: string | null;
    municipio?: string | null;
    fecha_nacimiento?: string | null;
    estado_civil?: string | null;
    telefono?: string | null;
    direccion?: string | null;
    nombre_padre?: string | null;
    telefono_padre?: string | null;
    numero_afiliacion?: string | null;
    talla?: string | null;
    peso?: string | null;
    tipo_sangre?: string | null;
    correo?: string | null;
}

export default function UserUpdateForm({ profile }: { profile: Profile }) {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);

        const result = await updateUser(formData);

        if (result?.error) {
            toast.error(result.error);
        } else if (result?.success) {
            toast.success(result.success);
        }
        setLoading(false);
    }

    return (
        <form action={handleSubmit} className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                    <label htmlFor="full_name" className="text-sm font-medium text-blue-200">
                        Nombre Completo
                    </label>
                    <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        defaultValue={profile.full_name || ""}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>

                {/* Correo */}
                <div className="space-y-2">
                    <label htmlFor="correo" className="text-sm font-medium text-blue-200">
                        Correo de Contacto
                    </label>
                    <input
                        type="email"
                        id="correo"
                        name="correo"
                        defaultValue={profile.correo || ""}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>

                {/* Sexo */}
                <div className="space-y-2">
                    <label htmlFor="sexo" className="text-sm font-medium text-blue-200">
                        Sexo
                    </label>
                    <select
                        id="sexo"
                        name="sexo"
                        defaultValue={profile.sexo || ""}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 [&>option]:bg-slate-900"
                    >
                        <option value="">Seleccionar...</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                    </select>
                </div>

                {/* Fecha de Nacimiento */}
                <div className="space-y-2">
                    <label htmlFor="fecha_nacimiento" className="text-sm font-medium text-blue-200">
                        Fecha de Nacimiento
                    </label>
                    <input
                        type="date"
                        id="fecha_nacimiento"
                        name="fecha_nacimiento"
                        defaultValue={profile.fecha_nacimiento || ""}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>

                {/* Estado Civil */}
                <div className="space-y-2">
                    <label htmlFor="estado_civil" className="text-sm font-medium text-blue-200">
                        Estado Civil
                    </label>
                    <select
                        id="estado_civil"
                        name="estado_civil"
                        defaultValue={profile.estado_civil || ""}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 [&>option]:bg-slate-900"
                    >
                        <option value="">Seleccionar...</option>
                        <option value="Soltero">Soltero/a</option>
                        <option value="Casado">Casado/a</option>
                        <option value="Divorciado">Divorciado/a</option>
                        <option value="Viudo">Viudo/a</option>
                        <option value="Union Libre">Unión Libre</option>
                    </select>
                </div>

                {/* Tipo de Sangre */}
                <div className="space-y-2">
                    <label htmlFor="tipo_sangre" className="text-sm font-medium text-blue-200">
                        Tipo de Sangre
                    </label>
                    <select
                        id="tipo_sangre"
                        name="tipo_sangre"
                        defaultValue={profile.tipo_sangre || ""}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 [&>option]:bg-slate-900"
                    >
                        <option value="">Seleccionar...</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                </div>

                {/* Entidad */}
                <div className="space-y-2">
                    <label htmlFor="entidad" className="text-sm font-medium text-blue-200">
                        Entidad Federativa
                    </label>
                    <input
                        type="text"
                        id="entidad"
                        name="entidad"
                        defaultValue={profile.entidad || ""}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>

                {/* Municipio */}
                <div className="space-y-2">
                    <label htmlFor="municipio" className="text-sm font-medium text-blue-200">
                        Municipio
                    </label>
                    <input
                        type="text"
                        id="municipio"
                        name="municipio"
                        defaultValue={profile.municipio || ""}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                    <label htmlFor="telefono" className="text-sm font-medium text-blue-200">
                        Teléfono Personal
                    </label>
                    <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        defaultValue={profile.telefono || ""}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>

                {/* Dirección */}
                <div className="md:col-span-2 space-y-2">
                    <label htmlFor="direccion" className="text-sm font-medium text-blue-200">
                        Dirección Completa
                    </label>
                    <textarea
                        id="direccion"
                        name="direccion"
                        rows={3}
                        defaultValue={profile.direccion || ""}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                    />
                </div>

                {/* Nombre del Padre */}
                <div className="space-y-2">
                    <label htmlFor="nombre_padre" className="text-sm font-medium text-blue-200">
                        Nombre del Padre / Tutor
                    </label>
                    <input
                        type="text"
                        id="nombre_padre"
                        name="nombre_padre"
                        defaultValue={profile.nombre_padre || ""}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>

                {/* Teléfono del Padre */}
                <div className="space-y-2">
                    <label htmlFor="telefono_padre" className="text-sm font-medium text-blue-200">
                        Teléfono del Padre / Tutor
                    </label>
                    <input
                        type="tel"
                        id="telefono_padre"
                        name="telefono_padre"
                        defaultValue={profile.telefono_padre || ""}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>

                {/* Número de Afiliación */}
                <div className="space-y-2">
                    <label htmlFor="numero_afiliacion" className="text-sm font-medium text-blue-200">
                        NSS (Número de Seguridad Social)
                    </label>
                    <input
                        type="text"
                        id="numero_afiliacion"
                        name="numero_afiliacion"
                        defaultValue={profile.numero_afiliacion || ""}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>

                {/* Talla */}
                <div className="space-y-2">
                    <label htmlFor="talla" className="text-sm font-medium text-blue-200">
                        Talla
                    </label>
                    <input
                        type="text"
                        id="talla"
                        name="talla"
                        defaultValue={profile.talla || ""}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>

                {/* Peso */}
                <div className="space-y-2">
                    <label htmlFor="peso" className="text-sm font-medium text-blue-200">
                        Peso (kg)
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        id="peso"
                        name="peso"
                        defaultValue={profile.peso || ""}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <ButtonLoading
                    loading={loading}
                    variant="primary"
                    onLoadingChildren="Guardando..."
                >
                    Guardar Cambios
                </ButtonLoading>
            </div>
        </form>
    );
}
