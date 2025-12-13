
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Search, Filter, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import AnalysisHistoryCard from "../components/history/AnalysisHistoryCard";
import Pagination from "../components/common/Pagination";
import SEO from "../components/common/SEO";
import EmptyState from "../components/common/EmptyState";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

// Pagination constants
const ITEMS_PER_PAGE = 15; // Reduced from 20

export default function History() {
  const [analyses, setAnalyses] = useState([]); // All analyses fetched from the backend (up to limit)
  const [filteredAnalyses, setFilteredAnalyses] = useState([]); // Analyses after applying client-side filters
  const [pets, setPets] = useState([]);
  const [user, setUser] = useState(null); // Added user state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPet, setSelectedPet] = useState("all"); // Renamed from filterPet
  const [selectedEmotion, setSelectedEmotion] = useState("all"); // Renamed from filterEmotion
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [analysisToDelete, setAnalysisToDelete] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  // Filter analyses whenever filters or the base analyses array changes
  useEffect(() => {
    filterAnalyses();
  }, [searchTerm, selectedPet, selectedEmotion, analyses]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedPet, selectedEmotion]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      const [analysesData, petsData] = await Promise.all([
        base44.entities.Analysis.list("-created_date", 100), // Load more for filtering
        base44.entities.Pet.list()
      ]);

      setAnalyses(Array.isArray(analysesData) ? analysesData : []);
      setPets(Array.isArray(petsData) ? petsData : []);
    } catch (err) {
      console.error("Error loading history:", err);
      
      if (handleAuthError(err)) {
        return;
      }
      
      setError(getFriendlyErrorMessage(err));
      setAnalyses([]);
      setPets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getPetById = (petId) => {
    return pets.find(p => p.id === petId) || null;
  };

  const filterAnalyses = () => {
    let currentFiltered = [...analyses];

    // Search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      currentFiltered = currentFiltered.filter(a =>
        a.emotion_detected?.toLowerCase().includes(search) ||
        a.behavior_summary?.toLowerCase().includes(search) ||
        getPetById(a.pet_id)?.name.toLowerCase().includes(search)
      );
    }

    // Pet filter
    if (selectedPet !== "all") {
      currentFiltered = currentFiltered.filter(a => a.pet_id === selectedPet);
    }

    // Emotion filter
    if (selectedEmotion !== "all") {
      currentFiltered = currentFiltered.filter(a =>
        a.emotion_detected?.toLowerCase().includes(selectedEmotion.toLowerCase())
      );
    }

    // Sort is no longer a filterable option, but default sort is newest first due to backend fetch order
    currentFiltered.sort((a, b) => {
      const dateA = new Date(a.created_date);
      const dateB = new Date(b.created_date);
      return dateB.getTime() - dateA.getTime(); // Default sort by newest
    });

    setFilteredAnalyses(currentFiltered);
  };

  const handleDelete = async (analysisId) => {
    setAnalysisToDelete(analysisId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!analysisToDelete) return;

    try {
      await base44.entities.Analysis.delete(analysisToDelete);
      // Remove from 'analyses' state which will trigger refiltering and re-rendering
      setAnalyses(prev => prev.filter(a => a.id !== analysisToDelete));
      // Reset error message if any
      setError(null);
    } catch (err) {
      console.error("Error deleting analysis:", err);
      if (handleAuthError(err)) {
        return;
      }
      setError(getFriendlyErrorMessage(err) || "Failed to delete analysis.");
    } finally {
      setDeleteDialogOpen(false);
      setAnalysisToDelete(null);
    }
  };

  // Pagination for displayed items
  const totalPages = Math.ceil(filteredAnalyses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentAnalyses = filteredAnalyses.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading && analyses.length === 0) { // Show full spinner only on initial load if no data
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your analysis history...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Analysis History - View Past Behavior Insights | Pet Decoder AI"
        description="Browse your complete pet behavior analysis history with advanced filtering and search."
        noIndex={true}
      />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-10 h-10 text-purple-600" />
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Analysis History
                  </h1>
                  <p className="text-gray-600">{filteredAnalyses.length} total analyses matching filters</p>
                </div>
              </div>
              {/* Export Button removed as per outline */}
            </div>
          </motion.div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Filters */}
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search analyses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-purple-200"
                  />
                </div>

                <Select value={selectedPet} onValueChange={setSelectedPet}>
                  <SelectTrigger className="border-purple-200">
                    <SelectValue placeholder="All Pets" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Pets</SelectItem>
                    {pets.map(pet => (
                      <SelectItem key={pet.id} value={pet.id}>{pet.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedEmotion} onValueChange={setSelectedEmotion}>
                  <SelectTrigger className="border-purple-200">
                    <SelectValue placeholder="All Emotions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Emotions</SelectItem>
                    <SelectItem value="happy">Happy</SelectItem>
                    <SelectItem value="playful">Playful</SelectItem>
                    <SelectItem value="anxious">Anxious</SelectItem>
                    <SelectItem value="calm">Calm</SelectItem>
                    <SelectItem value="excited">Excited</SelectItem>
                    {/* Add more emotions as needed */}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {currentAnalyses.length === 0 ? (
            <EmptyState
                icon={<TrendingUp className="w-16 h-16 text-gray-300" />}
                title="No Analyses Found"
                message={
                    analyses.length === 0
                        ? "Start analyzing your pet's behavior to see history here."
                        : "No analyses match your current filters."
                }
            />
          ) : (
            <>
              {/* Analyses Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <AnimatePresence mode="popLayout">
                  {currentAnalyses.map((analysis, index) => (
                    <AnalysisHistoryCard
                      key={analysis.id}
                      analysis={analysis}
                      pet={getPetById(analysis.pet_id)}
                      index={index}
                      onDelete={handleDelete}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Analysis?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this analysis and cannot be undone. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAnalysisToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
