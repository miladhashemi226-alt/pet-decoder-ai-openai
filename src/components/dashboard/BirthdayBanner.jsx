import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Cake, PartyPopper } from "lucide-react";

export default function BirthdayBanner({ pets }) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-none shadow-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white overflow-hidden relative mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <CardContent className="p-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 animate-bounce">
              <Cake className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-3xl font-bold">Happy Birthday!</h2>
                <PartyPopper className="w-6 h-6" />
              </div>
              {pets.length === 1 ? (
                <p className="text-xl">
                  🎉 Today is {pets[0].name}'s special day! Make it extra special with treats and cuddles! 🎂
                </p>
              ) : (
                <p className="text-xl">
                  🎉 Today is a special day for {pets.map(p => p.name).join(' and ')}! Celebrate with treats and extra love! 🎂
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}