import chalk from "chalk";
import figlet from "figlet";

export function printBanner() {
  const text = figlet.textSync("HACKRS", {
    font: "ANSI Shadow",
    horizontalLayout: "default",
    verticalLayout: "default",
  });

  console.log(chalk.blueBright(text));
  console.log(
    chalk.blue("  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n") +
    chalk.blue("  ") + chalk.bold.white("Plataforma de retos de hacking ético") +
    chalk.blue("  |  ") + chalk.cyan("v1.0.0") + "\n" +
    chalk.blue("  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
  );
}
