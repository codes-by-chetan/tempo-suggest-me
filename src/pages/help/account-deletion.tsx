import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppName from "@/components/tags/AppName";
import { CircleAlert } from "lucide-react";

const DeleteAccount: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-3xl border-none">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
            <CircleAlert color="red" size={28}/>
            <span>Delete Your Account</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Last updated: August 5, 2025
          </p>
        </CardHeader>
        <CardContent className="space-y-6 text-left">
          {/* Section 1: Important Notice */}
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Important Notice</h2>
            <p className="text-muted-foreground">
              Deleting your  account is a permanent action. Once deleted:
              <ul className="list-disc pl-5 mt-2">
                <li>Your account and personal data will be removed from our systems.</li>
                <li>You will lose access to any suggestions, saved items, and history linked to your account.</li>
                <li>This action is irreversible.</li>
              </ul>
            </p>
          </div>

          {/* Section 2: How to Request Account Deletion */}
          <div>
            <h2 className="text-xl font-semibold mb-2">2. How to Request Account Deletion</h2>
            <p className="text-muted-foreground">
              To delete your account, please follow these steps:
            </p>
            <ol className="list-decimal pl-5 mt-2 text-muted-foreground">
              <li>
                Send an email to <a href="mailto:support@suggest.me" className="text-primary hover:underline">support@suggest.me</a>.
              </li>
              <li>
                Use the **subject line**: <strong>“Account Deletion Request - [Your Registered Email]”</strong>.
              </li>
              <li>
                In the body of the email, mention:
                <ul className="list-disc pl-5 mt-2">
                  <li>Your full name (as registered).</li>
                  <li>Your registered email ID.</li>
                  <li>A statement confirming you want your account to be permanently deleted.</li>
                </ul>
              </li>
              <li>
                Example email format:
                <div className="bg-muted rounded p-3 text-sm mt-2">
                  Subject: Account Deletion Request - john.doe@example.com <br />
                  <br />
                  Body: <br />
                  Hello Support Team,<br />
                  <br />
                  I am [Your Name], and my registered email is [Your Email].<br />
                  I would like to permanently delete my account from suggest.me and remove all associated data.<br />
                  <br />
                  Thank you.<br />
                </div>
              </li>
              <li>
                Our team will process your request within **5-7 business days** and notify you upon completion.
              </li>
            </ol>
          </div>

          {/* Section 3: Frequently Asked Questions */}
          <div>
            <h2 className="text-xl font-semibold mb-2">3. Frequently Asked Questions (FAQ)</h2>
            <ul className="space-y-4 text-muted-foreground">
              <li>
                <strong>Q: Can I recover my account after deletion?</strong><br />
                A: No. Once deleted, your account and data cannot be recovered.
              </li>
              <li>
                <strong>Q: Will my social login (Google/Facebook) be affected?</strong><br />
                A: Deleting your account from suggest.me will not impact your Google or Facebook accounts.
              </li>
              <li>
                <strong>Q: Can I temporarily deactivate instead?</strong><br />
                A: Currently, we only support permanent account deletion. Account deactivation is not available.
              </li>
            </ul>
          </div>

          {/* Section 4: Contact Support */}
          <div>
            <h2 className="text-xl font-semibold mb-2">4. Need Help?</h2>
            <p className="text-muted-foreground">
              If you face any issues or have questions regarding account deletion, contact us at <a href="mailto:support@suggest.me" className="text-primary hover:underline">support@suggest.me</a>. Our support team is ready to assist you.
            </p>
          </div>

          {/* Back to Profile / Settings */}
          <div className="flex justify-center mt-6 space-x-4">
            <Button asChild variant="outline">
              <Link to="/profile">Back to Profile</Link>
            </Button>
            <Button asChild variant="default">
              <a href="mailto:support@suggest.me">Email Support</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeleteAccount;
