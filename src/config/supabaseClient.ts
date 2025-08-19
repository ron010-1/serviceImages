import env from "./envConfig";
import {createClient} from "@supabase/supabase-js";

const supabase = createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY
)

export default supabase;