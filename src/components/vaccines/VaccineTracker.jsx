import React, { useState, useEffect } from "react";
import { VaccinationRecord } from "@/api/entities";
import { Pet } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Save, X, Syringe, Calendar, AlertTriangle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { differenceInDays, format, addYears, addMonths, parseISO } from "date-fns";
import { formatLocalDate } from "../utils/dateFormatter";

export default function VaccineTracker({ petId }) {
  const [records, setRecords] = useState([]);
  const [pet, setPet] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRecord, setCurrentRecord] = useState({
    vaccine_name: "",
    date_administered: "",
    next_due_date: "",
    veterinarian: "",
    clinic_name: "",
    notes: ""
  });

  useEffect(() => {
    loadData();
  }, [petId]);

  const loadData = async () => {
    try {
      const [recordsData, petsData] = await Promise.all([
        VaccinationRecord.filter({ pet_id: petId }),
        Pet.list()
      ]);
      setRecords(Array.isArray(recordsData) ? recordsData : []);
      setPet(petsData.find(p => p.id === petId));
    } catch (error) {
      console.error("Error loading vaccination records:", error);
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateNextDueDate = (vaccineName, dateAdministered, petBirthday) => {
    const adminDate = parseISO(dateAdministered);
    const petAge = petBirthday ? differenceInDays(adminDate, parseISO(petBirthday)) / 365 : null;

    // Core vaccines for puppies/kittens
    if (petAge !== null && petAge < 0.5) {
      // If administered before 16 weeks, next dose in 3-4 weeks
      if (vaccineName === "DHPP" || vaccineName === "FVRCP") {
        return format(addMonths(adminDate, 1), 'yyyy-MM-dd');
      }
    }

    // Standard booster schedules
    switch (vaccineName) {
      case "DHPP":
      case "FVRCP":
        // After initial puppy/kitten series, annual or triennial
        return format(addYears(adminDate, 1), 'yyyy-MM-dd');
      
      case "Rabies":
        // First booster at 1 year, then 1-3 years depending on vaccine
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const recordData = {
        ...currentRecord,
        pet_id: petId,
        reminder_sent: false
      };

      // Auto-calculate next due date if not provided
      if (!recordData.next_due_date && recordData.date_administered) {
        recordData.next_due_date = calculateNextDueDate(
          recordData.vaccine_name,
          recordData.date_administered,
          pet?.birthday
        );
      }

      if (editingRecord) {
        await VaccinationRecord.update(editingRecord.id, recordData);
      } else {
        await VaccinationRecord.create(recordData);
      }

      setShowForm(false);
      setEditingRecord(null);
      setCurrentRecord({
        vaccine_name: "",
        date_administered: "",
        next_due_date: "",
        veterinarian: "",
        clinic_name: "",
        notes: ""
      });
      loadData();
    } catch (error) {
      console.error("Error saving vaccination record:", error);
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setCurrentRecord({
      vaccine_name: record.vaccine_name,
      date_administered: record.date_administered,
      next_due_date: record.next_due_date || "",
      veterinarian: record.veterinarian || "",
      clinic_name: record.clinic_name || "",
      notes: record.notes || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (recordId) => {
    if (window.confirm("Are you sure you want to delete this vaccination record?")) {
      try {
        await VaccinationRecord.delete(recordId);
        loadData();
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }
  };

  const resetForm = () => {
    setCurrentRecord({
      vaccine_name: "",
      date_administered: "",
      next_due_date: "",
      veterinarian: "",
      clinic_name: "",
      notes: ""
    });
    setEditingRecord(null);
    setShowForm(false);
  };

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    return differenceInDays(parseISO(dueDate), new Date());
  };

  const getStatusBadge = (daysUntil) => {
    if (daysUntil === null) return null;
    
    if (daysUntil < 0) {
      return <Badge className="bg-red-100 text-red-700">Overdue</Badge>;
    } else if (daysUntil <= 30) {
      return <Badge className="bg-amber-100 text-amber-700">Due Soon</Badge>;
    } else if (daysUntil <= 90) {
      return <Badge className="bg-blue-100 text-blue-700">Upcoming</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-700">Up to Date</Badge>;
    }
  };

  const dogVaccines = ["DHPP", "Rabies", "Bordetella", "Leptospirosis", "Lyme", "Canine Influenza"];
  const catVaccines = ["FVRCP", "Rabies", "FeLV"];
  const availableVaccines = pet?.species === "dog" ? dogVaccines : catVaccines;

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Loading vaccination records...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Vaccination Records</h3>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Record
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-purple-100">
                <div className="flex items-center justify-between">
                  <CardTitle>{editingRecord ? "Edit" : "Add"} Vaccination Record</CardTitle>
                  <Button variant="ghost" size="icon" onClick={resetForm}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="vaccine_name">Vaccine Name *</Label>
                      <Select
                        value={currentRecord.vaccine_name}
                        onValueChange={(value) => setCurrentRecord({...currentRecord, vaccine_name: value})}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select vaccine" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableVaccines.map(vaccine => (
                            <SelectItem key={vaccine} value={vaccine}>{vaccine}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="date_administered">Date Administered *</Label>
                      <Input
                        id="date_administered"
                        type="date"
                        value={currentRecord.date_administered}
                        onChange={(e) => setCurrentRecord({...currentRecord, date_administered: e.target.value})}
                        max={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="next_due_date">Next Due Date</Label>
                      <Input
                        id="next_due_date"
                        type="date"
                        value={currentRecord.next_due_date}
                        onChange={(e) => setCurrentRecord({...currentRecord, next_due_date: e.target.value})}
                        placeholder="Auto-calculated if left blank"
                      />
                      <p className="text-xs text-gray-500 mt-1">Leave blank to auto-calculate based on guidelines</p>
                    </div>
                    <div>
                      <Label htmlFor="veterinarian">Veterinarian</Label>
                      <Input
                        id="veterinarian"
                        value={currentRecord.veterinarian}
                        onChange={(e) => setCurrentRecord({...currentRecord, veterinarian: e.target.value})}
                        placeholder="Dr. Smith"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="clinic_name">Clinic Name</Label>
                      <Input
                        id="clinic_name"
                        value={currentRecord.clinic_name}
                        onChange={(e) => setCurrentRecord({...currentRecord, clinic_name: e.target.value})}
                        placeholder="Happy Pets Veterinary Clinic"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={currentRecord.notes}
                        onChange={(e) => setCurrentRecord({...currentRecord, notes: e.target.value})}
                        placeholder="Any additional notes..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-purple-500 to-blue-500">
                      <Save className="w-4 h-4 mr-2" />
                      {editingRecord ? "Update" : "Add"} Record
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {records.length === 0 ? (
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <Syringe className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h4 className="font-bold text-lg mb-2">No Vaccination Records</h4>
              <p className="text-gray-600 mb-4">Start tracking your pet's vaccinations to get timely reminders</p>
              <Button onClick={() => setShowForm(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add First Record
              </Button>
            </CardContent>
          </Card>
        ) : (
          records
            .sort((a, b) => new Date(b.date_administered) - new Date(a.date_administered))
            .map((record) => {
              const daysUntil = getDaysUntilDue(record.next_due_date);
              
              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                            <Syringe className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">{record.vaccine_name}</h4>
                            <p className="text-sm text-gray-600">
                              Administered: {formatLocalDate(record.date_administered)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(daysUntil)}
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(record)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(record.id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>

                      {record.next_due_date && (
                        <div className={`p-3 rounded-lg mb-3 ${
                          daysUntil < 0 ? 'bg-red-50 border border-red-200' :
                          daysUntil <= 30 ? 'bg-amber-50 border border-amber-200' :
                          'bg-green-50 border border-green-200'
                        }`}>
                          <div className="flex items-center gap-2">
                            <Calendar className={`w-4 h-4 ${
                              daysUntil < 0 ? 'text-red-600' :
                              daysUntil <= 30 ? 'text-amber-600' :
                              'text-green-600'
                            }`} />
                            <p className={`text-sm font-semibold ${
                              daysUntil < 0 ? 'text-red-900' :
                              daysUntil <= 30 ? 'text-amber-900' :
                              'text-green-900'
                            }`}>
                              Next due: {formatLocalDate(record.next_due_date)}
                              {daysUntil !== null && (
                                <span className="ml-2">
                                  ({daysUntil < 0 ? `${Math.abs(daysUntil)} days overdue` : 
                                    daysUntil === 0 ? 'Due today' :
                                    `in ${daysUntil} days`})
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      )}

                      {(record.veterinarian || record.clinic_name) && (
                        <div className="text-sm text-gray-600 space-y-1">
                          {record.veterinarian && <p>Veterinarian: {record.veterinarian}</p>}
                          {record.clinic_name && <p>Clinic: {record.clinic_name}</p>}
                        </div>
                      )}

                      {record.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{record.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
        )}
      </div>
    </div>
  );
}