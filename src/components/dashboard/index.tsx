"use client";
import React from "react";
import { LogOut, Mail, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "answerwriting/components/ui/card";
import { Button } from "answerwriting/components/ui/button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "answerwriting/components/ui/avatar";
import { User as UserShape } from "next-auth";
import { logout } from "answerwriting/actions";

const DashBoardClient = ({ user }: { user: UserShape }) => {
  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 py-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="w-full flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Dashboard (example)
          </h1>
          <Button
            variant="outline"
            className="w-full md:w-auto flex items-center justify-center gap-2"
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
              {user.image && user.name?.[0] && (
                <Avatar className="h-20 w-20 md:h-24 md:w-24">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
              )}

              <div className="w-full space-y-6">
                <div className="grid w-full gap-6">
                  <div className="flex flex-col items-center md:items-start gap-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="h-4 w-4" />
                      Name
                    </div>
                    <div className="font-medium">{user.name}</div>
                  </div>

                  <div className="flex flex-col items-center md:items-start gap-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                    <div className="font-medium text-center md:text-left break-all">
                      {user.email}
                    </div>
                  </div>

                  <div className="flex flex-col items-center md:items-start gap-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="h-4 w-4" />
                      User ID
                    </div>
                    <div className="font-medium text-sm font-mono break-all">
                      {user.id}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500 text-center md:text-left">
                Answers Written
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-center md:text-left">
                0
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500 text-center md:text-left">
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-center md:text-left">
                N/A
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500 text-center md:text-left">
                Topics Covered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-center md:text-left">
                0
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashBoardClient;
