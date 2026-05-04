/**
 * university.types.ts
 * Definición de tipos e interfaces del dominio universitario.
 * Módulo 2 — Modelado de datos complejo, Patrones y Genéricos.
 */

// semantic aliasses

type UUID = string;
type Creditos = number;

// entity subject

export interface Asignatura {
  readonly id: UUID;         // Inmutable after creation
  nombre: string;
  creditos: Creditos;
  departamento: string;
  obligatoria: boolean;
}

// entity student

export interface Estudiante {
  readonly id: UUID;
  nombreCompleto: string;
  email: string;
  fechaNacimiento: Date;
  fechaIngreso: Date;
  fechaUltimoAcceso?: Date;  // Opcional: may have never accessed
}

// Discriminated Union: EstadoMatricula
// Each state represents a DISTINCT and VALID set of data.
// There are no ambiguous optional properties—each interface is a closed contract.

export interface MatriculaActiva {
  tipo: "ACTIVA";
  asignaturas: Asignatura[];   // at least 1 subject being taken
  fechaInicio: Date;
}

export interface MatriculaSuspendida {
  tipo: "SUSPENDIDA";
  motivoSuspension: string;    // expliit reason for suspention
  fechaSuspension: Date;
}

export interface MatriculaFinalizada {
  tipo: "FINALIZADA";
  notaMedia: number;           // Final grade (0-10)
  fechaFinalizacion: Date;
}

// The union type that groups the three possible states
export type EstadoMatricula =
  | MatriculaActiva
  | MatriculaSuspendida
  | MatriculaFinalizada;

// Type of intersection: EntidadAuditable
// Combines two contracts into a single one (& operator).
// Any auditable entity must comply with BOTH contracts.

type EntidadAuditable = {
  creadoEn: Date;
  modificadoPor: string;
};

// A student with audit trail
export type EstudianteAuditable = Estudiante & EntidadAuditable;

// Generic interface: RespuestaAPI<T>
//
// Wraps any payload T in a standard network response.
// The generic type T will be instantiated when the interface is used.

export interface RespuestaAPI<T> {
  codigoEstado: number;
  exito: boolean;
  datos: T;
  errores?: string[];
  timestamp: Date;
}

// Function: generarReporte
//
// Use a switch statement on the 'type' discriminator to ensure
// that TypeScript knows exactly which properties are available

export function generarReporte(estado: EstadoMatricula): string {
  switch (estado.tipo) {
    case "ACTIVA":
      return (
        `Matrícula ACTIVA desde ${estado.fechaInicio.toLocaleDateString()}. ` +
        `Cursando ${estado.asignaturas.length} asignatura(s): ` +
        estado.asignaturas.map((a) => a.nombre).join(", ") + "."
      );

    case "SUSPENDIDA":
      return (
        `Matrícula SUSPENDIDA el ${estado.fechaSuspension.toLocaleDateString()}. ` +
        `Motivo: ${estado.motivoSuspension}.`
      );

    case "FINALIZADA":
      return (
        `Matrícula FINALIZADA el ${estado.fechaFinalizacion.toLocaleDateString()}. ` +
        `Nota media del expediente: ${estado.notaMedia.toFixed(2)}.`
      );
  }
}