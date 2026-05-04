/**
 * math-utils.ts
 * A module of statistical analysis functions with strict typing.
 */

/**
 * Calculates the arithmetic mean of an array of numbers.
 * Returns null if the array is empty (explicit edge case).
 */
export function calcularMedia(datos: number[]): number | null {
    if (datos.length === 0) return null;
  
    const suma = datos.reduce((acumulador, valor) => acumulador + valor, 0);
    return suma / datos.length;
  }
  
  /**
   * Calculates the median of an array of numbers.
   * Returns null if the array is empty.
   * Does not modify the original array (uses a copy).
   */
  export function calcularMediana(datos: number[]): number | null {
    if (datos.length === 0) return null;
  
    const ordenados = [...datos].sort((a, b) => a - b);
    const mitad = Math.floor(ordenados.length / 2);
  
    // If the length is even, we take the average of the two middle values
    if (ordenados.length % 2 === 0) {
      return (ordenados[mitad - 1]! + ordenados[mitad]!) / 2;
    }
  
    return ordenados[mitad]!;
  }
  
  /**
   * Filters out outliers from an array.
   * A value is considered an outlier if its distance from the mean exceeds the specified threshold.
   * Returns an empty array if there is no valid data.
   *
   * @param datos   - numbers to filter array
   * @param limite  - Maximum permissible deviation from the mean
   */
  export function filtrarAtipicos(datos: number[], limite: number): number[] {
    const media = calcularMedia(datos);
  
    // If the array is null (empty), there is nothing to filter
    if (media === null) return [];
  
    return datos.filter((valor) => Math.abs(valor - media) <= limite);
  }
  
  /**
   * Calculates the standard deviation of an array of numbers.
   * Returns null if the array is empty or contains only one element.
   */
  export function calcularDesviacionEstandar(datos: number[]): number | null {
    const media = calcularMedia(datos);
    if (media === null || datos.length < 2) return null;
  
    const varianza =
      datos.reduce((acum, valor) => acum + Math.pow(valor - media, 2), 0) /
      (datos.length - 1); // Sample deviation (n-1)
  
    return Math.sqrt(varianza);
  }