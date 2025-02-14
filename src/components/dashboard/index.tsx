"use client";
import React, { useEffect } from "react";
import { useTypewriter } from "react-simple-typewriter";
import { ArrowRight, Brain, Calculator, Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "answerwriting/components/ui/card";
import { Button } from "answerwriting/components/ui/button";
import { User as UserShape } from "next-auth";
import { useCustomToast } from "../react-common/toast";
import { useRouter } from "next/navigation";
import { ApiRoutePaths } from "answerwriting/types/general.types";
import ImpactSpan from "../react-common/impact-span";

const DashBoardClient = ({ user }: { user?: UserShape }) => {
  const toast = useCustomToast();
  const router = useRouter();

  const [text] = useTypewriter({
    words: [`${user?.name ? user.name.split(" ")[0] : "Aspirant"}!`],
    loop: 1,
    typeSpeed: 70,
    deleteSpeed: 50,
  });

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

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full max-w-7xl mx-auto p-6 space-y-12">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden bg-primary/5 p-8 md:p-12">
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1600&h=900&fit=crop&crop=foci"
              alt="Study Desk with Books and Laptop"
              className="w-full h-full object-cover opacity-10"
            />
          </div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-dark mb-6 min-h-[60px]">
              Welcome back, <ImpactSpan text={text} />
            </h1>
            <p className="text-lg md:text-xl text-secondary-dark max-w-2xl italic">
              Master your UPSC preparation journey with our specialized tools
              designed to enhance your answer writing skills.
            </p>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <CardHeader className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">
                  Answer Evaluator
                </CardTitle>
              </div>
              <p>
                Get AI feedback on your answers and improve your writing skills
              </p>
            </CardHeader>
            <CardContent className="relative">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                  Detailed scoring metrics
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                  Personalized feedback
                </li>
              </ul>
            </CardContent>
            <CardFooter className="relative">
              <Button
                className="mx-auto group-hover:translate-x-2 transition-transform"
                onClick={() =>
                  router.push(ApiRoutePaths.PAGE_DASHBOARD_TOOLS_EVALUATOR)
                }
              >
                Start Evaluation <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <CardHeader className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">
                  Word Counter
                </CardTitle>
              </div>
              <p>
                Perfect your answer length and structure with our advanced word
                counter
              </p>
            </CardHeader>
            <CardContent className="relative">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                  Real-time word counting
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                  Character and sentence analysis
                </li>
              </ul>
            </CardContent>
            <CardFooter className="relative">
              <Button
                className="mx-auto group-hover:translate-x-2 transition-transform"
                onClick={() =>
                  router.push(ApiRoutePaths.PAGE_DASHBOARD_TOOLS_WORD_COUNTER)
                }
              >
                Start Counting <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="relative rounded-2xl overflow-hidden bg-primary-dark p-8 md:p-12 text-white">
          <div className="absolute top-4 right-4">
            <Star className="h-12 w-12 text-yellow-400 animate-pulse" />
          </div>
          <div className="max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 flex flex-col md:flex-row items-center gap-3">
              Upgrade to Premium
              <span className="mr-auto px-3 py-1 text-secondary-dark bg-yellow-400 text-sm rounded-full">
                Limited Time Offer
              </span>
            </h2>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Unlock advanced features and take your UPSC preparation to the
              next level
            </p>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Button
                className="bg-yellow-400 hover:bg-yellow-500 text-secondary-dark font-bold px-8 py-6 text-lg"
                onClick={() => router.push(ApiRoutePaths.PAGE_PRICING)}
              >
                Pricing <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoardClient;
