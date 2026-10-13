import bcrypt from "bcryptjs";

const pin = process.argv[2];
if (!pin || !/^\d{4,8}$/.test(pin)) {
  console.error("Uso: npm run pin:hash -- 123456");
  console.error("PIN deve ter 4 a 8 dígitos numéricos.");
  process.exit(1);
}

const hash = bcrypt.hashSync(pin, 12);
console.log("\nCole no .env.local e na Vercel:\n");
console.log(`VAULT_PIN_HASH=${hash}\n`);
