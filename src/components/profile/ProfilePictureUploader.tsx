import React, { useState, useRef } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Camera, Upload, Check, X } from "lucide-react";
import "react-image-crop/dist/ReactCrop.css";
import UserService from "@/services/user.service";
import { getToast } from "@/services/toasts.service";
import { useAuth } from "@/lib/auth-context";

// Props for the uploader component
interface ProfilePictureUploaderProps {
  onImageSubmit: (formData: FormData) => void;
  currentAvatar?: string;
}

// ImageCropper component for handling the cropping functionality
const ImageCropper = ({
  imageSrc,
  onCropComplete,
  onCancel,
}: {
  imageSrc: string;
  onCropComplete: (blob: Blob) => void;
  onCancel: () => void;
}) => {
  const [crop, setCrop] = useState<Crop>({
    unit: "px",
    width: 500,
    height: 500,
    x: 0,
    y: 0,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Get cropped image
  const getCroppedImg = (
    image: HTMLImageElement,
    crop: PixelCrop,
  ): Promise<Blob> => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height,
      );
    }

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, "image/jpeg");
    });
  };

  // Handle image load
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    imgRef.current = e.currentTarget;
  };

  // Handle crop completion
  const handleCropComplete = async () => {
    if (imgRef.current && completedCrop) {
      const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
      onCropComplete(croppedBlob);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex-1 overflow-y-auto p-4">
        <ReactCrop
          crop={crop}
          onChange={(_, pixelCrop) => setCrop(pixelCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={1}
          circularCrop
          minWidth={250}
          minHeight={250}
        >
          <img
            src={imageSrc}
            onLoad={onImageLoad}
            alt="Crop preview"
            className="max-w-full max-h-[400px] object-contain"
          />
        </ReactCrop>
      </div>
      <DialogFooter className="flex justify-between gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" /> Cancel
        </Button>
        <Button onClick={handleCropComplete} disabled={!completedCrop}>
          <Check className="h-4 w-4 mr-2" /> Apply
        </Button>
      </DialogFooter>
    </div>
  );
};

const ProfilePictureUploader: React.FC<ProfilePictureUploaderProps> = ({
  onImageSubmit,
  currentAvatar,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [step, setStep] = useState<"upload" | "crop" | "preview">("upload");
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const userService = new UserService();
  const authProvider = useAuth();

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setIsOpen(true);
        setStep("crop");
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle crop completion
  const handleCropComplete = (blob: Blob) => {
    const imageUrl = URL.createObjectURL(blob);
    setCroppedImage(imageUrl);
    setStep("preview");
  };

  // Handle submit
  const handleSubmit = async () => {
    if (croppedImage) {
      // Convert data URL to blob
      const response = await fetch(croppedImage);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("avatar", blob, "profile-picture.jpg");

      await userService.updateUserProfilePicture(formData).then((res) => {
        if (res.success) {
          setIsOpen(false);
          setImageSrc(null);
          setCroppedImage(null);
          setStep("upload");
          authProvider.refreshAuthState();
          onImageSubmit(formData);
          getToast("success", "Profile picture updated successfully!");
        } else {
          getToast("error", res.message);
        }
      });
    }
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setIsOpen(false);
    setImageSrc(null);
    setCroppedImage(null);
    setStep("upload");
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative group">
        {currentAvatar && (
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary mx-auto">
            <img
              src={currentAvatar}
              alt="Current profile picture"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>

      <Button
        variant="outline"
        className="mt-2 h-9 bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-4 w-4 mr-2" /> Change Profile Picture
      </Button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
      />

      <Dialog open={isOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="w-[90vw] max-w-[600px] h-[80vh] max-h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {step === "crop" && "Crop Profile Picture"}
              {step === "preview" && "Preview Profile Picture"}
            </DialogTitle>
          </DialogHeader>

          {step === "crop" && imageSrc && (
            <ImageCropper
              imageSrc={imageSrc}
              onCropComplete={handleCropComplete}
              onCancel={handleDialogClose}
            />
          )}

          {step === "preview" && croppedImage && (
            <div className="flex flex-col items-center gap-4 p-4">
              <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-primary">
                <img
                  src={croppedImage}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-center text-muted-foreground">
                Your new profile picture
              </p>
              <DialogFooter className="flex justify-between w-full gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep("crop")}>
                  <X className="h-4 w-4 mr-2" /> Try Again
                </Button>
                <Button onClick={handleSubmit}>
                  <Check className="h-4 w-4 mr-2" /> Save
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePictureUploader;
