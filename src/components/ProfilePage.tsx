import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { User, Mail, Calendar, Edit, Save, X, LogOut, RotateCcw } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface UserProfile {
  email: string;
  name: string;
  password: string;
  createdAt: string;
}

interface ProfilePageProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onLogout: () => void;
  onCompleteReset?: () => void;
}

export function ProfilePage({ profile, onUpdateProfile, onLogout, onCompleteReset }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSaveProfile = () => {
    if (!editName || !editEmail) {
      toast.error("Name and email are required");
      return;
    }

    const updatedProfile = {
      ...profile,
      name: editName,
      email: editEmail
    };

    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    onUpdateProfile(updatedProfile);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (currentPassword !== profile.password) {
      toast.error("Current password is incorrect");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const updatedProfile = {
      ...profile,
      password: newPassword
    };

    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    onUpdateProfile(updatedProfile);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Password changed successfully!");
  };

  const handleCancelEdit = () => {
    setEditName(profile.name);
    setEditEmail(profile.email);
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      onLogout();
      toast.success("Logged out successfully");
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          👤 Manage your profile and account settings
        </p>
      </div>

      {/* Profile Header Card */}
      <Card className="p-6 shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 text-2xl">
              <AvatarFallback className="bg-primary text-white">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2>{profile.name}</h2>
              <p className="text-muted-foreground">{profile.email}</p>
              <Badge variant="secondary" className="mt-2">
                <Calendar className="w-3 h-3 mr-1" />
                Member since {formatDate(profile.createdAt)}
              </Badge>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="edit-name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="edit-email"
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveProfile}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p>{profile.name}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Email Address</p>
              <p>{profile.email}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Change Password Card */}
      <Card className="p-6 shadow-xl">
        <h3 className="mb-4">Change Password</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={handleChangePassword}>
            Change Password
          </Button>
        </div>
      </Card>

      {/* Account Actions */}
      <Card className="p-6 shadow-xl">
        <h3 className="mb-4">Account Actions</h3>
        <div className="space-y-4">
          <div className="flex items-start justify-between p-4 border rounded-lg">
            <div>
              <p>Logout</p>
              <p className="text-sm text-muted-foreground">
                Sign out of your account
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {onCompleteReset && (
            <div className="flex items-start justify-between p-4 border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <div>
                <p className="text-orange-900 dark:text-orange-100">Complete Reset</p>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Start fresh from login screen (for testing)
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  if (confirm("This will clear ALL data and return to login screen. Continue?")) {
                    onCompleteReset();
                  }
                }}
                className="border-orange-500 text-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          )}

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Your expense data is stored locally on your device. 
              Clearing browser data will remove all your information.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
