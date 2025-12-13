
import React, { useState, useEffect } from "react";
import { VaccinationRecord } from "@/api/entities";
import { Pet } from "@/api/entities";
import { User } from "@/api/entities"; // Added User import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Syringe, AlertCircle, Info, CheckCircle, Calendar, Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format, addYears, addMonths, addWeeks, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { sendVaccineReminderEmail } from "../utils/emailNotifications"; // Added email utility import

export default function VaccineScheduleInfo({ species, selectedPetId, onRecordAdded }) {
  const [existingRecords, setExistingRecords] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showRecordDialog, setShowRecordDialog] = useState(false);
  const [currentVaccine, setCurrentVaccine] = useState(null);
  const [recordDetails, setRecordDetails] = useState({
    date_administered: format(new Date(), 'yyyy-MM-dd'),
    veterinarian: "",
    clinic_name: "",
    notes: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedPetId]);

  const loadData = async () => {
    try {
      const [recordsData, petsData] = await Promise.all([
        VaccinationRecord.list(),
        Pet.list()
      ]);
      
      setExistingRecords(Array.isArray(recordsData) ? recordsData : []);
      
      if (selectedPetId) {
        const pet = petsData.find(p => p.id === selectedPetId);
        setSelectedPet(pet);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const calculateNextDueDate = (vaccineName, dateAdministered, petBirthday, doseNumber) => {
    const adminDate = parseISO(dateAdministered);
    
    // Calculate pet age at time of administration
    let petAgeInWeeks = null;
    if (petBirthday) {
      const birthDate = parseISO(petBirthday);
      const diffTime = adminDate - birthDate;
      petAgeInWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    }

    // Puppy/Kitten series (first 3 doses)
    if (doseNumber <= 2 && petAgeInWeeks !== null && petAgeInWeeks < 20) {
      // 3-4 weeks between puppy/kitten doses
      return format(addWeeks(adminDate, 3), 'yyyy-MM-dd');
    }

    // After puppy/kitten series or for adult vaccines
    switch (vaccineName) {
      case "DHPP":
      case "FVRCP":
        if (doseNumber === 3) {
          // After completing puppy/kitten series, next booster at 1 year
          return format(addYears(adminDate, 1), 'yyyy-MM-dd');
        }
        // After first adult booster, every 1-3 years (we'll use 1 year as default)
        return format(addYears(adminDate, 1), 'yyyy-MM-dd');
      
      case "Rabies":
        // First booster at 1 year, then 1-3 years
        return format(addYears(adminDate, 1), 'yyyy-MM-dd');
      
      case "Bordetella":
        // Every 6-12 months
        return format(addMonths(adminDate, 6), 'yyyy-MM-dd');
      
      case "Leptospirosis":
      case "Lyme":
      case "Canine Influenza":
      case "FeLV":
        // Annual boosters
        return format(addYears(adminDate, 1), 'yyyy-MM-dd');
      
      default:
        return format(addYears(adminDate, 1), 'yyyy-MM-dd');
    }
  };

  const handleCheckVaccine = (vaccine, scheduleItem) => {
    setCurrentVaccine({ ...vaccine, scheduleItem });
    setRecordDetails({
      date_administered: format(new Date(), 'yyyy-MM-dd'),
      veterinarian: "",
      clinic_name: "",
      notes: ""
    });
    setShowRecordDialog(true);
  };

  const handleSaveRecord = async () => {
    if (!selectedPet || !currentVaccine) return;
    
    setIsSaving(true);
    try {
      // Count existing records for this vaccine to determine dose number
      const existingVaccineRecords = existingRecords.filter(
        r => r.pet_id === selectedPet.id && r.vaccine_name === currentVaccine.name
      );
      const doseNumber = existingVaccineRecords.length;

      // Only calculate next due date for standard vaccines (not "Other")
      let nextDueDate = null;
      if (currentVaccine.name !== "Other") {
        nextDueDate = calculateNextDueDate(
          currentVaccine.name,
          recordDetails.date_administered,
          selectedPet.birthday,
          doseNumber
        );
      }

      const newRecord = await VaccinationRecord.create({
        pet_id: selectedPet.id,
        vaccine_name: currentVaccine.name,
        date_administered: recordDetails.date_administered,
        next_due_date: nextDueDate,
        veterinarian: recordDetails.veterinarian,
        clinic_name: recordDetails.clinic_name,
        notes: recordDetails.notes,
        reminder_sent: false
      });

      // Send immediate email reminder if vaccine is due soon (within 30 days)
      if (nextDueDate) {
        try {
          const user = await User.me(); // Assuming User.me() fetches current user details
          const dueDate = parseISO(nextDueDate);
          const today = new Date();
          const daysUntil = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
          
          if (user && user.email && daysUntil <= 30 && daysUntil >= 0) { // Check if due within 30 days and not overdue
            await sendVaccineReminderEmail(user, selectedPet, newRecord, daysUntil);
          }
        } catch (emailError) {
          console.error('Failed to send vaccine reminder email:', emailError);
          // Don't block the record creation if email fails
        }
      }

      setShowRecordDialog(false);
      setCurrentVaccine(null);
      await loadData();
      if (onRecordAdded) {
        onRecordAdded();
      }
    } catch (error) {
      console.error("Error saving vaccination record:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getVaccineProgress = (vaccineName, totalDoses) => {
    if (!selectedPet) return 0;
    
    const completed = existingRecords.filter(
      r => r.pet_id === selectedPet.id && r.vaccine_name === vaccineName
    ).length;
    
    return Math.min(completed, totalDoses);
  };

  const dogVaccines = [
    {
      name: "DHPP",
      fullName: "Distemper, Hepatitis, Parvovirus, Parainfluenza",
      schedule: [
        { age: "6-8 weeks", dose: "First dose", doseNumber: 0 },
        { age: "10-12 weeks", dose: "Second dose", doseNumber: 1 },
        { age: "14-16 weeks", dose: "Third dose", doseNumber: 2 },
        { age: "1 year", dose: "First booster", doseNumber: 3 },
        { age: "Every 1-3 years", dose: "Booster", doseNumber: 4 }
      ],
      importance: "Critical - Protects against fatal diseases",
      required: true
    },
    {
      name: "Rabies",
      fullName: "Rabies Virus",
      schedule: [
        { age: "14-16 weeks", dose: "Initial dose", doseNumber: 0 },
        { age: "1 year", dose: "First booster", doseNumber: 1 },
        { age: "Every 1-3 years", dose: "Booster", doseNumber: 2 }
      ],
      importance: "Legally required in most states - Fatal disease",
      required: true
    },
    {
      name: "Bordetella",
      fullName: "Kennel Cough",
      schedule: [
        { age: "8 weeks+", dose: "Initial dose", doseNumber: 0 },
        { age: "Every 6-12 months", dose: "Booster", doseNumber: 1 }
      ],
      importance: "Recommended for dogs in boarding, daycare, or dog parks",
      required: false
    },
    {
      name: "Leptospirosis",
      fullName: "Leptospira bacteria",
      schedule: [
        { age: "12 weeks+", dose: "Initial series (2 doses, 2-4 weeks apart)", doseNumber: 0 },
        { age: "Annually", dose: "Booster", doseNumber: 1 }
      ],
      importance: "Recommended in areas with wildlife or standing water",
      required: false
    },
    {
      name: "Lyme",
      fullName: "Borrelia burgdorferi",
      schedule: [
        { age: "12 weeks+", dose: "Initial series (2 doses, 2-4 weeks apart)", doseNumber: 0 },
        { age: "Annually", dose: "Booster", doseNumber: 1 }
      ],
      importance: "Recommended in tick-endemic regions",
      required: false
    },
    {
      name: "Canine Influenza",
      fullName: "H3N8 and H3N2",
      schedule: [
        { age: "6-8 weeks+", dose: "Initial series (2 doses, 2-4 weeks apart)", doseNumber: 0 },
        { age: "Annually", dose: "Booster", doseNumber: 1 }
      ],
      importance: "Recommended for dogs in high-risk environments",
      required: false
    },
    {
      name: "Other",
      fullName: "Other Vaccine (specify in notes)",
      schedule: [
        { age: "As prescribed", dose: "Record vaccination", doseNumber: 0 }
      ],
      importance: "Track any other vaccines prescribed by your veterinarian",
      required: false
    }
  ];

  const catVaccines = [
    {
      name: "FVRCP",
      fullName: "Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia",
      schedule: [
        { age: "6-8 weeks", dose: "First dose", doseNumber: 0 },
        { age: "10-12 weeks", dose: "Second dose", doseNumber: 1 },
        { age: "14-16 weeks", dose: "Third dose", doseNumber: 2 },
        { age: "1 year", dose: "First booster", doseNumber: 3 },
        { age: "Every 1-3 years", dose: "Booster", doseNumber: 4 }
      ],
      importance: "Critical - Protects against common feline diseases",
      required: true
    },
    {
      name: "Rabies",
      fullName: "Rabies Virus",
      schedule: [
        { age: "14-16 weeks", dose: "Initial dose", doseNumber: 0 },
        { age: "1 year", dose: "First booster", doseNumber: 1 },
        { age: "Every 1-3 years", dose: "Booster", doseNumber: 2 }
      ],
      importance: "Legally required in most states - Fatal disease",
      required: true
    },
    {
      name: "FeLV",
      fullName: "Feline Leukemia Virus",
      schedule: [
        { age: "8 weeks", dose: "First dose", doseNumber: 0 },
        { age: "12 weeks", dose: "Second dose", doseNumber: 1 },
        { age: "Annually", dose: "Booster for outdoor/at-risk cats", doseNumber: 2 }
      ],
      importance: "Strongly recommended for outdoor cats or multi-cat households",
      required: false
    },
    {
      name: "Other",
      fullName: "Other Vaccine (specify in notes)",
      schedule: [
        { age: "As prescribed", dose: "Record vaccination", doseNumber: 0 }
      ],
      importance: "Track any other vaccines prescribed by your veterinarian",
      required: false
    }
  ];

  const vaccines = species === "dog" ? dogVaccines : catVaccines;

  if (!selectedPet) {
    return (
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          Please select a pet to view their vaccination schedule.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          <strong>Track {selectedPet.name}'s vaccinations:</strong> Check off vaccines as they're administered. The system will automatically calculate the next due date and create reminders.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {vaccines.map((vaccine) => {
          const progress = getVaccineProgress(vaccine.name, vaccine.schedule.length);
          const progressPercentage = (progress / vaccine.schedule.length) * 100;

          return (
            <Card key={vaccine.name} className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-purple-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Syringe className="w-5 h-5 text-purple-600" />
                      <CardTitle className="text-lg">{vaccine.name}</CardTitle>
                      <Badge className={vaccine.required ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}>
                        {vaccine.required ? "Core/Required" : "Optional"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{vaccine.fullName}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">{progress}/{vaccine.schedule.length}</div>
                    <div className="text-xs text-gray-500">Doses</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm font-semibold text-purple-900">{vaccine.importance}</p>
                </div>
                
                <div className="space-y-3">
                  <p className="font-semibold text-gray-900 mb-3">Vaccination Schedule:</p>
                  {vaccine.schedule.map((item, index) => {
                    const petRecords = existingRecords.filter(
                      r => r.pet_id === selectedPet.id && r.vaccine_name === vaccine.name
                    );
                    const isCompleted = petRecords.length > index;
                    const record = petRecords[index];

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                          isCompleted ? 'bg-green-50 border border-green-200' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <Checkbox
                          checked={isCompleted}
                          onCheckedChange={() => !isCompleted && handleCheckVaccine(vaccine, item)}
                          className="mt-1"
                          disabled={isCompleted}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {item.age}
                            </Badge>
                            {isCompleted && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                          <p className={`text-sm mt-1 ${isCompleted ? 'text-green-900 font-medium' : 'text-gray-700'}`}>
                            {item.dose}
                          </p>
                          {isCompleted && record && (
                            <div className="mt-2 text-xs text-green-700">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>Administered: {format(parseISO(record.date_administered), 'MMM d, yyyy')}</span>
                              </div>
                              {record.next_due_date && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>Next due: {format(parseISO(record.next_due_date), 'MMM d, yyyy')}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {!isCompleted && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCheckVaccine(vaccine, item)}
                            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Record
                          </Button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Alert className="border-amber-200 bg-amber-50">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-900">
          <strong>Important:</strong> This schedule is based on AAHA and AAFP guidelines. Always consult with your veterinarian for personalized recommendations based on {selectedPet.name}'s lifestyle, location, and health status.
        </AlertDescription>
      </Alert>

      {/* Record Vaccination Dialog */}
      <Dialog open={showRecordDialog} onOpenChange={setShowRecordDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Vaccination</DialogTitle>
            <DialogDescription>
              Record {currentVaccine?.name} vaccination for {selectedPet?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="date">Date Administered *</Label>
              <Input
                id="date"
                type="date"
                value={recordDetails.date_administered}
                onChange={(e) => setRecordDetails({...recordDetails, date_administered: e.target.value})}
                max={format(new Date(), 'yyyy-MM-dd')}
                className="border-purple-200"
              />
            </div>
            
            <div>
              <Label htmlFor="vet">Veterinarian</Label>
              <Input
                id="vet"
                value={recordDetails.veterinarian}
                onChange={(e) => setRecordDetails({...recordDetails, veterinarian: e.target.value})}
                placeholder="Dr. Smith"
                className="border-purple-200"
              />
            </div>
            
            <div>
              <Label htmlFor="clinic">Clinic Name</Label>
              <Input
                id="clinic"
                value={recordDetails.clinic_name}
                onChange={(e) => setRecordDetails({...recordDetails, clinic_name: e.target.value})}
                placeholder="Happy Pets Veterinary Clinic"
                className="border-purple-200"
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={recordDetails.notes}
                onChange={(e) => setRecordDetails({...recordDetails, notes: e.target.value})}
                placeholder="Any additional notes..."
                rows={3}
                className="border-purple-200"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRecordDialog(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveRecord} 
              disabled={isSaving}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              {isSaving ? "Saving..." : "Save Record"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
