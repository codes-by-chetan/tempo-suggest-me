import React, { useCallback, useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ProfileHeader from "@/components/profile/ProfileHeader";
import PostCard from "@/components/profile/PostCard";
import {
  UserPlus,
  UserMinus,
  Users,
  Grid,
  Bookmark,
  Settings,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { SavedItem, savedItemsArray } from "@/data/mySavedItem";
import { myPostsArray, Post } from "@/data/myPosts";
import { Friend, myFriendsArray } from "@/data/myFriends";
import UserService from "@/services/user.service";
import { getToast } from "@/services/toasts.service";
import { UserProfileData } from "@/interfaces/user.interface";
import { useAuth } from "@/lib/auth-context";

const Profile = () => {
  const userService = new UserService();
  const [activeTab, setActiveTab] = useState("profile");
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const authProvider = useAuth();
  const navigate = useNavigate();
  // Mock user data - in a real app, this would come from an API
  // for now the type is given s any as the fields in the object differ from suggestor
  const [userData, setUserData] = useState<UserProfileData>();

  // Mock saved items data
  const [savedItems, setSavedItems] = useState<SavedItem[]>(savedItemsArray);

  // Mock posts data
  const [posts, setPosts] = useState<Post[]>(myPostsArray);

  // Mock friends data
  const [friends, setFriends] = useState<Friend[]>(myFriendsArray);

  const { id } = useParams();

  console.log("ID OF THE USER IS: ", id);
  const refreshDetails = useCallback(async () => {
    if (id) {
      userService.getUserProfileById(id).then((res) => {
        if (res.success) {
          setUserData(res.data);
        } else {
          getToast("error", res.message);
        }
      });
    } else {
      userService.getUserProfile().then((res) => {
        if (res.success) {
          setUserData(res.data);
        } else {
          getToast("error", res.message);
        }
      });
    }
  }, []);

  useEffect(() => {
    refreshDetails();
  }, []);

  // Mock function to handle profile update
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the updated profile to the backend
    setIsEditing(false);
  };

  // Mock function to handle friend removal
  const handleRemoveFriend = (friendId: string) => {
    setFriends(friends.filter((friend) => friend.id !== friendId));
    // In a real app, this would send a request to the backend
  };

  // Mock function to handle post click
  const handlePostClick = (postId: string) => {
    console.log(`Post clicked: ${postId}`);
    // In a real app, this would navigate to the post detail page or open a modal
  };

  // Mock function to handle saved item click
  const handleSavedItemClick = (itemId: string) => {
    console.log(`Saved item clicked: ${itemId}`);
    // In a real app, this would navigate to the content detail page
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto pt-20 px-4 sm:px-6 lg:px-8">
        {/* Instagram-like header section */}
        <ProfileHeader
          userData={userData}
          FollowersCount={userData?.relations.followers.count}
          onEditProfile={() => navigate("/edit-profile")}
          onOpenSettings={() => setShowSettingsDialog(true)}
          followingCount={userData?.relations.followings.count}
          postsCount={userData?.postsCount}
          refreshProfile={refreshDetails}
          accountHolder={id ? (id===authProvider?.user?._id ? true: false) : true} // id id is present means we are navigating to the profile of another user
        />

        {/* Instagram-like tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full my-4 bg-transparent border-b border-border rounded-none h-auto p-0">
            <TabsTrigger
              value="profile"
              className="flex items-center justify-center py-3 rounded-none border-0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              <Grid className="h-4 w-4 mr-2" />
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="friends"
              className="flex items-center justify-center py-3 rounded-none border-0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              <Users className="h-4 w-4 mr-2" />
              Friends
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className="flex items-center justify-center py-3 rounded-none border-0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              <Bookmark className="h-4 w-4 mr-2" />
              Saved
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-0">
            {/* Posts Grid */}
            <div className="grid grid-cols-3 gap-1 md:gap-4">
              {posts?.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  imageUrl={post.imageUrl}
                  likes={post.likes}
                  comments={post.comments}
                  caption={post.caption}
                  onClick={() => handlePostClick(post.id)}
                />
              ))}
            </div>

            {posts?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No posts yet.</p>
                <Button variant="outline" className="mt-4">
                  Create your first post
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="friends" className="mt-0">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Friends</CardTitle>
                <Button variant="outline" size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Friend
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {friends?.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/10"
                    >
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={friend.avatar} alt={friend.name} />
                          <AvatarFallback>
                            {friend.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{friend.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {friend.email}
                          </p>
                          {friend.mutualFriends && (
                            <p className="text-xs text-muted-foreground">
                              {friend.mutualFriends} mutual friends
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        onClick={() => handleRemoveFriend(friend.id)}
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                {friends?.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    You don't have any friends yet. Add some friends to get
                    started!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved" className="mt-0">
            {/* Saved Items Grid */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Saved Items</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedItems?.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-all"
                    onClick={() => handleSavedItemClick(item.id)}
                  >
                    <div
                      className="h-40 w-full bg-muted"
                      onClick={() =>
                        navigate(`/content/${item.id}`, {
                          state: { contentDetails: item },
                        })
                      }
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-primary capitalize">
                          {item.type}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Saved on {new Date(item.savedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3
                        className="font-semibold text-lg mb-1"
                        onClick={() =>
                          navigate(`/content/${item.id}`, {
                            state: { contentDetails: item },
                          })
                        }
                      >
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.creator} • {item.year}
                      </p>
                      <div className="mt-4 w-[100%] flex justify-center">
                        <Button
                          className="w-full"
                          onClick={() =>
                            navigate(`/content/${item.id}`, {
                              state: { contentDetails: item },
                            })
                          }
                        >
                          More Info...
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {savedItems?.length === 0 && (
                <div className="text-center py-12 bg-muted/20 rounded-lg">
                  <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No saved items yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Items you save will appear here.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Settings Dialog */}
      {showSettingsDialog && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowSettingsDialog(false)}
        >
          <div
            className="bg-background rounded-lg shadow-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2" /> Profile Settings
            </h2>
            <div className="space-y-4">
              <div className="p-3 hover:bg-accent rounded-md cursor-pointer flex items-center justify-between">
                <span>Privacy</span>
                <span className="text-muted-foreground">→</span>
              </div>
              <div className="p-3 hover:bg-accent rounded-md cursor-pointer flex items-center justify-between">
                <span>Notifications</span>
                <span className="text-muted-foreground">→</span>
              </div>
              <div className="p-3 hover:bg-accent rounded-md cursor-pointer flex items-center justify-between">
                <span>Account Security</span>
                <span className="text-muted-foreground">→</span>
              </div>
              <div className="p-3 hover:bg-accent rounded-md cursor-pointer flex items-center justify-between">
                <span>Theme</span>
                <span className="text-muted-foreground">→</span>
              </div>
              <div className="p-3 hover:bg-accent rounded-md cursor-pointer flex items-center justify-between text-destructive">
                <span>Logout</span>
                <span className="text-muted-foreground">→</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowSettingsDialog(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
