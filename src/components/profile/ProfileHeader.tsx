import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Settings } from "lucide-react";
import { UserProfileData } from "@/interfaces/user.interface";
import ProfilePictureUploader from "./ProfilePictureUploader";
import UserService from "@/services/user.service";

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
  FollowersCount,
  postsCount = 12,
  followingCount = 24,
  onEditProfile,
  onOpenSettings,
  accountHolder = true,
  refreshProfile = () => {},
}) => {
  // State to track follow status (initially false, you can set based on API data)
  const [isFollowing, setIsFollowing] = useState(false);
  const userService = new UserService();
  // Handle profile picture submission
  const handleImageSubmit = (formData: FormData) => {
    // Replace with your API call
    console.log("Submitting profile picture:", formData);
    // Example: await api.uploadProfilePicture(formData);
    refreshProfile();
  };

  // Handle follow/unfollow action
  const handleFollowToggle = async () => {
    try {
      // Replace with your API call
      if (isFollowing) {
        // Example: await api.unfollowUser(userData?.id);
        console.log("Unfollowing user:", userData?.fullNameString);
        setIsFollowing(!isFollowing);
      } else {
        // Example: await api.followUser(userData?.id);
        await userService.followUser(userData?.id).then((res) => {
          if (res.success){
            setIsFollowing(true);
          }
        });
        console.log("Following user:", userData?.fullNameString);
      }
      
      refreshProfile(); // Refresh profile to update follower count
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  return (
    <div className="py-8 border-b border-border">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
        {/* Profile picture */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          <Avatar className="h-20 w-20 md:h-36 md:w-36 border-2 border-primary-200 p-1 rounded-full">
            {userData?.profile?.avatar ? (
              <AvatarImage
                src={userData?.profile?.avatar?.url}
                alt={userData?.fullNameString}
                className="rounded-full"
              />
            ) : (
              <AvatarFallback className="text-2xl">
                {userData?.fullName.firstName.charAt(0)}{" "}
                {userData?.fullName.lastName.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
          {accountHolder && (
            <ProfilePictureUploader onImageSubmit={handleImageSubmit} />
          )}
        </div>

        {/* Profile info */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <h1 className="text-xl font-medium">{userData?.fullNameString}</h1>
            {accountHolder ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="h-9 bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100"
                  onClick={onEditProfile}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={onOpenSettings || onEditProfile}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button
                variant={isFollowing ? "outline" : "default"}
                className={`h-9 ${
                  isFollowing
                    ? "bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100"
                    : "bg-primary-700 text-white hover:bg-primary-800"
                }`}
                onClick={handleFollowToggle}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
          </div>

          {/* Stats row */}
          <div className="flex gap-8">
            <div className="text-center md:text-left">
              <span className="font-semibold">{postsCount}</span>
              <span className="text-muted-foreground ml-1">Posts</span>
            </div>
            <div className="text-center md:text-left">
              <span className="font-semibold">{FollowersCount}</span>
              <span className="text-muted-foreground ml-1">Followers</span>
            </div>
            <div className="text-center md:text-left">
              <span className="font-semibold">{followingCount}</span>
              <span className="text-muted-foreground ml-1">Following</span>
            </div>
          </div>

          {/* Bio */}
          <div>
            <p className="font-medium">{userData?.fullNameString}</p>
            <p className="text-sm">{userData?.profile?.bio}</p>
            <div className="flex items-center mt-2">
              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm">{userData?.profile?.location}</span>
            </div>
            <div className="flex items-center mt-1">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm">
                Joined {new Date(userData?.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
