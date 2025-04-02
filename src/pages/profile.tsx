import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Edit2,
  UserPlus,
  UserMinus,
  Users,
} from "lucide-react";

interface Friend {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  mutualFriends?: number;
}

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  // Mock user data - in a real app, this would come from an API
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    location: "San Francisco, CA",
    joinDate: "January 2023",
    bio: "Movie enthusiast and book lover. Always looking for new recommendations!",
  });

  // Mock friends data
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: "1",
      name: "Emma Watson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      email: "emma@example.com",
      mutualFriends: 5,
    },
    {
      id: "2",
      name: "John Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      email: "john@example.com",
      mutualFriends: 3,
    },
    {
      id: "3",
      name: "Sophia Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophia",
      email: "sophia@example.com",
      mutualFriends: 7,
    },
    {
      id: "4",
      name: "Michael Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      email: "michael@example.com",
      mutualFriends: 2,
    },
  ]);

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile sidebar */}
            <div className="w-full md:w-1/3 lg:w-1/4">
              <Card>
                <CardHeader className="text-center">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={userData.avatar} alt={userData.name} />
                    <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="mt-4">{userData.name}</CardTitle>
                  <CardDescription>{userData.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{userData.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        Joined {userData.joinDate}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{friends.length} Friends</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setActiveTab("edit-profile")}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Main content */}
            <div className="flex-1">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 w-full mb-8">
                  <TabsTrigger value="profile">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="friends">
                    <Users className="h-4 w-4 mr-2" />
                    Friends
                  </TabsTrigger>
                  <TabsTrigger value="edit-profile">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>About Me</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{userData.bio}</p>
                    </CardContent>
                  </Card>

                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Your recent activity will appear here.
                      </p>
                    </CardContent>
                  </Card>
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
                        {friends.map((friend) => (
                          <div
                            key={friend.id}
                            className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/10"
                          >
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage
                                  src={friend.avatar}
                                  alt={friend.name}
                                />
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
                      {friends.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">
                          You don't have any friends yet. Add some friends to
                          get started!
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="edit-profile" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Edit Profile</CardTitle>
                      <CardDescription>
                        Update your profile information
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form
                        onSubmit={handleProfileUpdate}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={userData.name}
                            onChange={(e) =>
                              setUserData({ ...userData, name: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={userData.email}
                            onChange={(e) =>
                              setUserData({
                                ...userData,
                                email: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={userData.location}
                            onChange={(e) =>
                              setUserData({
                                ...userData,
                                location: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            rows={4}
                            value={userData.bio}
                            onChange={(e) =>
                              setUserData({ ...userData, bio: e.target.value })
                            }
                          />
                        </div>
                        <div className="pt-4 flex justify-end space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setActiveTab("profile")}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">Save Changes</Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
