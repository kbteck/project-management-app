import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { X, Shield } from 'lucide-react';

const CookieConsent: React.FC = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleConsent = (consent: boolean) => {
    localStorage.setItem('cookieConsent', consent ? 'accepted' : 'rejected');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowConsent(false);
  };

  const openCookieSettings = () => {
    setShowConsent(true);
  };

  if (!showConsent) return null;

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
        <Card className="shadow-lg border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg">Cookie Consent</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConsent(false)}
                className="h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <CardDescription className="text-sm">
              We use cookies to enhance your browsing experience, provide personalized content, and analyze our traffic. 
              By clicking "Accept", you consent to our use of cookies.
            </CardDescription>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => handleConsent(false)}
                variant="outline"
                className="flex-1"
              >
                Do Not Consent
              </Button>
              <Button
                onClick={() => handleConsent(true)}
                className="flex-1"
              >
                Accept Cookies
              </Button>
            </div>
            
            <div className="flex justify-center">
              <Button
                variant="link"
                size="sm"
                onClick={() => setShowPolicy(true)}
                className="text-xs h-auto p-0"
              >
                View Cookie Policy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cookie Policy Modal */}
      <Dialog open={showPolicy} onOpenChange={setShowPolicy}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Cookie Policy
            </DialogTitle>
            <DialogDescription>
              Learn how ILLOX uses cookies and manages your data
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold text-base mb-2">What Are Cookies?</h3>
              <p className="text-muted-foreground">
                Cookies are small text files that are placed on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and improving our services.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">How We Use Cookies</h3>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Essential Cookies:</strong> Required for basic website functionality.</p>
                <p><strong>Preference Cookies:</strong> Remember your settings and preferences.</p>
                <p><strong>Analytics Cookies:</strong> Help us understand how visitors use our website.</p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Your Choices</h3>
              <p className="text-muted-foreground">
                You can accept or decline cookies through our consent banner. You can also change your 
                browser settings to refuse cookies, though this may limit some website functionality.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Data Protection</h3>
              <p className="text-muted-foreground">
                We are committed to protecting your privacy. Cookie data is stored locally on your device 
                and is not shared with third parties without your explicit consent.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Contact Us</h3>
              <p className="text-muted-foreground">
                If you have questions about our cookie policy, please contact us through our website.
              </p>
            </section>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowPolicy(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Export function to programmatically open cookie settings
export const openCookieSettings = () => {
  const event = new CustomEvent('openCookieSettings');
  window.dispatchEvent(event);
};

export default CookieConsent;