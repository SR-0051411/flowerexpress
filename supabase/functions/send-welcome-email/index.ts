
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, confirmationUrl }: WelcomeEmailRequest = await req.json();

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
                  <h2 style="color: #1f2937; margin-bottom: 20px;">Hello ${name}! 🌺</h2>
                  
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
                      This email was sent to ${email}. If you didn't create an account with us, please ignore this email.
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

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
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
