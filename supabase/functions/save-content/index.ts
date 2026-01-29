
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { password, content } = await req.json()

        // 1. Validate Password (Server-side check)
        const CORRECT_PASSWORD = Deno.env.get('CMS_PASSWORD')
        if (!CORRECT_PASSWORD) {
            throw new Error('Server misconfiguration: CMS_PASSWORD not set')
        }

        if (password !== CORRECT_PASSWORD) {
            return new Response(
                JSON.stringify({ error: 'Senha incorreta' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // 2. Initialize Admin Client (Service Role)
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 3. Update Database (Bypassing RLS via Service Role)
        const { error } = await supabaseClient
            .from('site_content')
            .upsert({
                id: 'main_content',
                content: content,
                updated_at: new Date().toISOString()
            })

        if (error) throw error

        return new Response(
            JSON.stringify({ success: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
