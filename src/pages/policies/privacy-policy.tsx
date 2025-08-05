import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoShieldLock } from "react-icons/go";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-3xl border-none">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
             <GoShieldLock/><span>Privacy Policy</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Last updated: August 5, 2025
          </p>
        </CardHeader>
        <CardContent className="space-y-6 text-left">
          {/* Introduction */}
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
            <p className="text-muted-foreground">
              Suggest.me values your privacy. This Privacy Policy describes how we collect, use, and protect your personal information when you access or use our services.
            </p>
          </div>

          {/* Data Collection */}
          <div>
            <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
            <p className="text-muted-foreground">
              We collect the following types of data:
              <ul className="list-disc pl-5 mt-2">
                <li><strong>Account Information</strong>: Email, name, and contact number when you sign up or log in.</li>
                <li><strong>Social Login Data</strong>: Data from Google or Facebook, including email, name, and profile ID.</li>
                <li><strong>Usage Data</strong>: Your interactions with Suggest.me such as pages visited and features used.</li>
                <li><strong>Device Information</strong>: IP address, browser details, and device type for analytics and security.</li>
              </ul>
            </p>
          </div>

          {/* Use of Data */}
          <div>
            <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
            <p className="text-muted-foreground">
              Your data is used to:
              <ul className="list-disc pl-5 mt-2">
                <li>Provide and enhance Suggest.me services.</li>
                <li>Authenticate your account through email or social logins.</li>
                <li>Communicate important updates or notifications.</li>
                <li>Analyze usage patterns for improvements.</li>
              </ul>
            </p>
          </div>

          {/* Data Sharing */}
          <div>
            <h2 className="text-xl font-semibold mb-2">4. Data Sharing</h2>
            <p className="text-muted-foreground">
              We do not sell your personal information. However, we may share data with:
              <ul className="list-disc pl-5 mt-2">
                <li>Service providers (e.g., Google, Meta) for authentication purposes.</li>
                <li>Law enforcement or regulatory authorities if required by law.</li>
              </ul>
            </p>
          </div>

          {/* User Rights */}
          <div>
            <h2 className="text-xl font-semibold mb-2">5. Your Rights</h2>
            <p className="text-muted-foreground">
              You have the right to:
              <ul className="list-disc pl-5 mt-2">
                <li>Access or update your personal data via your <Link to="/profile" className="text-primary hover:underline">profile</Link>.</li>
                <li>Request account deletion by contacting <a href="mailto:support@suggest.me" className="text-primary hover:underline">support@suggest.me</a>.</li>
                <li>Opt-out of receiving non-essential communications.</li>
              </ul>
            </p>
          </div>

          {/* Data Security */}
          <div>
            <h2 className="text-xl font-semibold mb-2">6. Data Security</h2>
            <p className="text-muted-foreground">
              We implement industry-standard security measures to protect your data. However, no online service is completely secure; users are responsible for maintaining the security of their own accounts.
            </p>
          </div>

          {/* Policy Updates */}
          <div>
            <h2 className="text-xl font-semibold mb-2">7. Changes to this Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy periodically. Significant changes will be notified via email or in-app notifications.
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-semibold mb-2">8. Contact Us</h2>
            <p className="text-muted-foreground">
              For any questions or concerns regarding this policy, contact us at <a href="mailto:support@suggest.me" className="text-primary hover:underline">support@suggest.me</a>.
            </p>
          </div>

          {/* Back to Login/Signup */}
          <div className="flex justify-center mt-6">
            <Button asChild variant="outline">
              <Link to="/login">Back to Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
