import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LoginLog {
  device_info: string;
  login_time: string;
  success: boolean;
}

Deno.serve(async (req) => {
  // 1. Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Initialize Supabase with SERVICE ROLE KEY (The "God Mode" fix)
    // This allows the function to bypass RLS and write to the DB successfully
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' 
    )

    // 3. Parse Request
    const { user_id, device_info, login_success, user_name } = await req.json()
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    const currentLoginTime = new Date()

    // 4. Query History
    const { data: history, error } = await supabase
      .from('login_logs')
      .select('device_info, login_time, success')
      .eq('user_id', user_id)
      .order('login_time', { ascending: false })

    if (error) throw new Error("Database query failed: " + error.message)

    // 5. Calculate Risk
    let riskScore = 0

    // Factor: New Device
    const knownDevices = new Set(
      history.filter((log: LoginLog) => log.success).map((log: LoginLog) => log.device_info)
    )
    if (!knownDevices.has(device_info)){
      console.log("Unknown device detected. Adding penalty.")
      riskScore += 40
    } 

    // Factor: Unusual Time
    const currentHour = currentLoginTime.getHours()
    const usualHours = history
      .filter((log: LoginLog) => log.success)
      .map((log: LoginLog) => new Date(log.login_time).getHours())
      
    if (usualHours.length > 0) {
      const isNormalTime = usualHours.some((h: number) => Math.abs(h - currentHour) <= 2)
      if (!isNormalTime) riskScore += 30
    }

    // Factor: Recent Failures
    let recentFailures = 0
    for (let log of history as LoginLog[]) {
      if (!log.success) recentFailures++
      else break 
    }
    if (recentFailures >= 3) riskScore += 50

    // Status
    let status = "SAFE"
    if (riskScore >= 70) status = "FRAUD"
    else if (riskScore > 30) status = "SUSPICIOUS"

    // 6. Insert Log (With Admin Privileges)
    const { error: insertError } = await supabase.from('login_logs').insert([{
      user_id,
      user_name,
      device_info,
      success: login_success,
      status,
      ip,
      risk_score: riskScore
    }])

    if (insertError){ 
      console.error("Failed to log:", insertError)
      throw new Error("Failed to save login history: " + insertError.message)
    }

    // 7. Return Response
    return new Response(
      JSON.stringify({ score: riskScore, status, ip }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    })
  }
})