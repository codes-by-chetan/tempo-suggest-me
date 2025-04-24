import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Settings, Camera } from "lucide-react";
import { UserProfileData } from "@/interfaces/user.interface";
import ProfilePictureUploader from "./ProfilePictureUploader";
import UserService from "@/services/user.service";
import { useNavigate } from "react-router-dom";

// Interface for ProfileHeaderProps
interface ProfileHeaderProps {
  userData: UserProfileData | null;
  accountHolder?: boolean;
  FollowersCount?: number | 0;
  postsCount?: number | 0;
  followingCount?: number | 0;
  onEditProfile: () => void;
  onOpenSettings?: () => void;
  refreshProfile: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userData,
  FollowersCount = 0,
  postsCount = 12,
  followingCount = 24,
  onEditProfile,
  onOpenSettings,
  accountHolder = true,
  refreshProfile = () => {},
}) => {
  const [isFollowing, setIsFollowing] = useState<string | null>(null); // null, "accepted", "pending"
  const [showUploader, setShowUploader] = useState(false);
  const userService = new UserService();
  const navigate = useNavigate();

  // Check follow status if not account holder and user is logged in
  useEffect(() => {
    const checkFollowStatus = async () => {
      const token = userService.getAccessToken();
      if (!accountHolder && token && userData?.id) {
        try {
          const response = await userService.getRelation(userData.id);
          if (response.success && response.data) {
            console.log(response)
            setIsFollowing(response.data.status || null); // "accepted" or "pending"
          } else {
            setIsFollowing(null);
          }
        } catch (error) {
          console.error("Error checking follow status:", error);
          setIsFollowing(null);
        }
      }
    };
    checkFollowStatus();
  }, [accountHolder, userData?.id]);

  // Handle profile picture submission
  const handleImageSubmit = async (formData: FormData) => {
    try {
      await userService.updateUserProfilePicture(formData);
      refreshProfile();
      setShowUploader(false);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  // Handle follow/unfollow/withdraw actions
  const handleFollowToggle = async () => {
    const token = userService.getAccessToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      if (isFollowing === "accepted") {
        // Unfollow user (assuming API supports DELETE or similar)
        await userService.followUser(userData?.id!); // Assuming followUser toggles
        setIsFollowing(null);
        console.log("Unfollowed user:", userData?.fullNameString);
      } else if (isFollowing === "pending") {
        // Withdraw follow request (assuming API supports this)
        await userService.followUser(userData?.id!); // Assuming same endpoint toggles
        setIsFollowing(null);
        console.log("Withdrew follow request for:", userData?.fullNameString);
      } else {
        // Follow user
        const res = await userService.followUser(userData?.id!);
        if (res.success) {
          setIsFollowing(res.data.status || "pending");
          console.log("Followed user:", userData?.fullNameString);
        }
      }
      refreshProfile();
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        {/* Profile picture and stats */}
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          {/* Profile picture with camera icon */}
          <div className="relative flex-shrink-0">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-2 border-gray-200 rounded-full">
              {userData?.profile?.avatar ? (
                <AvatarImage
                  src={userData?.profile?.avatar?.url}
                  alt={userData?.fullNameString}
                  className="rounded-full"
                />
              ) : (
                <AvatarFallback className="text-2xl bg-gray-200">
                  {userData?.fullName.firstName.charAt(0)}
                  {userData?.fullName.lastName.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            {accountHolder && (
              <button
                onClick={() => setShowUploader(!showUploader)}
                className="absolute bottom-0 right-0 bg-primary-700 text-white rounded-full p-2 shadow-md hover:bg-primary-800"
              >
                <Camera className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Stats and buttons */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-lg sm:text-xl font-semibold">
                {userData?.fullNameString}
              </h1>
              {accountHolder ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="h-8 text-sm border-gray-300 hover:bg-gray-100"
                    onClick={onEditProfile}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onOpenSettings || onEditProfile}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant={isFollowing === "Accepted" ? "outline" : "default"}
                  className={`h-8 text-sm ${
                    isFollowing === "Accepted"
                      ? "border-gray-300 text-gray-700 hover:bg-gray-100"
                      : isFollowing === "Pending"
                      ? "border-gray-300 text-gray-700 hover:bg-gray-100"
                      : "bg-primary-700 text-white hover:bg-primary-800"
                  }`}
                  onClick={handleFollowToggle}
                >
                  {isFollowing === "Accepted"
                    ? "Unfollow"
                    : isFollowing === "Pending"
                    ? "Withdraw"
                    : "Follow"}
                </Button>
              )}
            </div>

            {/* Stats row */}
            <div className="flex gap-6 mb-3">
              <div className="text-center">
                <span className="font-semibold">{postsCount}</span>
                <span className="text-sm text-gray-600 ml-1">Posts</span>
              </div>
              <div className="text-center">
                <span className="font-semibold">{FollowersCount}</span>
                <span className="text-sm text-gray-600 ml-1">Followers</span>
              </div>
              <div className="text-center">
                <span className="font-semibold">{followingCount}</span>
                <span className="text-sm text-gray-600 ml-1">Following</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio and details */}
        <div className="mt-4">
          <p className="font-medium text-sm">{userData?.fullNameString}</p>
          <p className="text-sm text-gray-600">{userData?.profile?.bio}</p>
          <div className="flex items-center mt-2">
            <MapPin className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-sm text-gray-600">
              {userData?.profile?.location}
            </span>
          </div>
          <div className="flex items-center mt-1">
            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-sm text-gray-600">
              Joined {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Picture Uploader Dialog */}
      {showUploader && (
        <ProfilePictureUploader
          onImageSubmit={handleImageSubmit}
          
        />
      )}
    </div>
  );
};

export default ProfileHeader;