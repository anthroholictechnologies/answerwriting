"use client";
import React, { useEffect, useState } from "react";
import { Mail, User, CreditCard } from "lucide-react";
import { Card, CardContent } from "answerwriting/components/ui/card";
import { User as UserShape } from "next-auth";
import {
  ApiRoutePaths,
  UserDetailProp,
} from "answerwriting/types/general.types";
import { useCustomToast } from "answerwriting/components/react-common/toast";
import { useRouter } from "next/navigation";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "answerwriting/components/ui/avatar";
import { ProfileTab } from "./tab-profile";
import { SubscriptionTab } from "./tab-subscription";

export const ProfilePage = ({
  user,
  userDetails,
}: {
  user?: UserShape;
  userDetails: UserDetailProp;
}) => {
  const toast = useCustomToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (!user) {
      toast.info({
        title: "You are not logged in",
        description: "Please log in to access your dashboard",
      });

      const timeout = setTimeout(() => {
        router.push(ApiRoutePaths.PAGE_LOGIN);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [user, router, toast]);

  if (!user) return null;
  const emailVerified = user.password ? user.emailVerified : true;
  const linkedWithGoogle = !user.password;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Top Section */}
        <div className="p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="h-16 w-16 border">
              {user.image && (
                <AvatarImage src={user.image} alt="Navdeep Yadav" />
              )}
              <AvatarFallback>AW</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h1 className="text-xl font-semibold text-secondary-dark">
                {user.name}
              </h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-sm mt-1">
                <Mail className="w-4 h-4" />
                <span className="break-all">{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Horizontal/Vertical Navigation */}
          <div className="md:w-64 flex-shrink-0">
            <nav className="flex md:flex-col border-b md:border-b-0 mb-4 md:mb-0">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center justify-center md:justify-start gap-3 p-4 text-sm font-bold flex-1 md:flex-none border-b-2 md:border-b-0 md:border-l-2 transition-colors ${
                  activeTab === "profile"
                    ? "border-primary-dark text-primary-dark"
                    : "border-transparent"
                }`}
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Profile</span>
              </button>
              <button
                onClick={() => setActiveTab("plan")}
                className={`flex items-center justify-center md:justify-start gap-3 p-4 text-sm font-bold flex-1 md:flex-none border-b-2 md:border-b-0 md:border-l-2 transition-colors ${
                  activeTab === "plan"
                    ? "border-primary-dark text-primary-dark"
                    : "border-transparent"
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="hidden sm:inline">Your Plan</span>
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <Card>
              <CardContent className="p-4 md:p-6">
                {activeTab === "profile" && user.email && user.name ? (
                  <ProfileTab
                    email={user.email}
                    key={user.id}
                    emailVerified={!!emailVerified}
                    linkedWithGoogle={linkedWithGoogle}
                    name={user.name}
                    userDetails={userDetails}
                  />
                ) : (
                  <SubscriptionTab userDetails={userDetails} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
