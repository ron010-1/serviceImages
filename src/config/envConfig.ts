import z from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    SUPABASE_URL: z.string().url(),
    SUPABASE_ANON_KEY: z.string().min(1),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1)
});

const env = envSchema.safeParse(process.env);

if(!env.success){
    console.error("Erro na validaçao das variaveis de ambiente:", env.error.format());
    process.exit(1);
}

export default env.data;