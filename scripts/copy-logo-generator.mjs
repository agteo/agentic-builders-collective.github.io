import { execFileSync } from "node:child_process";
import { createReadStream, existsSync } from "node:fs";
import { cp, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const logoGeneratorPath = "/logo-generator";
const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".md", "text/markdown; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
]);

function hasLogoGenerator(sourceDir) {
  return existsSync(path.join(sourceDir, "index.html"));
}

function ensureLogoGeneratorSubmodule({ rootDir, sourceDir }) {
  if (hasLogoGenerator(sourceDir)) {
    return;
  }

  try {
    console.log("Initialising logo-generator submodule...");
    execFileSync("git", ["submodule", "update", "--init", "--recursive", "logo-generator"], {
      cwd: rootDir,
      stdio: "inherit",
    });
  } catch {
    throw new Error(
      "Cannot publish /logo-generator because the logo-generator submodule is missing and automatic initialisation failed. Run `git submodule update --init --recursive` before building."
    );
  }

  if (!hasLogoGenerator(sourceDir)) {
    throw new Error(
      "Cannot publish /logo-generator because the logo-generator submodule is still missing after initialisation. Run `git submodule update --init --recursive` before building."
    );
  }
}

export async function copyLogoGenerator({ rootDir = repoRoot, outDir = path.join(repoRoot, "dist") } = {}) {
  const sourceDir = path.join(rootDir, "logo-generator");
  const targetDir = path.join(outDir, "logo-generator");

  ensureLogoGeneratorSubmodule({ rootDir, sourceDir });

  await rm(targetDir, { recursive: true, force: true });
  await mkdir(targetDir, { recursive: true });
  await cp(sourceDir, targetDir, {
    recursive: true,
    filter(sourcePath) {
      return !sourcePath.split(path.sep).includes(".git");
    },
  });
}

export function serveLogoGeneratorDev({ rootDir = repoRoot } = {}) {
  const sourceDir = path.join(rootDir, "logo-generator");

  return async function logoGeneratorMiddleware(req, res, next) {
    const url = new URL(req.url ?? "/", "http://localhost");
    const pathname = decodeURIComponent(url.pathname);

    if (pathname === logoGeneratorPath) {
      res.statusCode = 302;
      res.setHeader("Location", `${logoGeneratorPath}/`);
      res.end();
      return;
    }

    if (!pathname.startsWith(`${logoGeneratorPath}/`)) {
      next();
      return;
    }

    const requestedPath = pathname.slice(logoGeneratorPath.length + 1) || "index.html";
    const filePath = path.normalize(path.join(sourceDir, requestedPath));

    if (!filePath.startsWith(`${sourceDir}${path.sep}`)) {
      res.statusCode = 403;
      res.end("Forbidden");
      return;
    }

    try {
      const fileStat = await stat(filePath);
      if (!fileStat.isFile() || path.basename(filePath) === ".git") {
        next();
        return;
      }

      res.statusCode = 200;
      res.setHeader("Content-Type", contentTypes.get(path.extname(filePath)) ?? "application/octet-stream");
      createReadStream(filePath).pipe(res);
    } catch {
      next();
    }
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await copyLogoGenerator();
}
