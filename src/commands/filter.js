import chalk from "chalk";
import inquirer from "inquirer";
import { challenges, categories, difficulties } from "../data/challenges.js";

// ─── helpers ────────────────────────────────────────────────────────────────

const DIFFICULTY_COLOR = {
  "Fácil":  chalk.green,
  "Medio":  chalk.yellow,
  "Difícil": chalk.red,
};

const CATEGORY_COLOR = {
  "Web":          chalk.cyan,
  "Pwn":          chalk.magenta,
  "Criptografía": chalk.yellow,
  "Forense":      chalk.blue,
  "Reversing":    chalk.red,
  "OSINT":        chalk.green,
};

function difficultyBar(difficulty) {
  const bars = { "Fácil": "█░░", "Medio": "██░", "Difícil": "███" };
  const color = DIFFICULTY_COLOR[difficulty] ?? chalk.white;
  return color(bars[difficulty] ?? "░░░");
}

function categoryBadge(cat) {
  const color = CATEGORY_COLOR[cat] ?? chalk.white;
  return color(`[${cat}]`);
}

function renderChallenge(ch, index) {
  const solved    = ch.solved ? chalk.green("✔ Resuelto") : chalk.gray("○ Pendiente");
  const points    = chalk.blueBright(`${ch.points} pts`);
  const diff      = (DIFFICULTY_COLOR[ch.difficulty] ?? chalk.white)(ch.difficulty);
  const tags      = ch.tags.map((t) => chalk.dim(`#${t}`)).join(" ");

  console.log(
    chalk.blue(`\n  ${index + 1}.`) +
    chalk.bold.white(` ${ch.title}`) +
    "  " + solved
  );
  console.log(
    `     ${categoryBadge(ch.category)}  ${diff}  ${difficultyBar(ch.difficulty)}  ${points}`
  );
  console.log(`     ${chalk.dim(ch.description)}`);
  console.log(`     ${tags}`);
  console.log(chalk.blue("  " + "─".repeat(60)));
}

function renderResults(results) {
  if (results.length === 0) {
    console.log(chalk.yellow("\n  No se encontraron retos con esos filtros.\n"));
    return;
  }

  const solved   = results.filter((c) => c.solved).length;
  const pending  = results.length - solved;
  const totalPts = results.reduce((acc, c) => acc + c.points, 0);

  console.log(
    chalk.blue("\n  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  );
  console.log(
    chalk.bold.white("  RESULTADOS  ") +
    chalk.green(`✔ ${solved} resueltos  `) +
    chalk.gray(`○ ${pending} pendientes  `) +
    chalk.blueBright(`Σ ${totalPts} pts disponibles`)
  );
  console.log(
    chalk.blue("  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  );

  results.forEach((ch, i) => renderChallenge(ch, i));
  console.log();
}

// ─── interactive filter ──────────────────────────────────────────────────────

export async function filterChallenges(opts = {}) {
  let filtered = [...challenges];

  // If called with CLI flags, skip the interactive prompt
  const hasFlags =
    opts.category || opts.difficulty || opts.solved !== undefined || opts.search;

  if (!hasFlags) {
    console.log(chalk.blue("\n  Configura los filtros:\n"));

    const answers = await inquirer.prompt([
      {
        type: "checkbox",
        name: "categories",
        message: chalk.white("Categoría(s)  ") + chalk.dim("(espacio para seleccionar, enter para todas)"),
        choices: categories.map((c) => ({ name: categoryBadge(c) + "  " + c, value: c })),
      },
      {
        type: "checkbox",
        name: "difficulties",
        message: chalk.white("Dificultad(es)"),
        choices: difficulties.map((d) => ({
          name: (DIFFICULTY_COLOR[d] ?? chalk.white)(d),
          value: d,
        })),
      },
      {
        type: "list",
        name: "solved",
        message: chalk.white("Estado"),
        choices: [
          { name: "Todos", value: "all" },
          { name: chalk.green("✔ Solo resueltos"), value: "solved" },
          { name: chalk.gray("○ Solo pendientes"), value: "pending" },
        ],
        default: "all",
      },
      {
        type: "input",
        name: "search",
        message: chalk.white("Buscar por título o tag") + chalk.dim(" (enter para saltar)"),
      },
    ]);

    opts = {
      category:   answers.categories.length ? answers.categories : null,
      difficulty: answers.difficulties.length ? answers.difficulties : null,
      solved:     answers.solved,
      search:     answers.search.trim() || null,
    };
  }

  // Apply filters
  if (opts.category) {
    const cats = Array.isArray(opts.category) ? opts.category : [opts.category];
    filtered = filtered.filter((c) => cats.includes(c.category));
  }

  if (opts.difficulty) {
    const diffs = Array.isArray(opts.difficulty) ? opts.difficulty : [opts.difficulty];
    filtered = filtered.filter((c) => diffs.includes(c.difficulty));
  }

  if (opts.solved === "solved" || opts.solved === true) {
    filtered = filtered.filter((c) => c.solved);
  } else if (opts.solved === "pending" || opts.solved === false) {
    filtered = filtered.filter((c) => !c.solved);
  }

  if (opts.search) {
    const term = opts.search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.title.toLowerCase().includes(term) ||
        c.tags.some((t) => t.toLowerCase().includes(term)) ||
        c.description.toLowerCase().includes(term)
    );
  }

  renderResults(filtered);
}
