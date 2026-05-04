/**
 * index.ts
 * Entry point for Module 2.
 * Demonstrates domain modeling, discriminated unions, and generics.
 */

import type {
    Estudiante,
    Asignatura,
    EstadoMatricula,
    EstudianteAuditable,
  } from "./domain/types/university.types.js";
  
  import { generarReporte } from "./domain/types/university.types.js";
  import { apiClient } from "./services/api-client.js";
  
  // 1. Discriminated unions in action

  const asignaturasActivas: Asignatura[] = [
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
  ];

  const estados: EstadoMatricula[] = [
    {
      tipo: "ACTIVA",
      asignaturas: asignaturasActivas,
      fechaInicio: new Date("2025-09-01"),
    },
    {
      tipo: "SUSPENDIDA",
      motivoSuspension: "Impago de tasas académicas",
      fechaSuspension: new Date("2025-11-15"),
    },
    {
      tipo: "FINALIZADA",
      notaMedia: 7.85,
      fechaFinalizacion: new Date("2026-01-30"),
    },
  ];

  console.log("═══════════════════════════════════════════════════");
  console.log("  MÓDULO 2 — Modelado de dominio y genéricos");
  console.log("═══════════════════════════════════════════════════\n");
  
  console.log("📋 Reportes de matrícula (Unión Discriminada):");
  estados.forEach((estado, i) => {
    console.log(`  [${i + 1}] ${generarReporte(estado)}`);
  });
  
  // 2. Intersection type: EstudianteAuditable
  
  const estudianteAuditable: EstudianteAuditable = {
    id: "EST-999",
    nombreCompleto: "Lucía Fernández Torres",
    email: "lucia@universidad.es",
    fechaNacimiento: new Date("2000-06-10"),
    fechaIngreso: new Date("2022-09-01"),
    // Propiedades de EntidadAuditable (intersección &)
    creadoEn: new Date("2022-08-20"),
    modificadoPor: "admin@universidad.es",
  };
  
  console.log("\n🔗 Tipo intersección — EstudianteAuditable:");
  console.log(
    `  ${estudianteAuditable.nombreCompleto} | Creado: ${estudianteAuditable.creadoEn.toLocaleDateString()} | Por: ${estudianteAuditable.modificadoPor}`
  );
  
  // 3. Generic service: ApiClient
  
  console.log("\n🌐 Llamadas al ApiClient genérico (simulando red):\n");
  
  async function ejecutarConsultas(): Promise<void> {
    // obtenerRecurso<Estudiante> — tipado en T = Estudiante
    const respuestaEstudiantes = await apiClient.obtenerRecurso<Estudiante>(
      "/estudiantes"
    );
  
    console.log(
      `  GET /estudiantes → ${respuestaEstudiantes.codigoEstado} | éxito: ${respuestaEstudiantes.exito}`
    );
    console.log(
      `  Registros recibidos: ${respuestaEstudiantes.datos.length}`
    );
    respuestaEstudiantes.datos.forEach((e) => {
      console.log(`    · ${e.id} — ${e.nombreCompleto} <${e.email}>`);
    });
  
    // obtenerRecurso<Asignatura>
    const respuestaAsignaturas = await apiClient.obtenerRecurso<Asignatura>(
      "/asignaturas"
    );
  
    console.log(
      `\n  GET /asignaturas → ${respuestaAsignaturas.codigoEstado} | éxito: ${respuestaAsignaturas.exito}`
    );
    respuestaAsignaturas.datos.forEach((a) => {
      console.log(
        `    · ${a.id} — ${a.nombre} (${a.creditos} créditos, ${a.obligatoria ? "obligatoria" : "optativa"})`
      );
    });
  
    // obtenerPorId — specific search
    const respuestaUnica = await apiClient.obtenerPorId<Estudiante>(
      "/estudiantes",
      "EST-001"
    );
    console.log(`\n  GET /estudiantes/EST-001 → ${respuestaUnica.codigoEstado}`);
    if (respuestaUnica.datos) {
      console.log(`  Encontrado: ${respuestaUnica.datos.nombreCompleto}`);
    }
  
    // Endpoint does not exist — tests the 404 error handling
    const respuesta404 = await apiClient.obtenerRecurso("/profesores");
    console.log(
      `\n  GET /profesores → ${respuesta404.codigoEstado} | errores: ${respuesta404.errores?.join(", ")}`
    );
  }
  
  ejecutarConsultas()
    .then(() => {
      console.log("\n✅ Módulo 2 ejecutado sin errores.\n");
    })
    .catch((err: unknown) => {
      console.error("Error inesperado:", err);
    });