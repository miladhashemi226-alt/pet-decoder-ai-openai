import React, { useState, useEffect } from "react";
import { ContactSubmission } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Search, Filter, Trash2, Archive, Eye, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { formatLocalDate } from "@/components/utils/dateFormatter";
import SEO from "../components/common/SEO";

export default function ContactSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      // Only admins can view contact submissions
      if (currentUser.role !== 'admin') {
        window.location.href = '/';
        return;
      }

      await loadSubmissions();
    } catch (error) {
      console.error("Error loading data:", error);
      window.location.href = '/';
    } finally {
      setIsLoading(false);
    }
  };

  const loadSubmissions = async () => {
    try {
      const data = await ContactSubmission.list('-created_date');
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading submissions:", error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await ContactSubmission.update(id, { status: newStatus });
      await loadSubmissions();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this submission?")) {
      try {
        await ContactSubmission.delete(id);
        await loadSubmissions();
      } catch (error) {
        console.error("Error deleting submission:", error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'read':
        return 'bg-yellow-100 text-yellow-800';
      case 'replied':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <>
      <SEO
        title="Contact Submissions - Admin | Pet Decoder AI"
        description="Admin panel for viewing and managing contact form submissions"
        noIndex={true}
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Contact Submissions
            </h1>
            <p className="text-gray-600">Manage and respond to contact form submissions</p>
          </motion.div>

          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm mb-6">
            <CardHeader className="border-b border-purple-100">
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter & Search
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, subject, or message..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-purple-200"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-48 border-purple-200">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {filteredSubmissions.length === 0 ? (
            <Card className="border-none shadow-xl">
              <CardContent className="p-12 text-center">
                <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No Submissions Found</h3>
                <p className="text-gray-600">
                  {searchTerm || filterStatus !== 'all' 
                    ? "Try adjusting your filters" 
                    : "No contact form submissions yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((submission, index) => (
                <motion.div
                  key={submission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-none shadow-xl hover:shadow-2xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg">{submission.name}</h3>
                            <Badge className={getStatusColor(submission.status)}>
                              {submission.status}
                            </Badge>
                            {submission.status === 'new' && (
                              <Badge className="bg-red-100 text-red-800">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Unread
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{submission.email}</p>
                          <p className="text-sm text-gray-500">
                            {formatLocalDate(submission.created_date)}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="font-semibold text-gray-900 mb-2">Subject:</p>
                        <p className="text-gray-700">{submission.subject}</p>
                      </div>

                      <div className="mb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setExpandedId(expandedId === submission.id ? null : submission.id)}
                          className="mb-2"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          {expandedId === submission.id ? 'Hide Message' : 'View Message'}
                        </Button>
                        
                        {expandedId === submission.id && (
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-gray-800 whitespace-pre-wrap">{submission.message}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Select
                          value={submission.status}
                          onValueChange={(value) => handleStatusChange(submission.id, value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="read">Read</SelectItem>
                            <SelectItem value="replied">Replied</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`mailto:${submission.email}?subject=Re: ${submission.subject}`)}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Reply via Email
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(submission.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}