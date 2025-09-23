import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const Footer: React.FC = () => {
  const [showPrivacy, setShowPrivacy] = useState(false);

  const openCookieSettings = () => {
    // Clear cookie consent to show the popup again
    localStorage.removeItem('cookieConsent');
    window.location.reload();
  };

  return (
    <>
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>© 2025 ILLOX. Built with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>by Kelvin Benson</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowPrivacy(true)}
                className="hover:text-foreground transition-colors underline"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button
                onClick={openCookieSettings}
                className="hover:text-foreground transition-colors underline"
              >
                Cookie Settings
              </button>
            </div>
            
            <div className="text-xs text-muted-foreground/80">
              Privacy-First Design • No Data Collection • GDPR Compliant
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
            <DialogDescription>
              How ILLOX protects and handles your data
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold text-base mb-2">Information We Collect</h3>
              <p className="text-muted-foreground">
                ILLOX is designed to work entirely in your browser. We do not collect, store, or transmit 
                any of your personal project data to external servers. All your work remains on your device.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Local Storage</h3>
              <p className="text-muted-foreground">
                Our tools use your browser's local storage to save your work between sessions. This data 
                never leaves your device and can be cleared at any time through your browser settings.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Cookies</h3>
              <p className="text-muted-foreground">
                We use minimal cookies only for essential functionality like remembering your preferences 
                and consent choices. No tracking or advertising cookies are used.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Third-Party Services</h3>
              <p className="text-muted-foreground">
                ILLOX does not integrate with third-party analytics, advertising, or tracking services. 
                Your privacy is our priority.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Data Security</h3>
              <p className="text-muted-foreground">
                Since all data remains on your device, you maintain full control over your information. 
                We recommend regular browser data backups if you want to preserve your work long-term.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Contact</h3>
              <p className="text-muted-foreground">
                If you have questions about this privacy policy, please contact us through our website.
              </p>
            </section>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={() => setShowPrivacy(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Footer;