import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  Settings,
  Camera,
  CheckCircle2,
  VerifiedIcon,
} from "lucide-react";
import { UserProfileData } from "@/interfaces/user.interface";
import ProfilePictureUploader from "./ProfilePictureUploader";
import UserService from "@/services/user.service";
import { useNavigate } from "react-router-dom";
import VerifiedBadgeIcon from "./VerifiedBadgeIcon";
import { useSocket } from "@/lib/socket-context";
import { any } from "zod";
import { log } from "console";

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
  const [isUploading, setIsUploading] = useState(false);

  const [followsYou, setFollowsYou] = useState<{ [key: string]: any } | null>(
    null
  );
  const userService = new UserService();
  const navigate = useNavigate();
  const { socket } = useSocket();
  socket.on("followAccepted", (data: any) => {
    console.log("Follow request accepted :", data);
    if (data.following === userData.id) {
      setIsFollowing("Accepted");
      followingCount += 1;
    }
  });
  socket.on("followedYou", (data: any) => {
    console.log("Followed You :", data);
    if (data.follower === userData.id) {
      setFollowsYou(data);
      FollowersCount += 1;
    }
  });
  socket.on("unFollowedYou", (data: any) => {
    console.log("UnFollowed You :", data);
    if (data.follower === userData.id) {
      setFollowsYou(null);
      FollowersCount -= 1;
    }
  });
  const handleAccept = () => {
    console.log(`Accept follow request for ${userData._id}`);
    // TODO: Add API call for accept
    userService.acceptFollowRequest(followsYou._id).then((res) => {
      if (res.success) {
        setFollowsYou(res.data);
      }
    });
  };
  // Check follow status if not account holder and user is logged in
  useEffect(() => {
    const checkFollowStatus = async () => {
      const token = userService.getAccessToken();
      if (!accountHolder && token && userData?.id) {
        try {
          const response = await userService.getRelation(userData.id);
          if (response.success && response.data) {
            console.log(response);
            setIsFollowing(response.data.status || null); // "accepted" or "pending"
          } else {
            setIsFollowing(null);
          }
        } catch (error) {
          console.error("Error checking follow status:", error);
          setIsFollowing(null);
        }
        await userService.getFollowsYou(userData.id).then((res) => {
          if (res.success) {
            setFollowsYou(res.data);
            console.log(res.data);
          }
        });
      }
    };
    checkFollowStatus();
  }, [accountHolder, userData?.id]);
  console.log(userData);
  // Handle profile picture submission
  const handleImageSubmit = async (formData: FormData) => {
    setIsUploading(true);

    try {
      await userService.updateUserProfilePicture(formData);
      refreshProfile();
      setShowUploader(false);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    } finally {
      setIsUploading(false);
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
      if (isFollowing === "Accepted") {
        // Unfollow user (assuming API supports DELETE or similar)
        await userService.unFollowUser(userData?.id!).then((res) => {
          if (res.success) {
            setIsFollowing(null);
            console.log("Unfollowed user:", userData?.fullNameString);
            followingCount -= 1;
          }
        }); // Assuming followUser toggles
      } else if (isFollowing === "Pending") {
        // Withdraw follow request (assuming API supports this)
        await userService.unFollowUser(userData?.id!).then((res) => {
          setIsFollowing(null);
          console.log("Withdrew follow request for:", userData?.fullNameString);
        }); // Assuming same endpoint toggles
      } else {
        // Follow user
        const res = await userService.followUser(userData?.id!);
        if (res.success) {
          setIsFollowing(res.data.status || "pending");
          console.log("Followed user:", res);
          followingCount += 1;
        }
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  return (
    <div className="pb-6 px-4 sm:px-6 bg-background">
      <div className="max-w-3xl mx-auto">
        {/* Profile picture and stats */}
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          {/* Profile picture with camera icon */}
          <div className="relative flex-shrink-0 items-center">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-2 border-gray-200 rounded-full">
              {userData?.profile?.avatar ? (
                <AvatarImage
                  src={userData?.profile?.avatar?.url}
                  alt={userData?.fullNameString}
                  className="rounded-full"
                />
              ) : (
                <AvatarFallback className="text-4xl text-primary-800 font-bold bg-gray-200">
                  {userData?.fullName.firstName.charAt(0)}
                  {userData?.fullName.lastName.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            {/* Integrated Profile Picture Uploader */}
            {accountHolder && (
              <ProfilePictureUploader
                onImageSubmit={handleImageSubmit}
                currentAvatar={userData?.profile?.avatar?.url}
                isLoading={isUploading}
                userInitials={`${
                  userData?.fullName?.firstName?.charAt(0) || "U"
                }${userData?.fullName?.lastName?.charAt(0) || "S"}`}
              />
            )}
          </div>

          {/* Stats and buttons */}
          <div className="flex-1">
            <div className="my-auto flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-semibold">
                  {userData?.fullNameString}
                </h1>
                {userData?.profile.isVerified && (
                  <VerifiedBadgeIcon className="w-1 h-1" />
                )}
              </div>
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
                <div className="flex flex-col">
                  <Button
                    variant={isFollowing === "Accepted" ? "outline" : "default"}
                    className={`h-8 text-sm ${
                      isFollowing === "Accepted"
                        ? "border-gray-300 text-gray-700 hover:bg-gray-100"
                        : isFollowing === "Pending"
                        ? "border-gray-300 bg-slate-500 text-white hover:bg-slate-700"
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
                  {isFollowing === "Pending" && (
                    <span className="text-green-500 text-xs  w-full text-center">
                      Requested
                    </span>
                  )}
                  {followsYou?.status === "Accepted" && (
                    <span className="text-green-500 text-xs  w-full text-center">
                      Follows You
                    </span>
                  )}
                  {followsYou?.status === "Pending" && (
                    <>
                      <span className="text-foreground text-xs  w-full text-center">
                        Requested to Follows You
                      </span>
                    </>
                  )}
                  {followsYou?.status === "Pending" && (
                    <Button
                      variant={"default"}
                      className={
                        "h-8 text-sm bg-primary-700 text-white hover:bg-primary-800"
                      }
                      onClick={handleAccept}
                    >
                      Accept
                    </Button>
                  )}
                </div>
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
                  Joined{" "}
                  {userData?.createdAt
                    ? new Date(userData.createdAt).toLocaleDateString()
                    : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Picture Uploader Dialog */}
      {showUploader && (
        <ProfilePictureUploader
          onImageSubmit={handleImageSubmit}
          isLoading={isUploading}
          currentAvatar={userData.profile?.avatar?.url}
        />
      )}
    </div>
  );
};

export default ProfileHeader;
