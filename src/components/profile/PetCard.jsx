
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Calendar, PawPrint, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { formatLocalDateTime, formatRelativeTime } from "../utils/dateFormatter";

export default function PetCard({ pet, onEdit, onDelete }) {
  const calculateAge = (birthday) => {
    if (!birthday) return null;
    const today = new Date();
    const birthDate = new Date(birthday);
    const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + today.getMonth() - birthDate.getMonth();
    
    if (ageInMonths < 12) {
      return `${ageInMonths} month${ageInMonths !== 1 ? 's' : ''} old`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      const months = ageInMonths % 12;
      if (months === 0) {
        return `${years} year${years !== 1 ? 's' : ''} old`;
      }
      return `${years}y ${months}m old`;
    }
  };

  const age = calculateAge(pet.birthday);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-shadow">
        <CardContent className="p-0">
          <div className="relative h-48 bg-gradient-to-br from-purple-500 to-blue-500">
            {pet.photo_url ? (
              <img
                src={pet.photo_url}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-6xl">
                {pet.species === 'dog' ? '🐕' : '🐈'}
              </div>
            )}
            <div className="absolute top-3 right-3 flex gap-2">
              <Button
                size="icon"
                variant="secondary"
                onClick={() => onEdit(pet)}
                className="rounded-full bg-white/90 hover:bg-white shadow-lg"
                aria-label={`Edit ${pet.name}'s profile`}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="destructive"
                onClick={() => onDelete(pet.id)}
                className="rounded-full bg-red-500/90 hover:bg-red-600 shadow-lg"
                aria-label={`Delete ${pet.name}'s profile`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-2xl font-bold mb-2 text-gray-900">{pet.name}</h3>
            
            <div className="space-y-2 text-gray-600">
              <div className="flex items-center gap-2">
                <PawPrint className="w-4 h-4 text-purple-500" />
                <span className="capitalize">{pet.species}</span>
                {pet.breed && <span className="text-gray-400">• {pet.breed}</span>}
              </div>
              
              {pet.gender && (
                <div className="flex items-center gap-2">
                  <span className="text-purple-500">{pet.gender === 'male' ? '♂️' : pet.gender === 'female' ? '♀️' : '❓'}</span>
                  <span className="capitalize">{pet.gender}</span>
                </div>
              )}
              
              {age && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span>{age}</span>
                </div>
              )}

              {/* Last Updated Timestamp */}
              {pet.updated_date && (
                <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100 mt-3">
                  <Clock className="w-3 h-3" />
                  <span>Updated {formatRelativeTime(pet.updated_date)}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
