# HACKRS CLI

```
██╗  ██╗ █████╗  ██████╗██╗  ██╗██████╗ ███████╗
██║  ██║██╔══██╗██╔════╝██║ ██╔╝██╔══██╗██╔════╝
███████║███████║██║     █████╔╝ ██████╔╝███████╗
██╔══██║██╔══██║██║     ██╔═██╗ ██╔══██╗╚════██║
██║  ██║██║  ██║╚██████╗██║  ██╗██║  ██║███████║
╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝
```

Plataforma de retos de hacking ético en la terminal. Filtra, explora y
rastrea tu progreso en retos de CTF desde la línea de comandos.

---

## Requisitos

- [Node.js](https://nodejs.org/) v18 o superior
- [pnpm](https://pnpm.io/) (o npm / bun)

---

## Instalación

```bash
# Clona el repositorio
git clone https://github.com/hackrs/hackrs-cli
cd hackrs-cli

# Instala las dependencias
pnpm install

# (Opcional) Instala globalmente para usar `hackrs` desde cualquier lugar
pnpm link --global
```

Si no tienes pnpm:

```bash
npm install -g pnpm
```

---

## Uso rápido

```bash
node src/index.js           # muestra el banner y la ayuda
node src/index.js retos     # modo interactivo para filtrar retos
node src/index.js stats     # estadísticas de tu progreso
```

Si instalaste globalmente:

```bash
hackrs
hackrs retos
hackrs stats
```

---

## Comandos

### `hackrs` — Pantalla de inicio

Muestra el banner de HACKRS y la lista de comandos disponibles.

```bash
node src/index.js
```

---

### `hackrs retos` — Explorar retos

Filtra y lista los retos disponibles. Sin flags lanza un **menú interactivo**;
con flags va directo al resultado.

```bash
node src/index.js retos [opciones]
```

#### Opciones

| Flag | Alias | Descripción |
|------|-------|-------------|
| `--category <cat>` | `-c` | Filtra por categoría |
| `--difficulty <diff>` | `-d` | Filtra por dificultad |
| `--solved` | — | Muestra solo retos resueltos |
| `--pending` | — | Muestra solo retos pendientes |
| `--search <término>` | `-s` | Busca en título, descripción y tags |

#### Categorías disponibles

| Nombre | Descripción |
|--------|-------------|
| `Web` | Vulnerabilidades en aplicaciones web |
| `Pwn` | Explotación de binarios |
| `Criptografía` | Ataques y análisis criptográfico |
| `Forense` | Análisis forense digital |
| `Reversing` | Ingeniería inversa |
| `OSINT` | Inteligencia en fuentes abiertas |

#### Niveles de dificultad

| Nivel | Barra | Puntos aproximados |
|-------|-------|--------------------|
| `Fácil` | `█░░` | 100 – 150 pts |
| `Medio` | `██░` | 200 – 350 pts |
| `Difícil` | `███` | 400 – 550 pts |

---

### `hackrs stats` — Estadísticas

Muestra un resumen de tu progreso con barra de avance y desglose por categoría.

```bash
node src/index.js stats
```

Salida de ejemplo:

```
  Total de retos:    12
  Resueltos:         3  (25%)
  Pendientes:        9
  Puntos obtenidos:  650 / 3470

  Progreso  ██████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  25%

  ── Por categoría ─────────────────────────────────
  Web             ███░░░░░░░  1/3 (33%)
  Pwn             ░░░░░░░░░░  0/3 (0%)
  Criptografía    ░░░░░░░░░░  0/2 (0%)
  Forense         ██████████  2/2 (100%)
  Reversing       ░░░░░░░░░░  0/1 (0%)
  OSINT           ░░░░░░░░░░  0/1 (0%)
```

---

## Ejemplos

### Modo interactivo

Ejecuta `retos` sin flags y navega con las flechas del teclado:

```bash
node src/index.js retos
```

```
  Configura los filtros:

? Categoría(s)   (espacio para seleccionar, enter para todas)
  ❯ ○ [Web]
    ○ [Pwn]
    ○ [Criptografía]
    ...

? Dificultad(es)
  ❯ ○ Fácil
    ○ Medio
    ○ Difícil

? Estado
  ❯ Todos
    ✔ Solo resueltos
    ○ Solo pendientes

? Buscar por título o tag (enter para saltar)
```

---

### Filtros directos con flags

**Todos los retos de Web fáciles:**
```bash
node src/index.js retos --category Web --difficulty Fácil
```

**Retos pendientes de Pwn:**
```bash
node src/index.js retos --category Pwn --pending
```

**Buscar por tag o keyword:**
```bash
node src/index.js retos --search jwt
node src/index.js retos --search rsa
node src/index.js retos --search binary
```

**Ver solo lo que ya resolviste:**
```bash
node src/index.js retos --solved
```

**Combinar múltiples filtros:**
```bash
node src/index.js retos --category Pwn --difficulty Difícil --pending
```

---

## Estructura del proyecto

```
hackrs-cli/
├── package.json
└── src/
    ├── index.js              # Entry point, definición de comandos
    ├── data/
    │   └── challenges.js     # Base de datos de retos
    ├── commands/
    │   └── filter.js         # Lógica de filtrado e interfaz interactiva
    └── utils/
        └── banner.js         # Banner ASCII de HACKRS
```

---

## Añadir nuevos retos

Abre `src/data/challenges.js` y añade un objeto al array `challenges`:

```js
{
  id: 13,
  title: "Nombre del reto",
  category: "Web",           // Web | Pwn | Criptografía | Forense | Reversing | OSINT
  difficulty: "Medio",       // Fácil | Medio | Difícil
  points: 200,
  tags: ["tag1", "tag2"],
  description: "Descripción breve del reto.",
  solved: false,
}
```

---

## Dependencias

| Paquete | Versión | Uso |
|---------|---------|-----|
| [chalk](https://github.com/chalk/chalk) | 6.x | Colores en terminal |
| [figlet](https://github.com/patorjk/figlet.js) | 1.x | Banner ASCII art |
| [inquirer](https://github.com/SBoudrias/Inquirer.js) | 14.x | Menú interactivo |
| [commander](https://github.com/tj/commander.js) | 15.x | Parsing de comandos CLI |

---

## Licencia

MIT © HACKRS
