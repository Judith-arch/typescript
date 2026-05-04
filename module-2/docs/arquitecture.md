# Architecture Documentation — Module 2

## University Domain Model

### Why `interface` and not `type`?

| Criterion | `interface` | `type` |
|---|---|---|
| Objects with identity | ✅ ideal | possible |
| Unions and primitives | ❌ not supported | ✅ ideal |
| Declaration merging | ✅ yes | ❌ no |
| Semantic clarity | ✅ high | medium |

`interface` is used for `Estudiante` and `Asignatura` because they represent domain entities — objects with a clear identity and a stable structure. The `readonly` modifier on `id` enforces immutability after creation: an identifier should never be reassigned once set.

`type` is used only for semantic aliases (`UUID`, `Creditos`) and for the discriminated union `EstadoMatricula`, because a union of interfaces cannot be expressed with `interface` alone.

---

### Entity: `Estudiante`

```ts
export interface Estudiante {
  readonly id: UUID;
  nombreCompleto: string;
  email: string;
  fechaNacimiento: Date;
  fechaIngreso: Date;
  fechaUltimoAcceso?: Date;
}
```

`fechaUltimoAcceso` is optional (`?`) because a newly registered student may never have logged in. Making it optional instead of `Date | null` communicates this intent more clearly — the field simply may not exist yet.

---

### Entity: `Asignatura`

```ts
export interface Asignatura {
  readonly id: UUID;
  nombre: string;
  creditos: Creditos;
  departamento: string;
  obligatoria: boolean;
}
```

`obligatoria` is typed as `boolean` rather than a free `string` to prevent uncontrolled values and make conditionals cleaner.

---

### Discriminated Union: `EstadoMatricula`

Instead of a single interface with ambiguous optional properties:

```ts
// ❌ Anti-pattern — when does notaMedia exist? When does motivoSuspension?
interface Matricula {
  estado: string;
  asignaturas?: Asignatura[];
  motivoSuspension?: string;
  notaMedia?: number;
}
```

Three closed interfaces are defined, each with exactly the data that belongs to that state, united by the discriminant property `tipo`:

```ts
// ✅ Each state is a complete, independent contract
export type EstadoMatricula =
  | MatriculaActiva
  | MatriculaSuspendida
  | MatriculaFinalizada;
```

**Architectural advantage:** TypeScript narrows the type 100% safely in each branch of the `switch`. In the `case "FINALIZADA"` branch, the compiler knows with certainty that `notaMedia` exists and is `number`. No manual `undefined` checks needed, no risk of accessing a non-existent property.

---

### Intersection Type: `EstudianteAuditable`

```ts
type EntidadAuditable = { creadoEn: Date; modificadoPor: string; };
export type EstudianteAuditable = Estudiante & EntidadAuditable;
```

The `&` operator combines two contracts. The result must satisfy both simultaneously. The advantage over extending `Estudiante` directly is that `EntidadAuditable` is reusable — it could be applied to `Asignatura`, `Profesor`, or any other entity without duplicating the audit fields.

---

### Generic Interface: `RespuestaAPI<T>`

```ts
export interface RespuestaAPI<T> {
  codigoEstado: number;
  exito: boolean;
  datos: T;
  errores?: string[];
  timestamp: Date;
}
```

The generic `T` parametrizes the payload without sacrificing type safety. Without generics, a separate interface would be needed for every entity, violating the DRY principle.

```ts
// One interface works for any entity:
const r1: RespuestaAPI<Estudiante[]> = await apiClient.obtenerRecurso<Estudiante>("/estudiantes");
const r2: RespuestaAPI<Asignatura[]> = await apiClient.obtenerRecurso<Asignatura>("/asignaturas");
```

The constraint `T extends object` in `obtenerRecurso` prevents primitive types like `string` or `number` from being passed accidentally as the generic parameter.

---

### Generic Service: `ApiClient`

The `ApiClient` class simulates database calls using `setTimeout` and typed promises. Two generic methods are exposed:

**`obtenerRecurso<T>(endpoint)`** — returns all resources at a given endpoint as `Promise<RespuestaAPI<T[]>>`. Returns a typed 404 response if the endpoint does not exist.

**`obtenerPorId<T>(endpoint, id)`** — searches for a single resource by id. The constraint `T extends { id: string }` ensures that only entities with an `id` field can be queried this way. Returns `Promise<RespuestaAPI<T | null>>` — null when not found.

This design means the caller always gets a fully typed response regardless of the outcome, with no need to handle raw `any` values or untyped exceptions.