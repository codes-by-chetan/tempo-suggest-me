import React, { useState, useRef } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import "react-image-crop/dist/ReactCrop.css";
import UserService from "@/services/user.service";
import { getToast } from "@/services/toasts.service";
import { useAuth } from "@/lib/auth-context";

// Props for the uploader component
interface ProfilePictureUploaderProps {
  onImageSubmit: (formData: FormData) => void;
}

const ProfilePictureUploader: React.FC<ProfilePictureUploaderProps> = ({
  onImageSubmit,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "px",
    width: 500,
    height: 500,
    x: 0,
    y: 0,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
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
      };
      reader.readAsDataURL(file);
    }
  };

  // Get cropped image
  const getCroppedImg = (
    image: HTMLImageElement,
    crop: PixelCrop
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
        crop.height
      );
    }

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, "image/jpeg");
    });
  };

  // Handle submit
  const handleSubmit = async () => {
    if (imgRef.current && completedCrop) {
      const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
      const formData = new FormData();
      formData.append("avatar", croppedBlob, "profile-picture.jpg");
      
      await userService.updateUserProfilePicture(formData).then((res) => {
        if (res.success) {
          setIsOpen(false);
          setImageSrc(null);
          setCompletedCrop(null);
          authProvider.refreshAuthState();
          onImageSubmit(formData);
        } else {
          getToast("error", res.message);
        }
      });
    }
  };

  // Handle image load
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    imgRef.current = e.currentTarget;
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        className="h-9 bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100"
        onClick={() => fileInputRef.current?.click()}
      >
        Change Profile Picture
      </Button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[90vw] max-w-[600px] h-[80vh] max-h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Crop Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-4">
            {imageSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, pixelCrop) => setCrop(pixelCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
                minWidth={500}
                minHeight={500}
              >
                <img
                  src={imageSrc}
                  onLoad={onImageLoad}
                  alt="Crop preview"
                  className="max-w-full max-h-[400px] object-contain"
                />
              </ReactCrop>
            )}
          </div>
          <div className="flex justify-end gap-2 p-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                setImageSrc(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!completedCrop}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePictureUploader;
