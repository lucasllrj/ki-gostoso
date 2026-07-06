const { spawn } = require("child_process");

const npm = process.platform === "win32" ? "npm.cmd" : "npm";

const processes = [
  spawn(npm, ["--prefix", "backend", "run", "dev"], {
    stdio: "inherit",
    shell: false,
  }),
  spawn(npm, ["--prefix", "frontend", "run", "dev"], {
    stdio: "inherit",
    shell: false,
  }),
];

const stopAll = (code = 0) => {
  for (const child of processes) {
    if (!child.killed) child.kill("SIGINT");
  }

  process.exit(code);
};

for (const child of processes) {
  child.on("exit", (code) => {
    if (code && code !== 0) stopAll(code);
  });
}

process.on("SIGINT", () => stopAll(0));
process.on("SIGTERM", () => stopAll(0));
