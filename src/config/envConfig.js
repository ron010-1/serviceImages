import z from "zod";
import dotenv from "dotenv";

const envs = dotenv.config();

if (envs.error) {
  console.error("Erro ao carregar .env:", envs.error);
  process.exit(1);
}

const envSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

const env = envSchema.safeParse(envs.parsed);

if (!env.success) {
  console.error("Erro na validação das variáveis de ambiente:", env.error.format());
  process.exit(1);
}

export default env.data;
