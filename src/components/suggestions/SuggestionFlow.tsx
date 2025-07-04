"use client";

import React, { useEffect, useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ContentTypeSelector from "./ContentTypeSelector";
import ContentSearch from "./ContentSearch";
import ContentPreview from "./ContentPreview";
import RecipientSelector, { type Recipient } from "./RecipientSelector";
import { set } from "date-fns";
import { useAuth } from "@/lib/auth-context";
import { AuthTab } from "../layout/AuthTab";

interface ContentItem {
  id: string;
  title: string;
  type: string;
  imageUrl?: string;
  year?: string;
  creator?: string;
  description?: string;
  [key: string]: any;
}

interface SuggestionFlowProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onComplete?: (data: {
    content: ContentItem;
    recipients: Recipient[];
    note?: string;
  }) => void;
  preSelectedContent?: ContentItem;
  startFromRecipientSelection?: boolean;
}

const SuggestionFlow = ({
  open = true,
  onOpenChange = () => {},
  onComplete = () => {},
  preSelectedContent,
  startFromRecipientSelection = false,
}: SuggestionFlowProps) => {
  const [step, setStep] = useState(startFromRecipientSelection ? 4 : 1);
  const [contentType, setContentType] = useState(
    preSelectedContent?.type || ""
  );
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(
    preSelectedContent || null
  );
  const [contentDetails, setContentDetails] = useState<any>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [note, setNote] = useState("");
  const { isAuthenticated } = useAuth();
  const handleContentTypeSelect = (type: string) => {
    setContentType(type);
    setSelectedContent(null); // Reset selected content when changing type
    setStep(2);
  };
  const onCloseHandler = (success: boolean) => {};

  useEffect(() => {
    if (preSelectedContent) {
      setSelectedContent(preSelectedContent);
      setContentType(preSelectedContent.type);
      if (startFromRecipientSelection) {
        setStep(4);
      }
    }
  }, [preSelectedContent, startFromRecipientSelection]);

  const handleContentSelect = (content: ContentItem) => {
    setSelectedContent(content);
    // Don't automatically advance to next step
    setStep(3);
  };

  const handleContentPreviewNext = () => {
    setStep(4);
  };

  const handleRecipientsSelect = (selectedRecipients: Recipient[]) => {
    setRecipients(selectedRecipients);
  };

  const handleComplete = () => {
    onComplete({
      content: selectedContent as ContentItem,
      recipients,
      note,
    });
    resetFlow();
    onOpenChange(false);
  };

  const resetFlow = () => {
    setStep(1);
    setContentType("");
    setSelectedContent(null);
    setContentDetails(null);
    setRecipients([]);
    setNote("");
  };

  const handleBack = () => {
    if (startFromRecipientSelection && step === 4) {
      // If we started from recipient selection, close the dialog instead of going back
      onOpenChange(false)
      return
    }
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "What would you like to suggest?";
      case 2:
        return `Search for ${contentType}`;
      case 3:
        return "Add details";
      case 4:
        return "Select recipients";
      case 5:
        return "Confirmation";
      default:
        return "Make a suggestion";
    }
  };

  const renderStepIndicator = () => {
    if (startFromRecipientSelection) {
      // Don't show step indicator when starting from recipient selection
      return null
    }
    return (
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <React.Fragment key={i}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${
                  step === i
                    ? "bg-primary text-primary-foreground"
                    : step > i
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
                onClick={() => i < step && setStep(i)}
                title={i < step ? `Go back to step ${i}` : ""}
              >
                {step > i ? <Check className="h-4 w-4" /> : i}
              </div>
              {i < 4 && (
                <div
                  className={`w-10 h-1 ${
                    step > i ? "bg-primary/20" : "bg-muted"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <ContentTypeSelector
            onSelect={handleContentTypeSelect}
            selectedType={contentType}
          />
        );
      case 2:
        return (
          <ContentSearch
            contentType={contentType}
            onSelect={handleContentSelect}
          />
        );
      case 3:
        return (
          <ContentPreview
            content={selectedContent as ContentItem}
            contentType={contentType}
            onBack={handleBack}
            onNext={handleContentPreviewNext}
            hideButtons={true} // Add this prop
          />
        );
      case 4:
        return (
          <RecipientSelector
            onSelect={handleRecipientsSelect}
            onBack={handleBack}
            onComplete={handleComplete}
            preSelectedRecipients={recipients}
            hideButtons={true} // Keep this to hide the internal buttons
          />
        );
      default:
        return null;
    }
  };

  const renderConfirmation = () => {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-green-600 dark:text-green-300" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-foreground">
          Suggestion Sent!
        </h3>
        <p className="text-muted-foreground mb-6">
          Your suggestion has been sent to {recipients.length}{" "}
          {recipients.length === 1 ? "person" : "people"}.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => setStep(1)}>
            New Suggestion
          </Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {isAuthenticated ? (
        <DialogContent
          aria-describedby={"new-suggestion-dialogue-box-content"}
          aria-description={"new-suggestion-dialogue-box-content"}
          className="sm:max-w-[600px] md:max-w-[800px] p-0 overflow-auto max-h-[90vh] bg-background border-border"
        >
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl font-bold text-center text-foreground">
              {getStepTitle()}
            </DialogTitle>
          </DialogHeader>

          {renderStepIndicator()}

          <div className="px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {step === 5 ? renderConfirmation() : renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {step > 1 && step < 5 && (
            <DialogFooter className="p-6 pt-0 flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
              {step < 4 && (
                <Button
                  onClick={() => setStep(step + 1)}
                  className="flex items-center gap-1"
                  disabled={step === 2 && !selectedContent}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              )}
              {step === 4 && (
                <Button
                  onClick={handleComplete}
                  disabled={recipients.length === 0}
                  className="flex items-center gap-1"
                >
                  {recipients.length === 0
                    ? "Select Recipients"
                    : `Send to ${recipients.length} ${
                        recipients.length === 1 ? "person" : "people"
                      }`}
                </Button>
              )}
            </DialogFooter>
          )}

          {step === 1 && (
            <DialogFooter className="p-6 pt-0 flex justify-end">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      ) : (
        <>
          <DialogTitle></DialogTitle>
          <DialogContent className="sm:max-w-md p-0 gap-0 max-h-[95vh] overflow-hidden [&>button]:hidden">
            <AuthTab
              onClose={onCloseHandler}
              defaultTab={"login"}
              isOpen={open}
            />
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

export default SuggestionFlow;
