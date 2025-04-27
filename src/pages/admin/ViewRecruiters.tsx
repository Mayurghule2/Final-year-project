import {
  Users,
  Loader2,
  ChevronDown,
  ChevronUp,
  Edit,
  Ban,
  Trash2,
  Search,
  Filter,
  Briefcase,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  db,
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "../../backend/FirebaseConfig";

import { Textarea } from "@/components/ui/textarea";

interface Recruiter {
  id: string;
  companyName: string;
  email: string;
  companyInfo: string;
  status: string;
  createdAt: Date;
}

const ViewRecruiters = (adminType: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [expandedRecruiter, setExpandedRecruiter] = useState<
    string | null
  >(null);
  const [editingRecruiter, setEditingRecruiter] =
    useState<Recruiter | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredRecruiters = recruiters.filter((recruiter) => {
    const matchesSearch =
      recruiter.companyName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      recruiter.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || recruiter.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const fetchRecruiters = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "recruiters"));
      const recruitersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Recruiter[];
      setRecruiters(recruitersData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch recruiters",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRecruiterStatus = async (
    recruiterId: string,
    currentStatus: string
  ) => {
    try {
      const newStatus = currentStatus === "active" ? "blocked" : "active";
      await updateDoc(doc(db, "recruiters", recruiterId), {
        status: newStatus,
      });
      toast({
        title: "Success",
        description: `Recruiter has been ${
          newStatus === "active" ? "unblocked" : "blocked"
        }`,
      });
      fetchRecruiters();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update recruiter status",
        variant: "destructive",
      });
    }
  };

  const handleEditRecruiter = async (updatedRecruiter: Recruiter) => {
    try {
      await updateDoc(doc(db, "recruiters", updatedRecruiter.id), {
        ...updatedRecruiter,
      });
      toast({
        title: "Success",
        description: "Recruiter updated successfully",
      });
      setEditingRecruiter(null);
      fetchRecruiters();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update recruiter",
        variant: "destructive",
      });
    }
  };

  const deleteRecruiter = async (recruiterId: string) => {
    try {
      await deleteDoc(doc(db, "recruiters", recruiterId));
      toast({
        title: "Success",
        description: "Recruiter has been deleted successfully",
      });
      fetchRecruiters();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete recruiter",
        variant: "destructive",
      });
    }
  };

  const toggleRecruiterExpand = (id: string) => {
    setExpandedRecruiter(expandedRecruiter === id ? null : id);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search recruiters..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                {filterStatus === "all"
                  ? "All Status"
                  : filterStatus === "active"
                  ? "Active"
                  : "Blocked"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("blocked")}>
                Blocked
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
        <CardContent className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : filteredRecruiters.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <Briefcase className="h-12 w-12 mx-auto text-indigo-500 mb-2" />
                <h3 className="text-lg font-medium text-gray-900">
                  No Recruiters Found
                </h3>
                <p className="text-gray-500 mt-2">
                  {searchTerm || filterStatus !== "all"
                    ? "No matching recruiters found. Try adjusting your search or filter."
                    : "There are currently no registered recruiters."}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 rounded-lg font-medium text-sm text-gray-600">
                <div className="col-span-5">Company Name</div>
                <div className="col-span-5">Email</div>
                <div className="col-span-2">Actions</div>
              </div>
              {filteredRecruiters.map((recruiter) => (
                <div
                  key={recruiter.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <div
                    className="grid grid-cols-12 gap-4 px-4 py-3 items-center cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleRecruiterExpand(recruiter.id)}
                  >
                    <div className="col-span-5 font-medium">
                      {recruiter.companyName}
                    </div>
                    <div className="col-span-5 text-sm text-gray-600">
                      {recruiter.email}
                    </div>
                    <div className="col-span-2 flex justify-end">
                      {expandedRecruiter === recruiter.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                  {expandedRecruiter === recruiter.id && (
                    <div className="px-4 py-3 bg-gray-50 border-t">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium mb-1">
                            Company Information
                          </h4>
                          <p className="text-sm text-gray-600 whitespace-pre-line">
                            {recruiter.companyInfo}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium mb-1">Status</h4>
                          <p>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs ${
                                recruiter.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {recruiter.status}
                            </span>
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">
                            Registered On
                          </h4>
                          <p className="text-sm text-gray-600">
                            {formatDate(recruiter.createdAt)}
                          </p>
                        </div>
                      </div>
                      {adminType.adminType === "A1" && (<div className="flex justify-end space-x-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingRecruiter(recruiter)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant={
                            recruiter.status === "active"
                              ? "destructive"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            updateRecruiterStatus(
                              recruiter.id,
                              recruiter.status
                            )
                          }
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          {recruiter.status === "active"
                            ? "Block"
                            : "Unblock"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteRecruiter(recruiter.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Recruiter Modal */}
      {editingRecruiter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Edit Recruiter</h3>
            <div className="space-y-4">
              <div>
                <Label>Company Name</Label>
                <Input
                  value={editingRecruiter.companyName}
                  onChange={(e) =>
                    setEditingRecruiter({
                      ...editingRecruiter,
                      companyName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={editingRecruiter.email}
                  onChange={(e) =>
                    setEditingRecruiter({
                      ...editingRecruiter,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Company Info</Label>
                <Textarea
                  value={editingRecruiter.companyInfo}
                  onChange={(e) =>
                    setEditingRecruiter({
                      ...editingRecruiter,
                      companyInfo: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingRecruiter(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleEditRecruiter(editingRecruiter)}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewRecruiters;
