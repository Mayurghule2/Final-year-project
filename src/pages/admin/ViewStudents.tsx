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
  ArrowLeft,
  Download,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
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
  query,
  where,
} from "../../backend/FirebaseConfig";

import { unparse } from "papaparse";

interface Student {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  registrationNo: string;
  email: string;
  gender: string;
  branch: string;
  phone: string;
  dob: string;
  tenthPercentage: string;
  twelfthPercentage: string;
  cgpa: string;
  semester: string;
  backlogs: string;
  branchCode: string;
  status: string;
  createdAt: Date;
}

const ViewStudents = ({
  selectedDeptCode,
  setSelectedDeptCode,
  adminType,
}: {
  selectedDeptCode: string;
  setSelectedDeptCode: (value: string | null) => void;
  adminType: string;
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingStudent, setEditingStudent] = useState<Student | null>(
    null
  );
  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || student.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const updateStudentStatus = async (
    studentId: string,
    currentStatus: string
  ) => {
    try {
      const newStatus = currentStatus === "active" ? "blocked" : "active";
      await updateDoc(doc(db, "students", studentId), {
        status: newStatus,
      });
      toast({
        title: "Success",
        description: `Student has been ${
          newStatus === "active" ? "unblocked" : "blocked"
        }`,
      });
      fetchStudents();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update student status",
        variant: "destructive",
      });
    }
  };

  const fetchStudents = async () => {
    try {
      if (!selectedDeptCode) {
        console.log("No department selected, skipping fetch.");
        setStudents([]); // Clear previous students if needed
        return;
      }

      setLoading(true);
      console.log("Fetching students for department:", selectedDeptCode);

      const q = query(
        collection(db, "students"),
        where("branchCode", "==", selectedDeptCode)
      );

      const querySnapshot = await getDocs(q);

      const studentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Student[];

      console.log(studentsData);
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (studentId: string) => {
    try {
      console.log("Deleting student with ID:", studentId);
      await deleteDoc(doc(db, "students", studentId));
      toast({
        title: "Success",
        description: "Student has been deleted successfully",
      });
      fetchStudents();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete student",
        variant: "destructive",
      });
    }
  };

  const handleEditStudent = async (updatedStudent: Student) => {
    try {
      await updateDoc(doc(db, "students", updatedStudent.id), {
        ...updatedStudent,
      });
      toast({
        title: "Success",
        description: "Student updated successfully",
      });
      setEditingStudent(null);
      fetchStudents();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update student",
        variant: "destructive",
      });
    }
  };

  const toggleStudentExpand = (id: string) => {
    setExpandedStudent(expandedStudent === id ? null : id);
  };

  const exportAsCSV = async () => {
    try {
      if (students.length === 0) {
        toast({
          title: "Error",
          description: "No data to export",
          variant: "destructive",
        });
        return;
      }

      setLoading(true);

      // prepare data
      const csvData = students.map((student) => ({
        registrationNo: student.registrationNo || "",
        firstName: student.firstName || "",
        middleName: student.middleName || "",
        lastName: student.lastName || "",
        email: student.email || "",
        phone: student.phone || "",
        gender: student.gender || "",
        dob: student.dob || "",
        tenthPercentage: student.tenthPercentage ?? "",
        twelfthPercentage: student.twelfthPercentage ?? "",
        cgpa: student.cgpa ?? "",
        backlogs: student.backlogs ?? "",
        branch: student.branch ?? "",
        branchCode: student.branchCode ?? "",
      }));

      // use PapaParse to generate CSV string
      const csvString = unparse(csvData);

      // trigger download
      const blob = new Blob([csvString], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "students.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: "Students data exported as CSV",
      });
    } catch (error) {
      console.error("CSV Export Error:", error);
      toast({
        title: "Error",
        description: "Failed to export students data as CSV",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="students"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex items-center gap-2">
            {adminType !== "A2" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDeptCode(null)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Button
              onClick={exportAsCSV}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>

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
                <DropdownMenuItem
                  onClick={() => setFilterStatus("active")}
                >
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterStatus("blocked")}
                >
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
            ) : filteredStudents.length === 0 ? (
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto text-indigo-500 mb-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    No Students Found
                  </h3>
                  <p className="text-gray-500 mt-2">
                    {searchTerm || filterStatus !== "all"
                      ? "No matching students found. Try adjusting your search or filter."
                      : "There are currently no registered students."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 rounded-lg font-medium text-sm text-gray-600">
                  <div className="col-span-4">Name</div>
                  <div className="col-span-3">Registration Number</div>
                  <div className="hidden md:col-span-3 md:block">Email</div>
                  <div className="col-span-2">Actions</div>
                </div>
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div
                      className="grid grid-cols-12 gap-4 px-4 py-3 items-center cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleStudentExpand(student.id)}
                    >
                      <div className="col-span-4 font-medium">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="hidden md:col-span-3 md:block text-sm text-gray-600">
                        {student.registrationNo}
                      </div>
                      <div className="col-span-3 text-sm text-gray-600">
                        {student.email}
                      </div>
                      <div className="col-span-2 flex justify-end">
                        {expandedStudent === student.id ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                    {expandedStudent === student.id && (
                      <div className="px-4 py-3 bg-gray-50 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-medium mb-2">Personal Information</h4>
                                <div className="space-y-1 text-sm">
                                <p>
                                    <span className="text-gray-500">Phone:</span> {student.phone}
                                </p>
                                <p>
                                    <span className="text-gray-500">DOB:</span> {formatDate(new Date(student.dob))}
                                </p>
                                <p>
                                    <span className="text-gray-500">Gender:</span> {student.gender}
                                </p>
                                <p>
                                    <span className="text-gray-500">Email:</span> {student.email}
                                </p>
                                <p>
                                    <span className="text-gray-500">Status:</span>
                                    <span
                                    className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                                        student.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                    }`}
                                    >
                                    {student.status}
                                    </span>
                                </p>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2">Academic Information</h4>
                                <div className="space-y-1 text-sm">
                                <p>
                                    <span className="text-gray-500">Branch:</span> {student.branch}
                                </p>
                                <p>
                                    <span className="text-gray-500">10th %:</span> {student.tenthPercentage}
                                </p>
                                <p>
                                    <span className="text-gray-500">12th %:</span> {student.twelfthPercentage}
                                </p>
                                <p>
                                    <span className="text-gray-500">CGPA:</span> {student.cgpa}
                                </p>
                                <p>
                                    <span className="text-gray-500">Semester:</span> {student.semester}
                                </p>
                                <p>
                                    <span className="text-gray-500">Backlogs:</span> {student.backlogs}
                                </p>
                                </div>
                            </div>
                            </div>

                        <div className="flex justify-end space-x-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingStudent(student)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant={
                              student.status === "active"
                                ? "destructive"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              updateStudentStatus(
                                student.id,
                                student.status
                              )
                            }
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            {student.status === "active"
                              ? "Block"
                              : "Unblock"}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteStudent(student.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Student Modal */}
        {editingStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">Edit Student</h3>
              <div className="space-y-4">
                <div>
                  <Label>First Name</Label>
                  <Input
                    value={editingStudent.firstName}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        firstName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    value={editingStudent.lastName}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        lastName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={editingStudent.email}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={editingStudent.phone}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingStudent(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleEditStudent(editingStudent)}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ViewStudents;
