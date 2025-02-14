"use client";
import React, { useEffect, useState } from "react";
import { Mail, Check, User, CreditCard } from "lucide-react";
import { Card, CardContent } from "answerwriting/components/ui/card";
import { Button } from "answerwriting/components/ui/button";
import { Badge } from "answerwriting/components/ui/badge";
import { User as UserShape } from "next-auth";
import { ApiRoutePaths } from "answerwriting/types/general.types";
import { useCustomToast } from "answerwriting/components/react-common/toast";
import { useRouter } from "next/navigation";

export const ProfilePage = ({ user }: { user?: UserShape }) => {
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user?.image ?? "/user.png"}
              alt={user?.name ?? "Aspirant"}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
            />
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
                {activeTab === "profile" ? (
                  <div className="space-y-6">
                    <div>
                      <div className="space-y-6">
                        <div className="border-b pb-4">
                          <label className="block text-sm font-bold mb-1">
                            Name
                          </label>
                          <p className="text-secondary-dark">{user.name}</p>
                        </div>
                        <div className="border-b pb-4">
                          <label className="block text-sm font-bold mb-1">
                            Email
                          </label>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-secondary-dark break-all">
                              {user.email}
                            </span>
                            {emailVerified && (
                              <Badge className="bg-green-700 text-white hover:bg-green-700">
                                <Check className="w-3 h-3 mr-1" /> Verified
                              </Badge>
                            )}
                            {linkedWithGoogle && (
                              <Badge className="bg-primary-dark text-white hover:bg-primary-dark">
                                Linked with google
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold mb-1">
                            Current Plan
                          </label>
                          <p className="text-gray-900">Free (since Jan 2025)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-6">Subscription</h2>
                    <div className="bg-white border rounded-lg p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {"Free"} Plan
                          </h3>
                          <p className="text-gray-500 mt-1">
                            Basic features included
                          </p>
                        </div>
                        {"Free" === "Free" && (
                          <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                            Upgrade Plan
                          </Button>
                        )}
                      </div>
                    </div>

                    {"Free" === "Free" && (
                      <div className="mt-8">
                        <h3 className="text-lg font-medium mb-4">
                          Available Plans
                        </h3>
                        <Card>
                          <CardContent className="p-4 md:p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                              <div>
                                <h4 className="text-lg font-medium">
                                  Pro Plan
                                </h4>
                                <ul className="mt-2 space-y-2 text-gray-600">
                                  <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-500" />
                                    Unlimited projects
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-500" />
                                    Priority support
                                  </li>
                                </ul>
                              </div>
                              <Button
                                variant="outline"
                                className="w-full sm:w-auto"
                              >
                                Learn More
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
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
