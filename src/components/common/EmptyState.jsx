import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function EmptyState({ 
  icon: Icon,
  emoji,
  title, 
  description, 
  actionLabel,
  actionLink,
  onAction,
  className = ""
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`text-center py-12 ${className}`}
    >
      <div className="mb-6">
        {Icon ? (
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon className="w-10 h-10 text-purple-600" />
          </div>
        ) : emoji ? (
          <div className="text-6xl mb-4">{emoji}</div>
        ) : null}
      </div>

      {title && (
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
          {title}
        </h3>
      )}

      {description && (
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}

      {(actionLabel && (actionLink || onAction)) && (
        actionLink ? (
          <Link to={actionLink}>
            <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
              {actionLabel}
            </Button>
          </Link>
        ) : (
          <Button 
            onClick={onAction}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
          >
            {actionLabel}
          </Button>
        )
      )}
    </motion.div>
  );
}