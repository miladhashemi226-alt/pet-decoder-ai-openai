import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Upload } from "lucide-react";

export default function EmptyState({ title, description }) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">📹</div>
      <h3 className="text-xl font-bold mb-2 text-gray-900">
        {title || "No Analyses Yet"}
      </h3>
      <p className="text-gray-600 mb-6">
        {description || "Upload your first video to start understanding your pet's behavior"}
      </p>
      <Link to={createPageUrl("Analyze")}>
        <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
          <Upload className="w-5 h-5 mr-2" />
          Analyze First Video
        </Button>
      </Link>
    </div>
  );
}