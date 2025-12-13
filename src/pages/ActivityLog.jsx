import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Pet } from "@/api/entities";
import { User } from "@/api/entities";
import { ActivityLog as ActivityLogEntity } from "@/api/entities";
import { Activity as ActivityIcon, Plus, Save, X, AlertCircle, Edit, Trash2, Clock, Filter, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import SEO from "../components/common/SEO";
import { Badge } from "@/components/ui/badge";
import { validateActivityLog, sanitizeString } from "../components/utils/validation";
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

export default function ActivityLog() {
  const [activities, setActivities] = useState([]);
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState("all");
  const [selectedActivityType, setSelectedActivityType] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);

  const [formData, setFormData] = useState({
    pet_id: "",
    activity_type: "feeding",
    duration: "",
    notes: "",
    mood: "neutral",
    date: new Date().toISOString().split('T')[0]
  });

  const activityColors = {
    feeding: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    walk: 'bg-green-100 text-green-700 border-green-300',
    play: 'bg-blue-100 text-blue-700 border-blue-300',
    sleep: 'bg-purple-100 text-purple-700 border-purple-300',
    grooming: 'bg-pink-100 text-pink-700 border-pink-300',
    medication: 'bg-red-100 text-red-700 border-red-300',
    vet: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    other: 'bg-gray-100 text-gray-700 border-gray-300'
  };

  const activityIcons = {
    feeding: '🍽️',
    walk: '🚶',
    play: '🎾',
    sleep: '😴',
    grooming: '✨',
    medication: '💊',
    vet: '🏥',
    other: '📝'
  };

  const moodColors = {
    happy: 'bg-green-100 text-green-700 border-green-300',
    playful: 'bg-blue-100 text-blue-700 border-blue-300',
    neutral: 'bg-gray-100 text-gray-700 border-gray-300',
    tired: 'bg-purple-100 text-purple-700 border-purple-300',
    anxious: 'bg-orange-100 text-orange-700 border-orange-300',
    aggressive: 'bg-red-100 text-red-700 border-red-300'
  };

  const moodIcons = {
    happy: '😊',
    playful: '🎉',
    neutral: '😐',
    tired: '😴',
    anxious: '😰',
    aggressive: '😠'
  };

  const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getPetById = (petId) => {
    if (!Array.isArray(pets) || pets.length === 0) return null;
    return pets.find(p => p && p.id === petId) || null;
  };

  const formatLocalDateTime = (dateString) => {
    if (!dateString) return '';
    try {
      return format(parseISO(dateString), "MMM dd, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await User.me();

      const [activitiesData, petsData] = await Promise.all([
        ActivityLogEntity.list("-date", 500),
        Pet.list()
      ]);

      setActivities(Array.isArray(activitiesData) ? activitiesData : []);
      setPets(Array.isArray(petsData) ? petsData : []);

      if (petsData.length > 0 && !formData.pet_id) {
        setFormData(prev => ({ ...prev, pet_id: petsData[0].id }));
      } else if (petsData.length === 0) {
        setFormData(prev => ({ ...prev, pet_id: "" }));
      }
    } catch (err) {
      console.error("Error loading activity log:", err);
      
      if (handleAuthError(err)) {
        return; 
      }
      
      setError(getFriendlyErrorMessage(err));
      setActivities([]);
      setPets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    const sanitizedValue = typeof value === 'string' ? sanitizeString(value) : value;
    
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const resetForm = () => {
    setFormData({
      pet_id: pets.length > 0 ? pets[0].id : "",
      activity_type: "feeding",
      duration: "",
      notes: "",
      mood: "neutral",
      date: new Date().toISOString().split('T')[0]
    });
    setErrors({});
    setSaveError(null);
    setEditingActivity(null);
  };

  const handleSave = async () => {
    setSaveError(null);
    setErrors({});

    const validation = validateActivityLog(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSaving(true);
    try {
      const activityData = {
        ...formData,
        duration: formData.duration ? parseFloat(formData.duration) : 0
      };

      if (editingActivity) {
        await ActivityLogEntity.update(editingActivity.id, activityData);
      } else {
        await ActivityLogEntity.create(activityData);
      }

      await loadData();
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error("Error saving activity:", err);
      if (handleAuthError(err)) {
        return;
      }
      setSaveError(getFriendlyErrorMessage(err, "Failed to save activity. Please try again."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setFormData({
      pet_id: activity.pet_id,
      activity_type: activity.activity_type,
      duration: activity.duration?.toString() || "",
      notes: activity.notes || "",
      mood: activity.mood || "neutral",
      date: activity.date
    });
    setShowForm(true);
    setErrors({});
    setSaveError(null);
  };

  const handleDelete = (activityId) => {
    setActivityToDelete(activityId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!activityToDelete) return;

    try {
      await ActivityLogEntity.delete(activityToDelete);
      await loadData();
    } catch (error) {
      console.error("Error deleting activity:", error);
      if (handleAuthError(error)) {
        return;
      }
      setError(getFriendlyErrorMessage(error));
    } finally {
      setDeleteDialogOpen(false);
      setActivityToDelete(null);
    }
  };

  const filteredActivities = useMemo(() => {
    let filtered = [...activities];

    if (selectedPet !== "all") {
      filtered = filtered.filter(a => a.pet_id === selectedPet);
    }

    if (selectedActivityType !== "all") {
      filtered = filtered.filter(a => a.activity_type === selectedActivityType);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "newest" 
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });

    return filtered;
  }, [activities, selectedPet, selectedActivityType, sortOrder]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Activity Log - Pet Decoder AI"
        description="Track your pet's daily activities, moods, and routines"
      />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
                <ActivityIcon className="w-8 h-8 md:w-10 md:h-10 text-purple-600" />
                Activity Log
              </h1>
              <p className="text-gray-600 mt-2">Track your pet's daily activities and routines</p>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Log Activity
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {pets.length === 0 && (
            <Alert className="mb-6">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                You need to add a pet first before logging activities.
              </AlertDescription>
            </Alert>
          )}

          <AnimatePresence>
            {showForm && pets.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="mb-8 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{editingActivity ? 'Edit Activity' : 'Log New Activity'}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setShowForm(false);
                          resetForm();
                        }}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {saveError && (
                      <Alert variant="destructive">
                        <AlertCircle className="w-4 h-4" />
                        <AlertDescription>{saveError}</AlertDescription>
                      </Alert>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pet">Pet *</Label>
                        <Select
                          value={formData.pet_id}
                          onValueChange={(value) => handleInputChange("pet_id", value)}
                        >
                          <SelectTrigger id="pet" className={errors.pet_id ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select a pet" />
                          </SelectTrigger>
                          <SelectContent>
                            {pets.map(pet => (
                              <SelectItem key={pet.id} value={pet.id}>
                                {pet.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.pet_id && <p className="text-sm text-red-500 mt-1">{errors.pet_id}</p>}
                      </div>

                      <div>
                        <Label htmlFor="activity_type">Activity Type *</Label>
                        <Select
                          value={formData.activity_type}
                          onValueChange={(value) => handleInputChange("activity_type", value)}
                        >
                          <SelectTrigger id="activity_type">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="feeding">🍽️ Feeding</SelectItem>
                            <SelectItem value="walk">🚶 Walk</SelectItem>
                            <SelectItem value="play">🎾 Play</SelectItem>
                            <SelectItem value="sleep">😴 Sleep</SelectItem>
                            <SelectItem value="grooming">✨ Grooming</SelectItem>
                            <SelectItem value="medication">💊 Medication</SelectItem>
                            <SelectItem value="vet">🏥 Vet Visit</SelectItem>
                            <SelectItem value="other">📝 Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="date">Date *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => handleInputChange("date", e.target.value)}
                          max={new Date().toISOString().split('T')[0]}
                          className={errors.date ? "border-red-500" : ""}
                        />
                        {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date}</p>}
                      </div>

                      <div>
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input
                          id="duration"
                          type="number"
                          min="0"
                          max="1440"
                          value={formData.duration}
                          onChange={(e) => handleInputChange("duration", e.target.value)}
                          placeholder="Optional"
                          className={errors.duration ? "border-red-500" : ""}
                        />
                        {errors.duration && <p className="text-sm text-red-500 mt-1">{errors.duration}</p>}
                      </div>

                      <div>
                        <Label htmlFor="mood">Mood</Label>
                        <Select
                          value={formData.mood}
                          onValueChange={(value) => handleInputChange("mood", value)}
                        >
                          <SelectTrigger id="mood">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="happy">😊 Happy</SelectItem>
                            <SelectItem value="playful">🎉 Playful</SelectItem>
                            <SelectItem value="neutral">😐 Neutral</SelectItem>
                            <SelectItem value="tired">😴 Tired</SelectItem>
                            <SelectItem value="anxious">😰 Anxious</SelectItem>
                            <SelectItem value="aggressive">😠 Aggressive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        placeholder="Any additional details..."
                        rows={3}
                        maxLength={500}
                        className={errors.notes ? "border-red-500" : ""}
                      />
                      {errors.notes && <p className="text-sm text-red-500 mt-1">{errors.notes}</p>}
                      <p className="text-xs text-gray-500 mt-1">{formData.notes.length}/500 characters</p>
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowForm(false);
                          resetForm();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-gradient-to-r from-purple-600 to-blue-600"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            {editingActivity ? 'Update' : 'Save'} Activity
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {activities.length > 0 && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="filter-pet" className="text-sm">Filter by Pet</Label>
                    <Select value={selectedPet} onValueChange={setSelectedPet}>
                      <SelectTrigger id="filter-pet">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Pets</SelectItem>
                        {pets.map(pet => (
                          <SelectItem key={pet.id} value={pet.id}>{pet.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1">
                    <Label htmlFor="filter-activity" className="text-sm">Filter by Activity</Label>
                    <Select value={selectedActivityType} onValueChange={setSelectedActivityType}>
                      <SelectTrigger id="filter-activity">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Activities</SelectItem>
                        <SelectItem value="feeding">Feeding</SelectItem>
                        <SelectItem value="walk">Walk</SelectItem>
                        <SelectItem value="play">Play</SelectItem>
                        <SelectItem value="sleep">Sleep</SelectItem>
                        <SelectItem value="grooming">Grooming</SelectItem>
                        <SelectItem value="medication">Medication</SelectItem>
                        <SelectItem value="vet">Vet Visit</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1">
                    <Label htmlFor="sort-order" className="text-sm">Sort By</Label>
                    <Select value={sortOrder} onValueChange={setSortOrder}>
                      <SelectTrigger id="sort-order">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {filteredActivities.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <ActivityIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Activities Yet</h3>
                <p className="text-gray-500 mb-6">
                  {activities.length === 0 && pets.length > 0
                    ? "Start logging your pet's daily activities to track their routines and health."
                    : "No activities match your current filters."}
                </p>
                {pets.length > 0 && activities.length === 0 && (
                  <Button
                    onClick={() => {
                      resetForm();
                      setShowForm(true);
                    }}
                    className="bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Log Your First Activity
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence>
                {filteredActivities.map((activity) => {
                  const pet = getPetById(activity.pet_id);
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="text-4xl flex-shrink-0">
                                {activityIcons[activity.activity_type]}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-lg">
                                    {capitalizeFirst(activity.activity_type)}
                                  </h3>
                                  <Badge className={activityColors[activity.activity_type]}>
                                    {capitalizeFirst(activity.activity_type)}
                                  </Badge>
                                  <Badge className={moodColors[activity.mood]}>
                                    {moodIcons[activity.mood]} {capitalizeFirst(activity.mood)}
                                  </Badge>
                                </div>
                                
                                <div className="text-sm text-gray-600 space-y-1">
                                  <p className="font-medium">{pet?.name || "Unknown Pet"}</p>
                                  <p className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {formatLocalDateTime(activity.date)}
                                    {activity.duration > 0 && ` • ${activity.duration} minutes`}
                                  </p>
                                  {activity.notes && (
                                    <p className="text-gray-700 mt-2 line-clamp-2">{activity.notes}</p>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2 md:flex-col">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleEdit(activity)}
                                className="hover:bg-blue-50"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleDelete(activity.id)}
                                className="hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Activity?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this activity log entry and cannot be undone. Are you sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setActivityToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}