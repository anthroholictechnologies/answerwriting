/* eslint-disable @next/next/no-img-element */
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Top Section */}
        <div className="p-6 mb-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.image ?? "/user.png"}
              alt={user?.name ?? "Aspirant"}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
            />
            <div>
              <h1 className="text-xl font-semibold text-secondary-dark">
                {user.name}
              </h1>
              <div className="flex items-center gap-2 text-sm mt-1">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Vertical Navigation */}
          <div className="w-64 flex-shrink-0">
            <div>
              <nav className="flex flex-col">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center gap-3 p-4 text-sm font-bold border-l-2 transition-colors ${
                    activeTab === "profile"
                      ? "border-primary-dark text-primary-dark"
                      : "border-transparent"
                  }`}
                >
                  <User className="w-5 h-5" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("plan")}
                  className={`flex items-center gap-3 p-4 text-sm font-bold border-l-2 transition-colors ${
                    activeTab === "plan"
                      ? "border-primary-dark text-primary-dark"
                      : "border-transparent"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  Your Plan
                </button>
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <Card>
              <CardContent className="p-6">
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
                          <div className="flex items-center gap-2">
                            <span className="text-secondary-dark">
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
                    <div className="bg-white border rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {"Free"} Plan
                          </h3>
                          <p className="text-gray-500 mt-1">
                            Basic features included
                          </p>
                        </div>
                        {"Free" === "Free" && (
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
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
                          <CardContent className="p-6">
                            <div className="flex justify-between items-center">
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
                              <Button variant="outline">Learn More</Button>
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
