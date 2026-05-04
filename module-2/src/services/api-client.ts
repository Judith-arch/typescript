/**
 * api-client.ts
 * Generic service that simulates database calls.
 * Module 2 — Generics, strongly typed promises, and RespuestaAPI<T>.
 */

import type { RespuestaAPI } from "../domain/types/university.types.js";

// In-memory database
//
// Simulates a resource store indexed by endpoint.
// Record<string, unknown[]> is a dictionary: string key → array of values.

const baseDatos: Record<string, unknown[]> = {
  "/estudiantes": [
    {
      id: "EST-001",
      nombreCompleto: "Ana García López",
      email: "ana.garcia@universidad.es",
      fechaNacimiento: new Date("2002-03-15"),
      fechaIngreso: new Date("2021-09-01"),
    },
    {
      id: "EST-002",
      nombreCompleto: "Carlos Martínez Ruiz",
      email: "carlos.martinez@universidad.es",
      fechaNacimiento: new Date("2001-11-22"),
      fechaIngreso: new Date("2020-09-01"),
      fechaUltimoAcceso: new Date("2026-04-20"),
    },
  ],
  "/asignaturas": [
    {
      id: "ASG-101",
      nombre: "Programación Web",
      creditos: 6,
      departamento: "Informática",
      obligatoria: true,
    },
    {
      id: "ASG-102",
      nombre: "Bases de Datos",
      creditos: 6,
      departamento: "Informática",
      obligatoria: true,
    },
    {
      id: "ASG-103",
      nombre: "Inteligencia Artificial",
      creditos: 4,
      departamento: "Informática",
      obligatoria: false,
    },
  ],
};

// Network latency simulation

function simularLatencia(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ApiClient class

export class ApiClient {
  private readonly baseUrl: string;
  private readonly latenciaMs: number;

  constructor(baseUrl: string = "https://api.universidad.es", latenciaMs: number = 300) {
    this.baseUrl = baseUrl;
    this.latenciaMs = latenciaMs;
  }

  /**
   * Retrieves all resources from an endpoint, strongly typed as T[].
   * The restriction `T extends object` prevents primitive types from being used as generics.
   *
   * @param endpoint - Resource path (e.g., "/estudiantes")
   * @returns        - Promise with RespuestaAPI<T[]>
   */
  async obtenerRecurso<T extends object>(
    endpoint: string
  ): Promise<RespuestaAPI<T[]>> {
    await simularLatencia(this.latenciaMs);

    const datos = baseDatos[endpoint];

    // Validation: the endpoint must exist in our database
    if (!datos) {
      const respuestaError: RespuestaAPI<T[]> = {
        codigoEstado: 404,
        exito: false,
        datos: [],
        errores: [`Endpoint '${endpoint}' no encontrado en ${this.baseUrl}`],
        timestamp: new Date(),
      };
      return respuestaError;
    }

    const respuestaExito: RespuestaAPI<T[]> = {
      codigoEstado: 200,
      exito: true,
      datos: datos as T[],
      timestamp: new Date(),
    };

    return respuestaExito;
  }

  /**
   * Retrieves a single resource by its ID.
   * Returns a 404 error if the item is not found.
   *
   * @param endpoint - Base path of the resource
   * @param id       - Unique identifier for the element
   */
  async obtenerPorId<T extends { id: string }>(
    endpoint: string,
    id: string
  ): Promise<RespuestaAPI<T | null>> {
    await simularLatencia(this.latenciaMs);

    const datos = baseDatos[endpoint];

    if (!datos) {
      return {
        codigoEstado: 404,
        exito: false,
        datos: null,
        errores: [`Endpoint '${endpoint}' no encontrado`],
        timestamp: new Date(),
      };
    }

    const elemento = datos.find(
      (item) => (item as { id: string }).id === id
    ) as T | undefined;

    if (!elemento) {
      return {
        codigoEstado: 404,
        exito: false,
        datos: null,
        errores: [`Recurso con id '${id}' no encontrado en '${endpoint}'`],
        timestamp: new Date(),
      };
    }

    return {
      codigoEstado: 200,
      exito: true,
      datos: elemento,
      timestamp: new Date(),
    };
  }
}

// Ready-to-use exported instance (lightweight Singleton pattern)
export const apiClient = new ApiClient();