
import React, { useState, useEffect } from "react";
import { Pet } from "@/api/entities";
import { User } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit2, Trash2, Save, X, Heart, LogIn, Upload, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { validatePetProfile, sanitizeString, isValidFileType, isValidFileSize } from "@/components/utils/validation";
import { handleAuthError, getFriendlyErrorMessage } from "@/components/utils/errorHandler";
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

import PetCard from "../components/profile/PetCard";
import SEO from "../components/common/SEO";

// Constants for image compression
const MAX_IMAGE_WIDTH = 800;
const MAX_IMAGE_HEIGHT = 800;
const IMAGE_QUALITY = 0.85; // JPEG quality from 0 to 1

// Image compression utility
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > MAX_IMAGE_WIDTH) {
            height = (height * MAX_IMAGE_WIDTH) / width;
            width = MAX_IMAGE_WIDTH;
          }
        } else {
          if (height > MAX_IMAGE_HEIGHT) {
            width = (width * MAX_IMAGE_HEIGHT) / height;
            height = MAX_IMAGE_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        // Draw image, then crop if needed to maintain aspect ratio without stretching
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create a new File object with the compressed blob
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg', // Force JPEG for compression quality
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          'image/jpeg',
          IMAGE_QUALITY
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export default function PetProfile() {
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [currentPet, setCurrentPet] = useState({
    name: "",
    species: "dog",
    breed: "",
    birthday: "",
    gender: "",
    photo_url: ""
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [errors, setErrors] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);

  useEffect(() => {
    checkAuthAndLoadPets();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('add') === 'true') {
      setShowForm(true);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const checkAuthAndLoadPets = async () => {
    setIsLoading(true);
    setErrors({}); // Clear any previous errors
    
    try {
      await User.me();
      setIsAuthenticated(true);
      await loadPets();
    } catch (error) {
      console.error("User not authenticated or session expired:", error);
      
      // Handle auth errors - this will redirect
      if (handleAuthError(error)) {
        return;
      }
      
      // Not authenticated
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const loadPets = async () => {
    try {
      const petsData = await Pet.list();
      setPets(petsData);
    } catch (error) {
      console.error("Error loading pets:", error);
      
      // Handle auth errors - this will redirect
      if (handleAuthError(error)) {
        return;
      }
      
      // Show user-friendly error
      setErrors({ general: getFriendlyErrorMessage(error) });
    } finally {
      setIsLoading(false); // Ensure isLoading is always reset
    }
  };

  const handleLogin = async () => {
    try {
      await User.login();
      await checkAuthAndLoadPets();
    } catch (err) {
      console.error("Login failed:", err);
      setErrors({ general: "Failed to sign in. Please try again." });
    }
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setPhotoFile(null);
      setPhotoPreview(currentPet.photo_url || null);
      setErrors({ ...errors, photo: null });
      return;
    }

    // Validate file type
    if (!isValidFileType(file, ['image/'])) {
      setErrors({ ...errors, photo: "Please select an image file (JPG, PNG, GIF, etc.)" });
      setPhotoFile(null);
      setPhotoPreview(currentPet.photo_url || null);
      return;
    }

    // Validate file size (10MB) - Compression will happen later
    if (!isValidFileSize(file, 10)) {
      setErrors({ ...errors, photo: "Image file is too large. Please select an image under 10MB." });
      setPhotoFile(null);
      setPhotoPreview(currentPet.photo_url || null);
      return;
    }

    setPhotoFile(file);
    setErrors({ ...errors, photo: null });
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (field, value) => {
    setCurrentPet(prev => ({ ...prev, [field]: sanitizeString(value) }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrors({});

    // Validate form
    const validation = validatePetProfile(currentPet);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSaving(false);
      return;
    }

    try {
      let photoUrl = currentPet.photo_url;

      if (photoFile) {
        setIsUploadingPhoto(true);
        try {
          let fileToUpload = photoFile;
          // Apply image compression if it's an image file
          if (photoFile.type.startsWith('image/')) {
            try {
              fileToUpload = await compressImage(photoFile);
              console.log(`Image compressed: ${Math.round(photoFile.size / 1024)}KB → ${Math.round(fileToUpload.size / 1024)}KB`);
            } catch (compressionError) {
              console.warn('Image compression failed, uploading original:', compressionError);
              // Continue with original file if compression fails
            }
          }
          
          const { file_url } = await UploadFile({ file: fileToUpload });
          photoUrl = file_url;
        } catch (uploadError) {
          console.error("Error uploading photo:", uploadError);
          setErrors({ photo: "Failed to upload photo. Please try again." });
          setIsSaving(false);
          setIsUploadingPhoto(false);
          return;
        }
        setIsUploadingPhoto(false);
      }

      const petData = {
        ...currentPet,
        photo_url: photoUrl
      };

      if (editingPet) {
        await Pet.update(editingPet.id, petData);
      } else {
        await Pet.create(petData);
      }
      
      setShowForm(false);
      setEditingPet(null);
      setCurrentPet({ name: "", species: "dog", breed: "", birthday: "", gender: "", photo_url: "" });
      setPhotoFile(null);
      setPhotoPreview(null);
      await loadPets();
    } catch (err) {
      console.error("Error saving pet:", err);
      if (handleAuthError(err)) { // Check for auth error during save
        return;
      }
      setErrors({ general: getFriendlyErrorMessage(err, "Failed to save pet profile. Please try again.") });
    } finally {
      setIsSaving(false);
      setIsUploadingPhoto(false);
    }
  };

  const handleEdit = (pet) => {
    setEditingPet(pet);
    setCurrentPet({
      name: pet.name,
      species: pet.species,
      breed: pet.breed || "",
      gender: pet.gender || "",
      birthday: pet.birthday || "",
      photo_url: pet.photo_url || ""
    });
    setPhotoPreview(pet.photo_url || null);
    setPhotoFile(null);
    setShowForm(true);
    setErrors({});
  };

  const handleDelete = (pet) => {
    setPetToDelete(pet);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!petToDelete) return;

    try {
      await Pet.delete(petToDelete.id);
      await loadPets();
    } catch (err) {
      if (handleAuthError(err)) {
        return;
      }
      setErrors({ general: getFriendlyErrorMessage(err, "Failed to delete pet. Please try again.") });
    } finally {
      setDeleteDialogOpen(false);
      setPetToDelete(null);
    }
  };

  const resetForm = () => {
    setCurrentPet({ name: "", species: "dog", breed: "", birthday: "", gender: "", photo_url: "" });
    setEditingPet(null);
    setShowForm(false);
    setPhotoFile(null);
    setPhotoPreview(null);
    setErrors({});
  };

  const handleAddNewPet = () => {
    resetForm();
    setShowForm(true);
  };

  if (!isAuthenticated) {
    return (
      <>
        <SEO
          title="Pet Profiles - Manage Your Pets | Pet Decoder AI"
          description="Create and manage profiles for all your pets. Track individual behavioral patterns and get personalized insights for each furry friend."
          noIndex={true}
        />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
          <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-sm max-w-md w-full">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-900">
                Sign In Required
              </h2>
              <p className="text-gray-600 mb-8">
                Please sign in to manage your pet profiles
              </p>
              {errors.general && (
                <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}
              <Button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Pet Profiles - Manage Your Pets | Pet Decoder AI"
        description="Create and manage profiles for all your pets. Track individual behavioral patterns and get personalized insights for each furry friend."
        noIndex={true}
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Pet Profiles
              </h1>
              <p className="text-gray-600 mt-2">Manage your furry friends</p>
            </div>
            <Button
              onClick={handleAddNewPet}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Pet
            </Button>
          </motion.div>

          {errors.general && (
            <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm mb-6">
                  <CardHeader className="border-b border-purple-100">
                    <CardTitle className="flex items-center justify-between">
                      <span>{editingPet ? "Edit Pet" : "Add New Pet"}</span>
                      <Button variant="ghost" size="icon" onClick={resetForm} aria-label="Close form">
                        <X className="w-5 h-5" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                      {/* Photo Upload Section */}
                      <div className="border-2 border-dashed border-purple-200 rounded-xl p-6 bg-purple-50/50">
                        <Label className="text-base font-semibold mb-3 block">Pet Photo (Recommended)</Label>
                        <p className="text-sm text-gray-600 mb-4">
                          Upload a clear photo of your pet. Our AI will use this to identify your pet in videos with multiple animals and provide more personalized insights.
                        </p>
                        
                        <div className="flex flex-col items-center gap-4">
                          {photoPreview ? (
                            <div className="relative">
                              <img
                                src={photoPreview}
                                alt="Pet preview"
                                className="w-48 h-48 object-cover rounded-xl shadow-lg"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setPhotoFile(null);
                                  setPhotoPreview(null);
                                  setCurrentPet({...currentPet, photo_url: ""});
                                }}
                                className="absolute top-2 right-2 rounded-full p-2 h-8 w-8"
                                disabled={isSaving || isUploadingPhoto}
                                aria-label="Remove photo"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-gray-200">
                              <ImageIcon className="w-16 h-16 text-gray-400" />
                            </div>
                          )}
                          
                          <div>
                            <Input
                              id="pet-photo"
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoSelect}
                              className="hidden"
                              disabled={isSaving || isUploadingPhoto}
                              aria-describedby="photo-error"
                            />
                            <Label
                              htmlFor="pet-photo"
                              className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors ${isSaving || isUploadingPhoto ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <Upload className="w-4 h-4" />
                              {photoPreview ? 'Change Photo' : 'Upload Photo'}
                            </Label>
                          </div>
                          
                          {errors.photo && (
                            <p className="text-sm text-red-600" id="photo-error" role="alert">
                              {errors.photo}
                            </p>
                          )}
                          
                          {isUploadingPhoto && (
                            <div className="flex items-center gap-2 text-purple-600">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span className="text-sm">Uploading photo...</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Rest of the form */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Pet Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={currentPet.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="e.g., Buddy"
                            className={`border-purple-200 focus:border-purple-400 ${errors.name ? 'border-red-300' : ''}`}
                            disabled={isSaving || isUploadingPhoto}
                            required
                            aria-invalid={errors.name ? 'true' : 'false'}
                            aria-describedby="name-error"
                          />
                          {errors.name && (
                            <p className="text-sm text-red-600 mt-1" id="name-error" role="alert">
                              {errors.name}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="species">Species *</Label>
                          <Select
                            value={currentPet.species}
                            onValueChange={(value) => handleInputChange('species', value)}
                            disabled={isSaving || isUploadingPhoto}
                          >
                            <SelectTrigger className={`border-purple-200 ${errors.species ? 'border-red-300' : ''}`} id="species">
                              <SelectValue placeholder="Select species" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dog">🐕 Dog</SelectItem>
                              <SelectItem value="cat">🐈 Cat</SelectItem>
                              <SelectItem value="other">🐾 Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.species && (
                            <p className="text-sm text-red-600 mt-1" role="alert">
                              {errors.species}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="breed">Breed</Label>
                          <Input
                            id="breed"
                            name="breed"
                            value={currentPet.breed}
                            onChange={(e) => handleInputChange('breed', e.target.value)}
                            placeholder="e.g., Golden Retriever"
                            className={`border-purple-200 focus:border-purple-400 ${errors.breed ? 'border-red-300' : ''}`}
                            disabled={isSaving || isUploadingPhoto}
                            aria-describedby="breed-error"
                          />
                          {errors.breed && (
                            <p className="text-sm text-red-600 mt-1" id="breed-error" role="alert">
                              {errors.breed}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="gender">Gender</Label>
                          <Select
                            value={currentPet.gender || "unknown"}
                            onValueChange={(value) => handleInputChange('gender', value)}
                            disabled={isSaving || isUploadingPhoto}
                          >
                            <SelectTrigger className="border-purple-200" id="gender">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">♂️ Male</SelectItem>
                              <SelectItem value="female">♀️ Female</SelectItem>
                              <SelectItem value="unknown">❓ Unknown</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="birthday">Birthday</Label>
                          <Input
                            id="birthday"
                            name="birthday"
                            type="date"
                            value={currentPet.birthday}
                            onChange={(e) => handleInputChange('birthday', e.target.value)}
                            className={`border-purple-200 focus:border-purple-400 ${errors.birthday ? 'border-red-300' : ''}`}
                            max={new Date().toISOString().split('T')[0]}
                            disabled={isSaving || isUploadingPhoto}
                            aria-describedby="birthday-error"
                          />
                          {errors.birthday && (
                            <p className="text-sm text-red-600 mt-1" id="birthday-error" role="alert">
                              {errors.birthday}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={resetForm} disabled={isSaving || isUploadingPhoto}>
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600" 
                          disabled={isSaving || isUploadingPhoto}
                        >
                          {isSaving || isUploadingPhoto ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              {isUploadingPhoto ? "Uploading..." : "Saving..."}
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              {(editingPet ? "Update" : "Add") + " Pet"}
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {isLoading && isAuthenticated ? (
            <div className="text-center py-10 text-gray-500">Loading pets...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  onEdit={() => handleEdit(pet)}
                  onDelete={() => handleDelete(pet)}
                />
              ))}
            </div>
          )}

          {pets.length === 0 && !isLoading && isAuthenticated && !showForm && (
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">🐾</div>
                <h3 className="text-xl font-bold mb-2">No Pets Added Yet</h3>
                <p className="text-gray-600 mb-6">
                  Start by adding your first pet to begin analyzing their behavior
                </p>
                <Button
                  onClick={handleAddNewPet}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Pet
                </Button>
              </CardContent>
            </Card>
          )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {petToDelete?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {petToDelete?.name}'s profile and all associated data (analyses, activity logs, vaccine records). This action cannot be undone. Are you absolutely sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPetToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  </div>
    </>
  );
}
