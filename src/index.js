#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { printBanner } from "./utils/banner.js";
import { filterChallenges } from "./commands/filter.js";
import { challenges, categories } from "./data/challenges.js";

const program = new Command();

program
  .name("hackrs")
  .description(chalk.blueBright("HACKRS CLI — Plataforma de retos de hacking ético"))
  .version("1.0.0");

// ─── retos (interactive, default command) ────────────────────────────────────
program
  .command("retos", { isDefault: false })
  .description("Filtra y explora los retos disponibles de forma interactiva")
  .option("-c, --category <cat>",    `Filtrar por categoría: ${categories.join(", ")}`)
  .option("-d, --difficulty <diff>", "Filtrar por dificultad: Fácil, Medio, Difícil")
  .option("--solved",                "Mostrar solo retos resueltos")
  .option("--pending",               "Mostrar solo retos pendientes")
  .option("-s, --search <term>",     "Buscar por título, descripción o tag")
  .action(async (opts) => {
    printBanner();

    const flags = {
      category:   opts.category   || null,
      difficulty: opts.difficulty || null,
      solved:     opts.solved  ? "solved"  : opts.pending ? "pending" : undefined,
      search:     opts.search     || null,
    };

    await filterChallenges(flags);
  });

// ─── stats ───────────────────────────────────────────────────────────────────
program
  .command("stats")
  .description("Muestra estadísticas generales de los retos")
  .action(() => {
    printBanner();

    const total   = challenges.length;
    const solved  = challenges.filter((c) => c.solved).length;
    const pending = total - solved;
    const pct     = Math.round((solved / total) * 100);
    const pts     = challenges.filter((c) => c.solved).reduce((a, c) => a + c.points, 0);
    const totalPts = challenges.reduce((a, c) => a + c.points, 0);

    console.log(chalk.blue("  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    console.log(chalk.bold.white("  ESTADÍSTICAS"));
    console.log(chalk.blue("  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));

    console.log(`  ${chalk.white("Total de retos:")}   ${chalk.blueBright(total)}`);
    console.log(`  ${chalk.white("Resueltos:     ")}   ${chalk.green(solved)}  ${chalk.dim(`(${pct}%)`)}`);
    console.log(`  ${chalk.white("Pendientes:    ")}   ${chalk.gray(pending)}`);
    console.log(`  ${chalk.white("Puntos obtenidos:")} ${chalk.yellow(pts)} ${chalk.dim(`/ ${totalPts}`)}\n`);

    // Progress bar
    const barLen  = 40;
    const filled  = Math.round((solved / total) * barLen);
    const bar     = chalk.green("█".repeat(filled)) + chalk.dim("░".repeat(barLen - filled));
    console.log(`  Progreso  ${bar}  ${chalk.bold.white(pct + "%")}\n`);

    // Per-category
    console.log(chalk.blue("  ── Por categoría ─────────────────────────────────────────\n"));
    categories.forEach((cat) => {
      const inCat   = challenges.filter((c) => c.category === cat);
      const solvedC = inCat.filter((c) => c.solved).length;
      const pctC    = Math.round((solvedC / inCat.length) * 100);
      const miniBar = chalk.green("█".repeat(Math.round(pctC / 10))) +
                      chalk.dim("░".repeat(10 - Math.round(pctC / 10)));
      console.log(
        `  ${chalk.cyan(cat.padEnd(14))}  ${miniBar}  ` +
        chalk.green(`${solvedC}/${inCat.length}`) +
        chalk.dim(` (${pctC}%)`)
      );
    });
    console.log();
  });

// ─── default: show banner + help ─────────────────────────────────────────────
program.action(() => {
  printBanner();
  console.log(chalk.blue("  Usa uno de los siguientes comandos:\n"));
  console.log(`  ${chalk.bold.white("hackrs retos")}   ${chalk.dim("— Filtrar y explorar retos (modo interactivo)")}`);
  console.log(`  ${chalk.bold.white("hackrs stats")}   ${chalk.dim("— Ver estadísticas de progreso")}`);
  console.log(`\n  ${chalk.dim("Añade --help a cualquier comando para más opciones.")}\n`);
});

program.parse(process.argv);
