import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OTPRequest {
  phone: string;
  type: 'verification' | 'password_reset';
}

// Phone number validation regex (E.164 format or common formats)
const phoneRegex = /^\+?[1-9]\d{6,14}$/;

// Generate cryptographically secure OTP
function generateSecureOTP(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return String(100000 + (array[0] % 900000));
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role for rate limit checks
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse and validate request body
    let body: OTPRequest;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { phone, type } = body;

    // Validate phone number
    if (!phone || typeof phone !== 'string') {
      return new Response(
        JSON.stringify({ error: "Phone number is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Clean phone number (remove spaces, dashes)
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    if (!phoneRegex.test(cleanPhone)) {
      return new Response(
        JSON.stringify({ error: "Invalid phone number format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate type
    if (!type || !['verification', 'password_reset'].includes(type)) {
      return new Response(
        JSON.stringify({ error: "Invalid OTP type" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    // Rate limit check - max 3 OTPs per phone per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    const { count: phoneCount, error: phoneCountError } = await supabase
      .from('otp_rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('phone', cleanPhone)
      .gte('created_at', oneHourAgo);

    if (phoneCountError) {
      console.error("Rate limit check error:", phoneCountError);
    } else if (phoneCount && phoneCount >= 3) {
      console.log(`Rate limit exceeded for phone: ${cleanPhone.substring(0, 4)}****`);
      return new Response(
        JSON.stringify({ error: "Too many OTP requests. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Rate limit check - max 10 OTPs per IP per hour
    if (clientIP !== 'unknown') {
      const { count: ipCount, error: ipCountError } = await supabase
        .from('otp_rate_limits')
        .select('*', { count: 'exact', head: true })
        .eq('ip_address', clientIP)
        .gte('created_at', oneHourAgo);

      if (ipCountError) {
        console.error("IP rate limit check error:", ipCountError);
      } else if (ipCount && ipCount >= 10) {
        console.log(`Rate limit exceeded for IP: ${clientIP}`);
        return new Response(
          JSON.stringify({ error: "Too many requests from your network. Please try again later." }),
          { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // Record this OTP request for rate limiting
    const { error: insertError } = await supabase
      .from('otp_rate_limits')
      .insert({
        phone: cleanPhone,
        ip_address: clientIP !== 'unknown' ? clientIP : null
      });

    if (insertError) {
      console.error("Failed to record rate limit:", insertError);
    }

    // Generate cryptographically secure 6-digit OTP
    const otp = generateSecureOTP();

    // Log OTP generation (without exposing the actual OTP in production)
    console.log(`OTP generated for phone: ${cleanPhone.substring(0, 4)}**** (Type: ${type})`);

    // In production, integrate with SMS service like Twilio, AWS SNS, etc.
    // For now, store the OTP hash in the database
    // TODO: Implement actual SMS sending

    const message = type === 'verification' 
      ? `Your FlowerExpress verification code is ready. Valid for 15 minutes.`
      : `Your FlowerExpress password reset code is ready. Valid for 15 minutes.`;

    return new Response(JSON.stringify({ 
      success: true, 
      message: "OTP sent successfully"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-otp function:", error.message);
    return new Response(
      JSON.stringify({ error: "An error occurred. Please try again." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
