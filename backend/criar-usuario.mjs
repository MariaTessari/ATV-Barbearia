import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  // Altere aqui se quiser outro nome/e-mail/senha
  const nome = 'Administrador';
  const email = 'admin@barbearia.com';
  const senha = '123456';
  const cargo = 'ADMIN'; // ou 'ATENDENTE'

  const senhaHash = await bcrypt.hash(senha, 10);

  const client = await pool.connect();
  try {
    const existente = await client.query(
      'SELECT id FROM "Usuario" WHERE email = $1',
      [email]
    );

    if (existente.rows.length > 0) {
      console.log(`Usuário já existe com o e-mail: ${email}`);
      return;
    }

    const res = await client.query(
      'INSERT INTO "Usuario" (nome, email, senha, cargo) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, cargo',
      [nome, email, senhaHash, cargo]
    );

    const u = res.rows[0];
    console.log('✅ Usuário criado com sucesso:');
    console.log(`   ID:    ${u.id}`);
    console.log(`   Nome:  ${u.nome}`);
    console.log(`   E-mail: ${u.email}`);
    console.log(`   Cargo: ${u.cargo}`);
  } catch (err) {
    console.error('❌ Erro ao criar usuário:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
