
import React, { useState, useEffect } from "react";
import { VaccinationRecord } from "@/api/entities";
import { Pet } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Syringe, Calendar, AlertTriangle, Info, Settings as SettingsIcon, PawPrint, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { differenceInDays, parseISO } from "date-fns";
import { formatLocalDate } from "@/components/utils/dateFormatter";

import VaccineScheduleInfo from "../components/vaccines/VaccineScheduleInfo";
import SEO from "../components/common/SEO";
import { handleAuthError, getFriendlyErrorMessage } from "../components/utils/errorHandler";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function VaccineReminders() {
  const [pets, setPets] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [upcomingVaccines, setUpcomingVaccines] = useState([]);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      // Fetch vaccination records and pets concurrently
      const [vaccinesData, petsData] = await Promise.all([
        VaccinationRecord.list("-next_due_date", 200),
        Pet.list()
      ]);
      
      setVaccines(Array.isArray(vaccinesData) ? vaccinesData : []);
      setPets(Array.isArray(petsData) ? petsData : []);
      
      if (petsData.length > 0) {
        setSelectedPet(petsData[0]);
      } else {
        setSelectedPet(null);
      }

      // Calculate upcoming vaccines based on all records and pets
      const upcoming = (Array.isArray(vaccinesData) ? vaccinesData : [])
        .filter(record => {
          if (!record.next_due_date) return false;
          const daysUntil = differenceInDays(parseISO(record.next_due_date), new Date());
          return daysUntil >= -30 && daysUntil <= 90;
        })
        .map(record => ({
          ...record,
          pet: petsData.find(p => p.id === record.pet_id),
          daysUntil: differenceInDays(parseISO(record.next_due_date), new Date())
        }))
        .sort((a, b) => a.daysUntil - b.daysUntil);

      setUpcomingVaccines(upcoming);
    } catch (err) {
      console.error("Error loading vaccine data:", err);
      
      if (handleAuthError(err)) {
        return;
      }
      
      setError(getFriendlyErrorMessage(err));
      setPets([]);
      setVaccines([]);
      setUpcomingVaccines([]);
      setUser(null);
      setSelectedPet(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (recordId) => {
    setRecordToDelete(recordId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!recordToDelete) return;

    try {
      await VaccinationRecord.delete(recordToDelete);
      await loadData();
    } catch (error) {
      console.error("Error deleting vaccine record:", error);
      if (handleAuthError(error)) {
        return;
      }
      setError(getFriendlyErrorMessage(error));
    } finally {
      setDeleteDialogOpen(false);
      setRecordToDelete(null);
    }
  };

  const getStatusColor = (daysUntil) => {
    if (daysUntil < 0) return "text-red-600 bg-red-50 border-red-200";
    if (daysUntil <= 30) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-blue-600 bg-blue-50 border-blue-200";
  };

  const getStatusText = (daysUntil) => {
    if (daysUntil < 0) return `${Math.abs(daysUntil)} days overdue`;
    if (daysUntil === 0) return "Due today";
    return `Due in ${daysUntil} days`;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center p-4">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadData} className="bg-red-500 hover:bg-red-600">Try Again</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vaccine information...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Vaccine Reminders - Never Miss a Vaccination | Pet Decoder AI"
        description="Track your pet's vaccination schedule with intelligent reminders. Research-based schedules for dogs and cats."
        noIndex={true}
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Syringe className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Vaccine Reminders
                </h1>
                <p className="text-gray-600">Keep your pets protected with timely vaccinations</p>
              </div>
            </div>
            <Link to={createPageUrl("Settings")}>
              <Button variant="outline" className="border-purple-300">
                <SettingsIcon className="w-4 h-4 mr-2" />
                Manage Vaccine Alerts
              </Button>
            </Link>
          </motion.div>

          {upcomingVaccines.length > 0 && (
            <Card className="border-none shadow-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white mb-8">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-8 h-8 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-xl mb-2">Upcoming Vaccinations</h3>
                    <p className="mb-4">You have {upcomingVaccines.length} vaccination{upcomingVaccines.length !== 1 ? 's' : ''} to schedule</p>
                    <div className="space-y-2">
                      {upcomingVaccines.slice(0, 3).map((vaccine) => (
                        <div key={vaccine.id} className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{vaccine.pet?.name} - {vaccine.vaccine_name}</p>
                              <p className="text-sm opacity-90">{formatLocalDate(vaccine.next_due_date)}</p>
                            </div>
                            <Badge className="bg-white text-purple-700">
                              {getStatusText(vaccine.daysUntil)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {pets.length === 0 ? (
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <PawPrint className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold mb-2">No Pets Added Yet</h3>
                <p className="text-gray-600 mb-6">Add a pet profile to start tracking vaccinations</p>
                <Link to={createPageUrl("PetProfile") + "?add=true"}>
                  <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                    Add Pet Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm mb-6">
                <CardHeader className="border-b border-purple-100">
                  <CardTitle>Select Pet</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {pets.map((pet) => (
                      <Button
                        key={pet.id}
                        variant={selectedPet?.id === pet.id ? "default" : "outline"}
                        onClick={() => setSelectedPet(pet)}
                        className={selectedPet?.id === pet.id 
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white h-auto py-4"
                          : "border-purple-200 hover:bg-purple-50 h-auto py-4"
                        }
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-1">{pet.species === "dog" ? "🐕" : "🐈"}</div>
                          <div className="font-semibold">{pet.name}</div>
                          {vaccines.filter(r => r.pet_id === pet.id).length > 0 && (
                            <Badge className="mt-2 bg-green-100 text-green-700 text-xs">
                              {vaccines.filter(r => r.pet_id === pet.id).length} records
                            </Badge>
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {selectedPet && (
                <VaccineScheduleInfo 
                  species={selectedPet.species} 
                  selectedPetId={selectedPet.id}
                  onRecordAdded={loadData}
                  onRecordDeleted={handleDelete}
                />
              )}
            </>
          )}

          <Card className="border-none shadow-xl bg-blue-50 mt-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-2">Important Reminders:</p>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Always consult your veterinarian for personalized vaccination schedules</li>
                    <li>Keep vaccination records updated for boarding and travel requirements</li>
                    <li>Some vaccines require annual boosters, others every 3 years</li>
                    <li>Vaccine requirements may vary based on your location and lifestyle</li>
                    <li>You can enable/disable vaccine alerts in your Settings</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vaccine Record?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this vaccination record and cannot be undone. Are you sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRecordToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </>
  );
}
