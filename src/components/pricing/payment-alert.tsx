import React from "react";

export const EnhancedAlert: React.FC<{
  title: string;
  description: React.ReactNode;
  icon: React.ReactNode;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
}> = ({ title, description, icon, variant = "default", action }) => (
  <div
    className={`w-full rounded-lg border p-4 mb-4  ${
      variant === "destructive"
        ? "border-red-500/50 bg-red-50 text-red-800"
        : "border-gray-200 bg-gray-50"
    }`}
  >
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
      {/* Icon */}
      <div className="flex-shrink-0 text-lg">{icon}</div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        <div className="font-medium">{title}</div>
        <div className="text-sm">{description}</div>
      </div>

      {/* Action - Full width on mobile, inline on desktop */}
      {action && (
        <div className="flex-shrink-0 pt-2 sm:pt-0">
          <div className="w-full sm:w-auto">{action}</div>
        </div>
      )}
    </div>
  </div>
);
