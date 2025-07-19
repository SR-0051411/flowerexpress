import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OTPRequest {
  phone: string;
  type: 'verification' | 'password_reset';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, type }: OTPRequest = await req.json();

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // In production, integrate with SMS service like Twilio, AWS SNS, etc.
    // For demo purposes, we'll log the OTP
    console.log(`OTP for ${phone}: ${otp} (Type: ${type})`);

    // Store OTP in database with expiry
    // This is a simplified example - in production, you'd want to hash the OTP
    // and implement rate limiting

    const message = type === 'verification' 
      ? `Your FlowerExpress verification code is: ${otp}. Valid for 15 minutes.`
      : `Your FlowerExpress password reset code is: ${otp}. Valid for 15 minutes.`;

    // For demo purposes, return the OTP in response
    // In production, never return the OTP in response
    return new Response(JSON.stringify({ 
      success: true, 
      message: "OTP sent successfully",
      // Remove this line in production:
      demo_otp: otp 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-otp function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);