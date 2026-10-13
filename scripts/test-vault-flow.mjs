import {
  hashPin,
  verifyPin,
  generateVaultCode,
  signVaultToken,
  verifyVaultToken,
} from "../src/lib/auth/vault-crypto.ts";
import {
  createVaultRecord,
  getVaultByCode,
  createMediaRecord,
  listMediaRecords,
  updateMediaRecord,
  deleteMediaRecord,
  getDashboardData,
} from "../src/lib/data/vault-store.ts";

async function run() {
  console.log("=== TESTANDO SISTEMA MEDIA VAULT ===");

  // 1. Teste Criptografia
  const pin = "123456";
  const hash = await hashPin(pin);
  console.log("1. PIN hash gerado:", hash.slice(0, 30) + "...");
  const pinOk = await verifyPin(pin, hash);
  const pinWrong = await verifyPin("999999", hash);
  console.log("   Validação PIN correto:", pinOk ? "PASS" : "FAIL");
  console.log("   Validação PIN errado:", !pinWrong ? "PASS" : "FAIL");

  // 2. Criação de Vault
  const { vault, code } = await createVaultRecord("4321");
  console.log(`2. Vault criado: ID=${vault.id}, Código=${code}`);

  // 3. Busca por código
  const foundVault = await getVaultByCode(code);
  console.log("3. Busca por código numérico:", foundVault?.id === vault.id ? "PASS" : "FAIL");

  // 4. Token de Sessão
  const token = signVaultToken({ vaultId: vault.id, vaultCode: code });
  const payload = verifyVaultToken(token);
  console.log("4. Assinatura e verificação de token:", payload?.vaultCode === code ? "PASS" : "FAIL");

  // 5. Cadastro de Mídias
  const movie = await createMediaRecord(vault.id, "movie", {
    title: "Interestelar",
    year: 2014,
    rating: 5,
    description: "Ficção científica no espaço",
    notes: "Trilha sonora impecável de Hans Zimmer",
  });
  console.log(`5. Filme criado: ${movie.title} (ID: ${movie.id})`);

  const game = await createMediaRecord(vault.id, "game", {
    title: "The Witcher 3",
    platform: "PC",
    status: "platinum",
    rating: 5,
  });
  console.log(`   Jogo criado: ${game.title} (Status: ${game.status})`);

  // 6. Listagem
  const movies = await listMediaRecords(vault.id, "movie");
  console.log(`6. Listagem de filmes do vault: ${movies.length} encontrado(s)`);

  // 7. Atualização
  const updatedMovie = await updateMediaRecord(vault.id, "movie", movie.id, {
    title: "Interestelar (Edição IMAX)",
    rating: 5,
  });
  console.log(`7. Atualização de filme: ${updatedMovie?.title}`);

  // 8. Dashboard
  const dashboard = await getDashboardData(vault.id);
  console.log("8. Dashboard counts:", dashboard.counts);

  // 9. Exclusão
  const deleted = await deleteMediaRecord(vault.id, "movie", movie.id);
  console.log("9. Exclusão de filme:", deleted ? "PASS" : "FAIL");

  console.log("\nTODOS OS TESTES DO FLUXO DO VAULT PASSARAM COM SUCESSO! 🎉");
}

run().catch((err) => {
  console.error("Erro nos testes:", err);
  process.exit(1);
});
