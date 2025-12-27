import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  name: string;
  confirmationUrl: string;
}

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Sanitize string for HTML to prevent XSS
function sanitizeHtml(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Validate URL format and ensure it's from trusted domain
function isValidConfirmationUrl(url: string, supabaseUrl: string): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsedUrl = new URL(url);
    const supabaseDomain = new URL(supabaseUrl);
    // Only allow URLs from Supabase domain or localhost for development
    return parsedUrl.hostname === supabaseDomain.hostname || 
           parsedUrl.hostname === 'localhost' ||
           parsedUrl.hostname.endsWith('.supabase.co');
  } catch {
    return false;
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client to verify authentication
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Verify authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("Unauthorized request: missing or invalid auth header");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.log("Invalid token:", authError?.message);
      return new Response(
        JSON.stringify({ error: "Invalid authentication token" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Parse request body
    let body: WelcomeEmailRequest;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { email, name, confirmationUrl } = body;

    // Validate email format
    if (!email || !emailRegex.test(email)) {
      console.log("Invalid email format:", email?.substring(0, 5) + '***');
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate email length
    if (email.length > 254) {
      return new Response(
        JSON.stringify({ error: "Email address too long" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate and sanitize name
    if (!name || typeof name !== 'string') {
      return new Response(
        JSON.stringify({ error: "Name is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Limit name length
    if (name.length > 100) {
      return new Response(
        JSON.stringify({ error: "Name too long" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate confirmationUrl
    if (!confirmationUrl || !isValidConfirmationUrl(confirmationUrl, supabaseUrl)) {
      console.log("Invalid confirmation URL provided");
      return new Response(
        JSON.stringify({ error: "Invalid confirmation URL" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Sanitize name for HTML output
    const sanitizedName = sanitizeHtml(name);
    const sanitizedEmail = sanitizeHtml(email);

    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to FlowerExpress</title>
          <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #fdf2f8; }
              .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); padding: 40px 20px; text-align: center; color: white; }
              .logo { width: 60px; height: 60px; background-color: rgba(255,255,255,0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; font-size: 24px; }
              .content { padding: 40px 30px; }
              .button { display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
              .footer { background-color: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
              .flower-icon { font-size: 24px; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <div class="logo">
                      <span class="flower-icon">🌸</span>
                  </div>
                  <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Welcome to FlowerExpress!</h1>
                  <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Fresh flowers delivered to your door</p>
              </div>
              
              <div class="content">
                  <h2 style="color: #1f2937; margin-bottom: 20px;">Hello ${sanitizedName}! 🌺</h2>
                  
                  <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                      Thank you for joining FlowerExpress! We're thrilled to have you as part of our community of flower lovers.
                  </p>
                  
                  <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
                      To complete your registration and start exploring our beautiful collection of fresh flowers, please verify your email address by clicking the button below:
                  </p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                      <a href="${confirmationUrl}" class="button">Verify My Email Address</a>
                  </div>
                  
                  <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 30px;">
                      If the button doesn't work, you can copy and paste this link into your browser:<br>
                      <a href="${confirmationUrl}" style="color: #ec4899; word-break: break-all;">${confirmationUrl}</a>
                  </p>
                  
                  <div style="background-color: #fef7ff; border: 1px solid #f3e8ff; border-radius: 8px; padding: 20px; margin: 30px 0;">
                      <h3 style="color: #7c3aed; margin: 0 0 10px 0; font-size: 16px;">What's Next?</h3>
                      <ul style="color: #6b7280; margin: 0; padding-left: 20px;">
                          <li>Browse our fresh flower collections</li>
                          <li>Create your personalized wishlist</li>
                          <li>Enjoy free delivery on orders over $50</li>
                          <li>Get exclusive member discounts</li>
                      </ul>
                  </div>
              </div>
              
              <div class="footer">
                  <p style="margin: 0 0 15px 0; font-weight: 600; color: #1f2937;">FlowerExpress</p>
                  <p style="margin: 0 0 15px 0;">Making every moment beautiful with fresh flowers</p>
                  <p style="margin: 0; font-size: 12px;">
                      This email was sent to ${sanitizedEmail}. If you didn't create an account with us, please ignore this email.
                  </p>
                  <p style="margin: 15px 0 0 0; font-size: 12px;">
                      Need help? Contact us at <a href="mailto:support@flowerexpress.com" style="color: #ec4899;">support@flowerexpress.com</a>
                  </p>
              </div>
          </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "FlowerExpress <welcome@flowerexpress.com>",
      to: [email],
      subject: "🌸 Welcome to FlowerExpress - Verify Your Email",
      html: emailHtml,
      replyTo: "support@flowerexpress.com",
    });

    console.log("Welcome email sent successfully to:", email.substring(0, 3) + '***');

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error.message);
    return new Response(
      JSON.stringify({ error: "Failed to send email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
