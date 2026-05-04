/**
 * index.ts
 * Entry point for Module 1.
 * Imports mathematical functions and runs tests using real data.
 */
import { calcularMedia, calcularMediana, filtrarAtipicos, calcularDesviacionEstandar, } from "./math-utils.js";

// Test data
// Standard dataset: exam scores
const notas = [4.5, 7.2, 8.8, 6.1, 9.0, 3.3, 7.5, 8.2, 1.0, 6.8];

// Dataset with obvious outliers
const temperaturasConAtipicos = [22, 21, 23, 22, 100, 20, 21, -50, 22];

// Empty dataset — for testing edge cases
const arrayVacio = [];

// Demonstration of type inference
let timestamp = new Date().getTime(); // TypeScript infiere 'number'
const entornoProd = "PRODUCCION"; // Tipo literal '"PRODUCCION"'

// Execution and formatted output
console.log("═══════════════════════════════════════");
console.log("  MÓDULO 1 — Análisis estadístico");
console.log(`  Entorno: ${entornoProd} | ts: ${timestamp}`);
console.log("═══════════════════════════════════════\n");

// — Exam grades —
console.log("📊 Dataset: notas del examen");
console.log("   Datos:", notas);
const media = calcularMedia(notas);
const mediana = calcularMediana(notas);
const desviacion = calcularDesviacionEstandar(notas);

// use narrowing: media can be a number or null
if (media !== null) {
    console.log(`   Media:              ${media.toFixed(2)}`);
    console.log(`   Notas sin atípicos: ${filtrarAtipicos(notas, desviacion ?? 2).join(", ")}`);
}
else {
    console.log("   Media: sin datos");
}
console.log(`   Mediana:            ${mediana !== null ? mediana.toFixed(2) : "sin datos"}`);
console.log(`   Desviación estándar:${desviacion !== null ? " " + desviacion.toFixed(2) : " sin datos"}`);

// — Unusual temperatures —
console.log("\n🌡️  Dataset: temperaturas con atípicos");
console.log("   Datos:", temperaturasConAtipicos);
const mediaTemp = calcularMedia(temperaturasConAtipicos);
if (mediaTemp !== null) {
    const filtradas = filtrarAtipicos(temperaturasConAtipicos, 15);
    console.log(`   Media (con atípicos): ${mediaTemp.toFixed(2)}`);
    console.log(`   Filtradas (±15):      ${filtradas.join(", ")}`);
}

// — Empty array — edge case
console.log("\n⚠️  Dataset: array vacío (caso límite)");
console.log("   calcularMedia([]):      ", calcularMedia(arrayVacio));
console.log("   calcularMediana([]):    ", calcularMediana(arrayVacio));
console.log("   filtrarAtipicos([], 5): ", filtrarAtipicos(arrayVacio, 5));
console.log("   calcularDesviacion([]): ", calcularDesviacionEstandar(arrayVacio));

// Special types (void, unknown, never)
// void: log function that does not return a value
function registrarEvento(mensaje, nivel = 1, metadatos) {
    console.log(`\n[Nivel ${nivel}] ${mensaje}`);
    if (metadatos !== undefined) {
        // Narrowing obligatorio antes de usar un 'unknown'
        if (typeof metadatos === "string") {
            console.log("   Metadatos (string):", metadatos.toUpperCase());
        }
        else {
            console.log("   Metadatos:", JSON.stringify(metadatos));
        }
    }
}

// never: a function that never returns (always throws an exception)
function fallarSistema(motivo) {
    throw new Error(`[FALLO CRÍTICO] ${motivo}`);
}
registrarEvento("Análisis completado", 1, { registros: notas.length });
registrarEvento("Aviso de calidad", 2, "revisar dataset temperaturas");

// Uncomment the following line to see 'never' in action:
// fallarSistema(“Demonstration of the 'never' type”);
void fallarSistema; // Reference without invocation — avoids “unused variable” in tsc
console.log("\n✅ Módulo 1 ejecutado sin errores.\n");
