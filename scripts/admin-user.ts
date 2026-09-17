/**
 * Creates an admin user, or rotates an existing one's password.
 *
 * This is the only thing that changes a live password, so it never happens as
 * a side effect of seeding content.
 *
 *   npm run admin:create      create a user, refusing if the email exists
 *   npm run admin:password    set the password for an existing user
 *   npm run admin:list        show who can sign in
 *
 * Credentials come from the environment so they stay out of your shell history:
 *   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
 */
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

try {
  process.loadEnvFile(path.join(process.cwd(), ".env"));
} catch {
  // Fall back to the ambient environment.
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const command = process.argv[2] ?? "list";
const MIN_PASSWORD_LENGTH = 10;

function requireEmail() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  if (!email) throw new Error("Set ADMIN_EMAIL before running this.");
  return email;
}

function requirePassword() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("Set ADMIN_PASSWORD before running this.");
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(
      `ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    );
  }
  return password;
}

async function list() {
  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      email: true,
      name: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });

  if (users.length === 0) {
    console.log("No admin users yet. Run: npm run admin:create");
    return;
  }

  console.log(`${users.length} admin user${users.length === 1 ? "" : "s"}:`);
  for (const u of users) {
    const seen = u.lastLoginAt
      ? u.lastLoginAt.toISOString().slice(0, 16).replace("T", " ")
      : "never";
    console.log(
      `  ${u.email.padEnd(36)} ${u.name.padEnd(18)} ${
        u.isActive ? "active " : "DISABLED"
      }  last login: ${seen}`,
    );
  }
}

async function create() {
  const email = requireEmail();
  const password = requirePassword();
  const name = process.env.ADMIN_NAME ?? "Admin";

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    throw new Error(
      `${email} already exists. Use \`npm run admin:password\` to change the password.`,
    );
  }

  await prisma.adminUser.create({
    data: { email, name, passwordHash: await bcrypt.hash(password, 12) },
  });
  console.log(`Created ${email}. Sign in at /admin.`);
}

async function setPassword() {
  const email = requireEmail();
  const password = requirePassword();

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (!existing) {
    throw new Error(`${email} does not exist. Use \`npm run admin:create\`.`);
  }

  await prisma.adminUser.update({
    where: { email },
    data: {
      passwordHash: await bcrypt.hash(password, 12),
      isActive: true,
    },
  });
  console.log(`Password updated for ${email}.`);
}

const commands: Record<string, () => Promise<void>> = {
  list,
  create,
  password: setPassword,
};

const run = commands[command];

if (!run) {
  console.error(
    `Unknown command "${command}". Use one of: ${Object.keys(commands).join(", ")}`,
  );
  process.exitCode = 1;
} else {
  run()
    .catch((error) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
