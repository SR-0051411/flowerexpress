import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy for FlowerExpress</h1>
          <p className="text-muted-foreground mb-8"><strong>Effective Date:</strong> January 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>Welcome to FlowerExpress ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our flower delivery application and services.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-3">2.1 Personal Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Account Information:</strong> Name, email address, phone number</li>
              <li><strong>Delivery Information:</strong> Address, city, pincode, delivery preferences</li>
              <li><strong>Payment Information:</strong> Payment method details (processed securely through our payment partners)</li>
              <li><strong>Order History:</strong> Past orders, preferences, and delivery details</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">2.2 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Device Information:</strong> Device type, operating system, browser type</li>
              <li><strong>Usage Data:</strong> App interactions, pages visited, features used</li>
              <li><strong>Location Data:</strong> Approximate location for delivery services (with your consent)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">2.3 Communication Data</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Customer Support:</strong> Messages, enquiries, and feedback submitted through our app</li>
              <li><strong>Marketing Communications:</strong> Preferences for promotional messages</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Process and fulfill flower delivery orders</li>
              <li>Provide customer support and respond to enquiries</li>
              <li>Send order confirmations and delivery updates</li>
              <li>Improve our services and app functionality</li>
              <li>Send promotional offers (with your consent)</li>
              <li>Prevent fraud and ensure security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Information Sharing and Disclosure</h2>
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Delivery Partners:</strong> To fulfill your flower delivery orders</li>
              <li><strong>Payment Processors:</strong> To process secure payments</li>
              <li><strong>Service Providers:</strong> Third parties who assist in app operations</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            </ul>
            <p className="font-semibold">We do not sell your personal information to third parties.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p>We implement appropriate security measures to protect your information:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Encryption of sensitive data</li>
              <li>Secure payment processing</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
              <li>Secure data storage and transmission</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights and Choices</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access your personal information</li>
              <li>Update or correct your information</li>
              <li>Delete your account and associated data</li>
              <li>Opt-out of marketing communications</li>
              <li>Request data portability</li>
              <li>Object to certain data processing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
            <p>We retain your information only as long as necessary to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide our services</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes</li>
              <li>Enforce our agreements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
            <p>Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
            <p>If you are located outside our primary service area, your information may be transferred to and processed in other countries where we operate.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Third-Party Services</h2>
            <p>Our app may contain links to third-party services. This Privacy Policy does not apply to those services. Please review their privacy policies.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Push Notifications</h2>
            <p>With your consent, we may send push notifications for:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Order updates and delivery status</li>
              <li>Special offers and promotions</li>
              <li>Important account information</li>
            </ul>
            <p>You can manage notification preferences in your device settings.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Cookies and Tracking</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Remember your preferences</li>
              <li>Analyze app usage</li>
              <li>Provide personalized experiences</li>
              <li>Improve our services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy periodically. We will notify you of significant changes through:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>In-app notifications</li>
              <li>Email notifications</li>
              <li>Updated effective date</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14. Contact Us</h2>
            <p>If you have questions about this Privacy Policy or our data practices, please contact us:</p>
            <div className="bg-muted p-4 rounded-lg my-4">
              <p className="font-semibold mb-2">FlowerExpress Support Team</p>
              <p>Email: support@flowerexpress.com</p>
              <p>Phone: +91 [Insert Phone]</p>
              <p>Address: [Insert Address]</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">15. Consent</h2>
            <p>By using FlowerExpress, you consent to the collection and use of your information as described in this Privacy Policy.</p>
          </section>

          <hr className="my-8" />

          <p className="text-sm text-muted-foreground"><strong>Last Updated:</strong> January 2025</p>
          <p className="text-sm text-muted-foreground italic">This privacy policy is designed to be transparent about our data practices while ensuring compliance with applicable privacy laws and regulations.</p>
        </article>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
