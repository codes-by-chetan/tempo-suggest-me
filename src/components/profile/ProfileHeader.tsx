import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Settings } from "lucide-react";
import { UserProfileData } from "@/interfaces/user.interface";
import ProfilePictureUploader from "./ProfilePictureUploader";
import UserService from "@/services/user.service";
import { useNavigate } from "react-router-dom";
import VerifiedBadgeIcon from "./VerifiedBadgeIcon";
import { useSocket } from "@/lib/socket-context";

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
  const [isFollowing, setIsFollowing] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [followsYou, setFollowsYou] = useState<{ [key: string]: any } | null>(
    null
  );

  const userService = new UserService();
  const navigate = useNavigate();
  const { socket } = useSocket();

  socket?.on("followAccepted", (data: any) => {
    if (data.following === userData.id) {
      setIsFollowing("Accepted");
      followingCount += 1;
    }
  });
  socket?.on("followedYou", (data: any) => {
    if (data.follower === userData.id) {
      setFollowsYou(data);
      FollowersCount += 1;
    }
  });
  socket?.on("unFollowedYou", (data: any) => {
    if (data.follower === userData.id) {
      setFollowsYou(null);
      FollowersCount -= 1;
    }
  });

  const handleAccept = () => {
    userService.acceptFollowRequest(followsYou._id).then((res) => {
      if (res.success) setFollowsYou(res.data);
    });
  };

  useEffect(() => {
    const checkFollowStatus = async () => {
      const token = userService.getAccessToken();
      if (!accountHolder && token && userData?.id) {
        try {
          const response = await userService.getRelation(userData.id);
          setIsFollowing(response.data.status || null);
        } catch (error) {
          setIsFollowing(null);
        }
        await userService.getFollowsYou(userData.id).then((res) => {
          if (res.success) setFollowsYou(res.data);
        });
      }
    };
    checkFollowStatus();
  }, [accountHolder, userData?.id]);

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

  const handleFollowToggle = async () => {
    const token = userService.getAccessToken();
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      if (isFollowing === "Accepted") {
        await userService.unFollowUser(userData?.id!).then((res) => {
          if (res.success) {
            setIsFollowing(null);
            followingCount -= 1;
          }
        });
      } else if (isFollowing === "Pending") {
        await userService.unFollowUser(userData?.id!).then((res) => {
          setIsFollowing(null);
        });
      } else {
        const res = await userService.followUser(userData?.id!);
        if (res.success) {
          setIsFollowing(res.data.status || "pending");
          followingCount += 1;
        }
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  return (
    <div className="px-4 py-3 sm:px-0 sm:pb-6 bg-background">
      <div className="max-w-3xl mx-auto flex-col">
        {/* Profile picture and stats container */}
        <div className="flex flex-row items-start gap-4 sm:gap-6">
          {/* Profile picture */}
          <div className="relative flex-shrink-0">
            <Avatar className="h-[77px] w-[77px] sm:h-32 sm:w-32 border-2 border-gray-200 rounded-full">
              {userData?.profile?.avatar ? (
                <AvatarImage
                  src={userData?.profile?.avatar?.url}
                  alt={userData?.fullNameString}
                  className="rounded-full"
                />
              ) : (
                <AvatarFallback className="text-3xl sm:text-4xl text-primary-800 font-bold bg-gray-200">
                  {userData?.fullName.firstName.charAt(0)}
                  {userData?.fullName.lastName.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
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

          {/* Stats and buttons container */}
          <div className="flex-1 flex flex-col">
            {/* Username and settings */}
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center gap-1 sm:gap-2">
                <h1 className="text-base sm:text-xl font-semibold">
                  {userData?.fullNameString}
                </h1>
                {userData?.profile.isVerified && (
                  <VerifiedBadgeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
              {accountHolder ? (
                <div className="flex gap-2 items-center">
                  <Button
                    variant="outline"
                    className="hidden sm:flex h-8 text-sm border-gray-300 hover:bg-gray-100 justify-center items-center px-4"
                    onClick={onEditProfile}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 sm:h-8 sm:w-8"
                    onClick={onOpenSettings || onEditProfile}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="hidden sm:flex sm:flex-col">
                  <Button
                    variant={isFollowing === "Accepted" ? "outline" : "default"}
                    className={`h-8 text-sm ${
                      isFollowing === "Accepted"
                        ? "border-gray-300 text-gray-700 hover:bg-gray-100"
                        : isFollowing === "Pending"
                        ? "border-gray-300 bg-slate-500 text-white hover:bg-slate-700"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    } justify-center items-center px-4`}
                    onClick={handleFollowToggle}
                    size="sm"
                  >
                    {isFollowing === "Accepted"
                      ? "Unfollow"
                      : isFollowing === "Pending"
                      ? "Requested"
                      : "Follow"}
                  </Button>
                  {/* {isFollowing === "Pending" && (
                    <span className="text-green-500 text-xs w-full text-center">
                      Requested
                    </span>
                  )} */}
                  {followsYou?.status === "Accepted" && (
                    <span className="text-gray-600 text-xs text-center">
                      Follows You
                    </span>
                  )}
                  {followsYou?.status === "Pending" && (
                    <>
                      <span className="text-gray-600 text-xs text-center">
                        Requested to Follow You
                      </span>
                      <Button
                        variant="default"
                        className="w-full h-[30px] text-sm bg-blue-500 text-white hover:bg-blue-600 font-medium justify-center items-center px-4"
                        onClick={handleAccept}
                      >
                        Accept
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Stats row */}
            <div className="flex justify-between sm:gap-6 mb-2 sm:mb-3">
              <div className="text-center">
                <span className="font-semibold text-sm sm:text-base">
                  {postsCount}
                </span>
                <span className="text-xs sm:text-sm text-gray-600 ml-1">
                  Posts
                </span>
              </div>
              <div className="text-center">
                <span className="font-semibold text-sm sm:text-base">
                  {FollowersCount}
                </span>
                <span className="text-xs sm:text-sm text-gray-600 ml-1">
                  Followers
                </span>
              </div>
              <div className="text-center">
                <span className="font-semibold text-sm sm:text-base">
                  {followingCount}
                </span>
                <span className="text-xs sm:text-sm text-gray-600 ml-1">
                  Following
                </span>
              </div>
            </div>

            {/* Buttons for mobile */}
            {accountHolder ? (
              <Button
                variant="outline"
                className="w-full sm:hidden h-[30px] text-sm border-gray-200 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium justify-center items-center px-4"
                onClick={onEditProfile}
              >
                Edit Profile
              </Button>
            ) : (
              <div className="flex sm:hidden flex-col gap-1">
                <Button
                  variant={isFollowing === "Accepted" ? "outline" : "default"}
                  className={`w-full h-[30px] text-sm ${
                    isFollowing === "Accepted"
                      ? "border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-200"
                      : isFollowing === "Pending"
                      ? "border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-200"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  } font-medium justify-center items-center px-4`}
                  onClick={handleFollowToggle}
                >
                  {isFollowing === "Accepted"
                    ? "Unfollow"
                    : isFollowing === "Pending"
                    ? "Withdraw"
                    : "Follow"}
                </Button>
                {isFollowing === "Pending" && (
                  <span className="text-green-500 text-xs text-center">
                    Requested
                  </span>
                )}
                {followsYou?.status === "Accepted" && (
                  <span className="text-gray-600 text-xs text-center">
                    Follows You
                  </span>
                )}
                {followsYou?.status === "Pending" && (
                  <>
                    <span className="text-gray-600 text-xs text-center">
                      Requested to Follow You
                    </span>
                    <Button
                      variant="default"
                      className="w-full h-[30px] text-sm bg-blue-500 text-white hover:bg-blue-600 font-medium justify-center items-center px-4"
                      onClick={handleAccept}
                    >
                      Accept
                    </Button>
                  </>
                )}
              </div>
            )}

            {/* Bio and details */}
            <div className="mt-2 hidden sm:mt-4 sm:block">
              <p className="font-medium text-sm">
                {userData?.profile?.displayName}
              </p>
              <p className="text-sm text-gray-600 leading-tight">
                {userData?.profile?.bio}
              </p>
              {userData?.profile?.location && (
                <div className="flex items-center mt-0.5 sm:mt-2">
                  <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {userData?.profile?.location}
                  </span>
                </div>
              )}
              <div className="flex items-center mt-0.5 sm:mt-1">
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
        <div className="mt-2 sm:mt-4 sm:hidden">
          <p className="font-medium text-sm">{userData?.fullNameString}</p>
          <p className="text-sm text-gray-600 leading-tight">
            {userData?.profile?.bio}
          </p>
          <div className="flex items-center mt-0.5 sm:mt-2">
            <MapPin className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-sm text-gray-600">
              {userData?.profile?.location}
            </span>
          </div>
          <div className="flex items-center mt-0.5 sm:mt-1">
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
