import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  );
}