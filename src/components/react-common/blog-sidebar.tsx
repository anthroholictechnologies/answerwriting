import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
} from "answerwriting/components/ui/sidebar";
import { Badge } from "answerwriting/components/ui/badge";
import { Button } from "answerwriting/components/ui/button";
import { BookOpen, Users, Trophy, CheckCircle } from "lucide-react";
import Image from "next/image";

export function BlogSidebar() {
  return (
    <Sidebar className="w-64 bg-white border-r">
      <SidebarHeader className="p-4 border-b">
        <h2 className="text-2xl font-bold text-primary">AnswerWriting.com</h2>
        <p className="text-sm text-muted-foreground">
          Master UPSC Mains Answers
        </p>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup className="mb-6">
          <div className="relative mb-4">
            <Image
              src="https://plus.unsplash.com/premium_photo-1679870686437-2c3eb1de46d0?q=80&w=1856&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Students writing"
              className="w-full rounded-lg"
              height={200}
              width={400}
            />
            <Badge className="absolute top-2 right-2 bg-primary">Premium</Badge>
          </div>
          <h3 className="text-lg font-semibold mb-2">Expert-Guided Learning</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">
                Personalized feedback from IAS officers
              </span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Daily answer writing practice</span>
            </li>
          </ul>
        </SidebarGroup>

        <SidebarGroup className="mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <BookOpen className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-xl font-bold text-blue-600">1000+</div>
              <div className="text-xs">Questions</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-xl font-bold text-green-600">5000+</div>
              <div className="text-xs">Students</div>
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg mb-4">
            <Trophy className="h-6 w-6 text-orange-600 mb-2" />
            <h4 className="font-semibold text-orange-600">Success Stories</h4>
            <p className="text-sm">Over 100+ selections in UPSC CSE 2023</p>
          </div>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <Button className="w-full mb-2">Start Free Trial</Button>
        <p className="text-xs text-center text-muted-foreground">
          Join thousands of successful UPSC aspirants
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}

export default BlogSidebar;
