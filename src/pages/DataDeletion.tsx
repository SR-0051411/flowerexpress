import { ArrowLeft, Trash2, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DataDeletion = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="shadow-lg">
          <CardHeader className="text-center border-b">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-3xl font-bold">Account & Data Deletion Request</CardTitle>
            <CardDescription className="text-lg">
              Request to delete your account and associated data
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 py-8">
            <section>
              <h2 className="text-xl font-semibold mb-3">How to Request Data Deletion</h2>
              <p className="text-muted-foreground mb-4">
                If you would like to delete your account and all associated data from FlowerExpress, please contact us using one of the methods below:
              </p>
              
              <div className="space-y-4">
                <Card className="bg-secondary/50">
                  <CardContent className="flex items-center gap-4 p-4">
                    <Mail className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-medium">Email Us</p>
                      <a href="mailto:support@flowerexpress.com" className="text-primary hover:underline">
                        support@flowerexpress.com
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-secondary/50">
                  <CardContent className="flex items-center gap-4 p-4">
                    <Phone className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-medium">Call Us</p>
                      <a href="tel:+1234567890" className="text-primary hover:underline">
                        +1 (234) 567-890
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">What Information to Include</h2>
              <p className="text-muted-foreground mb-2">
                When submitting your deletion request, please include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Your registered email address</li>
                <li>Your registered phone number</li>
                <li>Subject line: "Account Deletion Request"</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">What Data Will Be Deleted</h2>
              <p className="text-muted-foreground mb-2">
                Upon request, we will permanently delete:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Your account information (name, email, phone number)</li>
                <li>Your delivery addresses</li>
                <li>Your order history</li>
                <li>Any other personal data associated with your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Processing Time</h2>
              <p className="text-muted-foreground">
                We will process your deletion request within <strong>30 days</strong> of receiving it. 
                You will receive a confirmation email once your data has been successfully deleted.
              </p>
            </section>

            <section className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                ⚠️ Important Notice
              </h3>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Deleting your account is permanent and cannot be undone. All your data, order history, 
                and account information will be permanently removed from our systems.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataDeletion;
