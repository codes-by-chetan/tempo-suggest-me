import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HiOutlineDocumentText } from "react-icons/hi2";

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-3xl border-none">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
            <HiOutlineDocumentText />

            <span>Terms of Service</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Effective Date: August 5, 2025
          </p>
        </CardHeader>
        <CardContent className="space-y-6 text-left">
          {/* Section 1: Acceptance */}
          <div>
            <h2 className="text-xl font-semibold mb-2">
              1. Acceptance of Terms
            </h2>
            <p className="text-muted-foreground">
              By accessing or using Suggest.me, you agree to comply with these
              Terms of Service and our Privacy Policy. If you do not agree,
              please do not use the service.
            </p>
          </div>

          {/* Section 2: Eligibility */}
          <div>
            <h2 className="text-xl font-semibold mb-2">2. Eligibility</h2>
            <p className="text-muted-foreground">
              You must be at least 13 years old to use Suggest.me. By using our
              service, you represent that you meet this requirement.
            </p>
          </div>

          {/* Section 3: User Accounts */}
          <div>
            <h2 className="text-xl font-semibold mb-2">3. User Accounts</h2>
            <p className="text-muted-foreground">
              You are responsible for maintaining the confidentiality of your
              account credentials. All activities under your account are your
              responsibility.
            </p>
          </div>

          {/* Section 4: Acceptable Use */}
          <div>
            <h2 className="text-xl font-semibold mb-2">4. Acceptable Use</h2>
            <p className="text-muted-foreground">
              You agree not to misuse Suggest.me by:
              <ul className="list-disc pl-5 mt-2">
                <li>Engaging in unlawful or harmful activities.</li>
                <li>Spamming, hacking, or distributing malware.</li>
                <li>
                  Scraping, copying, or reproducing content without permission.
                </li>
              </ul>
            </p>
          </div>

          {/* Section 5: Intellectual Property */}
          <div>
            <h2 className="text-xl font-semibold mb-2">
              5. Intellectual Property
            </h2>
            <p className="text-muted-foreground">
              All content, trademarks, and technology on Suggest.me are owned by
              us or our licensors. You may not use them without our prior
              written consent.
            </p>
          </div>

          {/* Section 6: Termination */}
          <div>
            <h2 className="text-xl font-semibold mb-2">6. Termination</h2>
            <p className="text-muted-foreground">
              We reserve the right to suspend or terminate your access to
              Suggest.me if you violate these Terms or engage in harmful
              behavior.
            </p>
          </div>

          {/* Section 7: Disclaimer of Warranties */}
          <div>
            <h2 className="text-xl font-semibold mb-2">
              7. Disclaimer of Warranties
            </h2>
            <p className="text-muted-foreground">
              Suggest.me is provided "as is" without warranties of any kind. We
              do not guarantee uninterrupted or error-free service.
            </p>
          </div>

          {/* Section 8: Limitation of Liability */}
          <div>
            <h2 className="text-xl font-semibold mb-2">
              8. Limitation of Liability
            </h2>
            <p className="text-muted-foreground">
              We shall not be liable for any indirect, incidental, or
              consequential damages arising from your use of Suggest.me.
            </p>
          </div>

          {/* Section 9: Changes to Terms */}
          <div>
            <h2 className="text-xl font-semibold mb-2">9. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We may update these Terms occasionally. Continued use of
              Suggest.me after changes means you accept the new Terms.
            </p>
          </div>

          {/* Section 10: Contact */}
          <div>
            <h2 className="text-xl font-semibold mb-2">10. Contact Us</h2>
            <p className="text-muted-foreground">
              For any queries, contact us at{" "}
              <a
                href="mailto:support@suggest.me"
                className="text-primary hover:underline"
              >
                support@suggest.me
              </a>
              .
            </p>
          </div>

          {/* Back to Home */}
          <div className="flex justify-center mt-6">
            <Button asChild variant="outline">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsOfService;
