import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PawPrint } from "lucide-react";

export default function PetSelector({ pets, selectedPet, onSelectPet }) {
  if (!Array.isArray(pets) || pets.length === 0) {
    return null;
  }

  const getPet = (petId) => pets.find(p => p.id === petId);
  const selectedPetData = getPet(selectedPet);

  return (
    <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-purple-100">
        <CardTitle className="flex items-center gap-2">
          <PawPrint className="w-5 h-5" />
          Select Pet to Analyze
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {selectedPetData && selectedPetData.photo_url && (
            <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
              <img
                src={selectedPetData.photo_url}
                alt={selectedPetData.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
              />
              <div>
                <p className="font-semibold text-gray-900">{selectedPetData.name}</p>
                <p className="text-sm text-gray-600">
                  {selectedPetData.species === 'dog' ? '🐕' : '🐈'} {selectedPetData.breed || selectedPetData.species}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  ✓ Photo on file - AI will identify your pet
                </p>
              </div>
            </div>
          )}
          
          <Select value={selectedPet} onValueChange={onSelectPet}>
            <SelectTrigger className="w-full border-purple-200 focus:border-purple-400">
              <SelectValue placeholder="Choose a pet" />
            </SelectTrigger>
            <SelectContent>
              {pets.map((pet) => (
                <SelectItem key={pet.id} value={pet.id}>
                  <div className="flex items-center gap-2">
                    {pet.photo_url ? (
                      <img
                        src={pet.photo_url}
                        alt={pet.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <span>{pet.species === 'dog' ? '🐕' : '🐈'}</span>
                    )}
                    <span>{pet.name}</span>
                    {pet.breed && <span className="text-gray-500">({pet.breed})</span>}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedPetData && !selectedPetData.photo_url && (
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <p className="font-medium text-blue-900 mb-1">💡 Tip: Add a photo</p>
              <p className="text-blue-700">
                Upload a photo of {selectedPetData.name} in their profile to help our AI identify them in videos with multiple pets.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}