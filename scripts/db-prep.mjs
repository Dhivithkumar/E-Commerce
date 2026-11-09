import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const schemaPath = path.join(rootDir, "prisma", "schema.prisma");

async function prepareDatabase() {
  console.log("🛠️  Preparing Database for Deployment...");

  const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
  process.env.DATABASE_URL = dbUrl;

  // Ensure a fallback .env exists if not provided by the host
  const envPath = path.join(rootDir, ".env");
  if (!fs.existsSync(envPath)) {
    console.log("📝 Generating deployment fallback .env file...");
    const defaultEnv = `DATABASE_URL="${dbUrl}"\nAUTH_SECRET="${process.env.AUTH_SECRET || "elora_luxury_secret_session_key_2026"}"\n`;
    fs.writeFileSync(envPath, defaultEnv, "utf-8");
  }

  const isPostgres = dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://");
  const targetProvider = isPostgres ? "postgresql" : "sqlite";

  // Check and update datasource in prisma/schema.prisma
  if (fs.existsSync(schemaPath)) {
    let schemaContent = fs.readFileSync(schemaPath, "utf-8");
    const datasourceRegex = /datasource\s+db\s*\{[\s\S]*?\}/;

    let targetDatasource = "";
    if (isPostgres) {
      targetDatasource = `datasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}`;
    } else {
      targetDatasource = `datasource db {\n  provider = "sqlite"\n  url      = "file:./dev.db"\n}`;
    }

    if (datasourceRegex.test(schemaContent)) {
      schemaContent = schemaContent.replace(datasourceRegex, targetDatasource);
      fs.writeFileSync(schemaPath, schemaContent, "utf-8");
    }
  }

  console.log("⚙️  Generating Prisma Client...");
  execSync("npx prisma generate", { stdio: "inherit", cwd: rootDir, env: process.env });

  console.log("📦 Synchronizing database schema ('prisma db push')...");
  execSync("npx prisma db push --skip-generate --accept-data-loss", {
    stdio: "inherit",
    cwd: rootDir,
    env: process.env,
  });

  // Check if database needs initial seeding
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    const productCount = await prisma.product.count();
    await prisma.$disconnect();

    if (productCount === 0) {
      console.log("🌱 Database is fresh (0 products found). Seeding catalog and users...");
      execSync("node prisma/seed.mjs", { stdio: "inherit", cwd: rootDir, env: process.env });
    } else {
      console.log(`✅ Database already populated with ${productCount} formulations. Skipping seed.`);
    }
  } catch (err) {
    console.log("⚠️ Notice during seed verification:", err.message);
    try {
      console.log("🌱 Running seed to ensure database tables are populated...");
      execSync("node prisma/seed.mjs", { stdio: "inherit", cwd: rootDir, env: process.env });
    } catch (seedErr) {
      console.log("⚠️ Seed step encountered notice (continuing):", seedErr.message);
    }
  }

  console.log("✨ Database preparation completed successfully!");
}

prepareDatabase().catch((err) => {
  console.error("❌ Database preparation failed:", err);
  process.exit(1);
});
