// src/components/admin/AdminDashboard.tsx
import {
  Users,
  Briefcase,
  ChevronLeft,
  UserPlus,
  Menu,
  Eye,
  EyeOff,
  Layers,
  GraduationCap,
  Building,
  Loader2,
  ChevronDown,
  ChevronUp,
  Edit,
  Ban,
  Trash2,
  Mail,
  Search,
  Filter,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Typewriter from "typewriter-effect";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SignupStudent from "../../components/auth/SignupStudent";
import SignupRecruiter from "../../components/auth/SignupRecruiter";
import { Textarea } from "@/components/ui/textarea";

import { 
  auth, 
  db, 
  createUserWithEmailAndPassword, 
  addDoc, 
  collection, 
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  deleteDoc,
} from "../../backend/FirebaseConfig";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  branch: string;
  phone: string;
  dob: string;
  tenthPercentage: string;
  twelfthPercentage: string;
  cgpa: string;
  semester: string;
  backlogs: string;
  status: string;
  createdAt: Date;
}

interface Recruiter {
  id: string;
  companyName: string;
  email: string;
  companyInfo: string;
  status: string;
  createdAt: Date;
}

interface Admin {
  id: string;
  email: string;
  status: string;
  createdAt: Date;
}

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: string;
  message: string;
  status: string;
  createdAt: Date;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<
    | "students"
    | "recruiters"
    | "createAdmin"
    | "studentSignup"
    | "recruiterSignup"
    | "totalAdmin"
    | "messages"
  >("students");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [isCreatingStudent, setIsCreatingStudent] = useState(false);
  const [isCreatingRecruiter, setIsCreatingRecruiter] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [expandedRecruiter, setExpandedRecruiter] = useState<string | null>(null);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState({
    students: true,
    recruiters: true,
    admins: true,
    messages: true
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingRecruiter, setEditingRecruiter] = useState<Recruiter | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (activeTab === "students") {
      fetchStudents();
    } else if (activeTab === "recruiters") {
      fetchRecruiters();
    } else if (activeTab === "totalAdmin") {
      fetchAdmins();
    } else if (activeTab === "messages") {
      fetchMessages();
    }
  }, [activeTab]);

  const fetchStudents = async () => {
    try {
      setLoading(prev => ({ ...prev, students: true }));
      const querySnapshot = await getDocs(collection(db, "students"));
      const studentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Student[];
      setStudents(studentsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, students: false }));
    }
  };

  const fetchRecruiters = async () => {
    try {
      setLoading(prev => ({ ...prev, recruiters: true }));
      const querySnapshot = await getDocs(collection(db, "recruiters"));
      const recruitersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Recruiter[];
      setRecruiters(recruitersData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch recruiters",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, recruiters: false }));
    }
  };

  const fetchAdmins = async () => {
    try {
      setLoading(prev => ({ ...prev, admins: true }));
      const querySnapshot = await getDocs(collection(db, "admins"));
      const adminsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        status: doc.data().status || "active",
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Admin[];
      setAdmins(adminsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch admins",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, admins: false }));
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(prev => ({ ...prev, messages: true }));
      const querySnapshot = await getDocs(collection(db, "contactSubmissions"));
      const messagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Message[];
      setMessages(messagesData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, messages: false }));
    }
  };

  const handleCreateAdmin = async () => {
    if (adminPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingAdmin(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        adminEmail,
        adminPassword
      );

      await addDoc(collection(db, "admins"), {
        email: adminEmail,
        createdAt: new Date(),
        role: "admin",
        uid: userCredential.user.uid,
        status: "active",
      });

      toast({
        title: "Admin Created",
        description: `New admin with email ${adminEmail} has been created successfully.`,
      });

      setAdminEmail("");
      setAdminPassword("");
      setConfirmPassword("");
      fetchAdmins();
    } catch (error: any) {
      let errorMessage = "Failed to create admin account";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email is already in use";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  const handleStudentSubmit = async (data: any) => {
    setIsCreatingStudent(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await addDoc(collection(db, "students"), {
        ...data,
        uid: userCredential.user.uid,
        createdAt: new Date(),
        role: "student",
        status: "active",
      });

      toast({
        title: "Student Created",
        description: `Student ${data.firstName} ${data.lastName} has been registered successfully.`,
      });
      fetchStudents();
    } catch (error: any) {
      let errorMessage = "Failed to create student account";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email is already in use";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsCreatingStudent(false);
    }
  };

  const handleRecruiterSubmit = async (data: any) => {
    setIsCreatingRecruiter(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await addDoc(collection(db, "recruiters"), {
        ...data,
        uid: userCredential.user.uid,
        createdAt: new Date(),
        role: "recruiter",
        status: "active",
      });

      toast({
        title: "Recruiter Created",
        description: `${data.companyName} has been registered successfully.`,
      });
      fetchRecruiters();
    } catch (error: any) {
      let errorMessage = "Failed to create recruiter account";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email is already in use";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsCreatingRecruiter(false);
    }
  };

  const toggleStudentExpand = (id: string) => {
    setExpandedStudent(expandedStudent === id ? null : id);
  };

  const toggleRecruiterExpand = (id: string) => {
    setExpandedRecruiter(expandedRecruiter === id ? null : id);
  };

  const toggleMessageExpand = (id: string) => {
    setExpandedMessage(expandedMessage === id ? null : id);
  };

  const updateStudentStatus = async (studentId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "blocked" : "active";
      await updateDoc(doc(db, "students", studentId), {
        status: newStatus
      });
      toast({
        title: "Success",
        description: `Student has been ${newStatus === "active" ? "unblocked" : "blocked"}`,
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

  const updateRecruiterStatus = async (recruiterId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "blocked" : "active";
      await updateDoc(doc(db, "recruiters", recruiterId), {
        status: newStatus
      });
      toast({
        title: "Success",
        description: `Recruiter has been ${newStatus === "active" ? "unblocked" : "blocked"}`,
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

  const updateAdminStatus = async (adminId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "blocked" : "active";
      await updateDoc(doc(db, "admins", adminId), {
        status: newStatus
      });
      toast({
        title: "Success",
        description: `Admin has been ${newStatus === "active" ? "unblocked" : "blocked"}`,
      });
      fetchAdmins();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update admin status",
        variant: "destructive",
      });
    }
  };

  const updateMessageStatus = async (messageId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "contactSubmissions", messageId), {
        status: newStatus
      });
      toast({
        title: "Success",
        description: `Message has been marked as ${newStatus}`,
      });
      fetchMessages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update message status",
        variant: "destructive",
      });
    }
  };

  const deleteStudent = async (studentId: string) => {
    try {
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

  const deleteAdmin = async (adminId: string) => {
    try {
      await deleteDoc(doc(db, "admins", adminId));
      toast({
        title: "Success",
        description: "Admin has been deleted successfully",
      });
      fetchAdmins();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete admin",
        variant: "destructive",
      });
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      await deleteDoc(doc(db, "contactSubmissions", messageId));
      toast({
        title: "Success",
        description: "Message has been deleted successfully",
      });
      fetchMessages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  const handleEditStudent = async (updatedStudent: Student) => {
    try {
      await updateDoc(doc(db, "students", updatedStudent.id), {
        ...updatedStudent
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

  const handleEditRecruiter = async (updatedRecruiter: Recruiter) => {
    try {
      await updateDoc(doc(db, "recruiters", updatedRecruiter.id), {
        ...updatedRecruiter
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || student.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const filteredRecruiters = recruiters.filter(recruiter => {
    const matchesSearch = 
      recruiter.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recruiter.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || recruiter.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = 
      admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || admin.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || message.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-10">
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 shadow-md">
          <h1 className="text-3xl font-extrabold text-center text-white py-3 -mb-1 bg-clip-text text-transparent">
            <Typewriter
              options={{
                strings: ["Welcome to Admin Panel", "Manage Users Efficiently"],
                autoStart: true,
                loop: true,
              }}
            />
          </h1>

          <p className="text-center text-white mt-2 text-sm mb-1">
            Here you can create and manage student, recruiter, and admin accounts.
          </p>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              {activeTab === "students" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center"
                >
                  <Users className="h-6 w-6 mr-2" />
                  <h1 className="text-xl font-bold">Student Management</h1>
                </motion.div>
              )}
              {activeTab === "recruiters" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center"
                >
                  <Briefcase className="h-6 w-6 mr-2" />
                  <h1 className="text-xl font-bold">Recruiter Management</h1>
                </motion.div>
              )}
              {activeTab === "createAdmin" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center"
                >
                  <UserPlus className="h-6 w-6 mr-2" />
                  <h1 className="text-xl font-bold">Admin Creation</h1>
                </motion.div>
              )}
              {activeTab === "studentSignup" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center"
                >
                  <GraduationCap className="h-6 w-6 mr-2" />
                  <h1 className="text-xl font-bold">Student Registration</h1>
                </motion.div>
              )}
              {activeTab === "recruiterSignup" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center"
                >
                  <Building className="h-6 w-6 mr-2" />
                  <h1 className="text-xl font-bold">Recruiter Registration</h1>
                </motion.div>
              )}
              {activeTab === "totalAdmin" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center"
                >
                  <UserPlus className="h-6 w-6 mr-2" />
                  <h1 className="text-xl font-bold">Admin Management</h1>
                </motion.div>
              )}
              {activeTab === "messages" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center"
                >
                  <MessageSquare className="h-6 w-6 mr-2" />
                  <h1 className="text-xl font-bold">User Messages</h1>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 -mb-2">
          <div className="flex items-center justify-between">
            <Link to="/login" className="pb-2">
              <Button variant="outline" className="sm:mr-4" size="sm">
                <ChevronLeft className="h-4 w-4 mt-[0.18rem] -mr-1" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
            <div className="hidden sm:flex overflow-x-auto py-2 mx-auto">
              {[
                {
                  key: "studentSignup",
                  label: "Create Student",
                  icon: <GraduationCap className="mr-2 h-4 w-4" />,
                },
                {
                  key: "recruiterSignup",
                  label: "Create Recruiter",
                  icon: <Building className="mr-2 h-4 w-4" />,
                },
                {
                  key: "students",
                  label: "Students",
                  icon: <Users className="mr-2 h-4 w-4" />,
                },
                {
                  key: "recruiters",
                  label: "Recruiters",
                  icon: <Briefcase className="mr-2 h-4 w-4" />,
                },
                {
                  key: "createAdmin",
                  label: "Create Admin",
                  icon: <UserPlus className="mr-2 h-4 w-4" />,
                },
                {
                  key: "totalAdmin",
                  label: "Admins",
                  icon: <UserPlus className="mr-2 h-4 w-4" />,
                },
                {
                  key: "messages",
                  label: "Messages",
                  icon: <MessageSquare className="mr-2 h-4 w-4" />,
                },
              ].map(({ key, label, icon }) => (
                <motion.button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`${
                    activeTab === key
                      ? "bg-indigo-50 text-indigo-700 border-indigo-600"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  } flex items-center px-4 py-2 text-sm font-medium rounded-md mr-2 border-b-2 border-transparent transition-all duration-150`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {icon} {label}
                </motion.button>
              ))}
            </div>

            <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setActiveTab("studentSignup")}>
                    Create Student Account
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("recruiterSignup")}>
                    Create Recruiter Account
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("students")}>
                    Manage Students
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("recruiters")}>
                    Manage Recruiters
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("createAdmin")}>
                    Create Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("totalAdmin")}>
                    Total Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("messages")}>
                    Messages
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          {activeTab === "students" ? (
            <motion.div
              key="students"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search students..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        {filterStatus === "all" ? "All Status" : filterStatus === "active" ? "Active" : "Blocked"}
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
                  {loading.students ? (
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
                        <div className="col-span-3">Email</div>
                        <div className="col-span-3">Branch</div>
                        <div className="col-span-2">Actions</div>
                      </div>
                      {filteredStudents.map((student) => (
                        <div key={student.id} className="border rounded-lg overflow-hidden">
                          <div 
                            className="grid grid-cols-12 gap-4 px-4 py-3 items-center cursor-pointer hover:bg-gray-50"
                            onClick={() => toggleStudentExpand(student.id)}
                          >
                            <div className="col-span-4 font-medium">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="col-span-3 text-sm text-gray-600">
                              {student.email}
                            </div>
                            <div className="col-span-3 text-sm text-gray-600">
                              {student.branch}
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
                                    <p><span className="text-gray-500">Phone:</span> {student.phone}</p>
                                    <p><span className="text-gray-500">DOB:</span> {formatDate(new Date(student.dob))}</p>
                                    <p><span className="text-gray-500">Gender:</span> {student.gender}</p>
                                    <p><span className="text-gray-500">Status:</span> 
                                      <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                                        student.status === "active" 
                                          ? "bg-green-100 text-green-800" 
                                          : "bg-red-100 text-red-800"
                                      }`}>
                                        {student.status}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Academic Information</h4>
                                  <div className="space-y-1 text-sm">
                                    <p><span className="text-gray-500">10th %:</span> {student.tenthPercentage}</p>
                                    <p><span className="text-gray-500">12th %:</span> {student.twelfthPercentage}</p>
                                    <p><span className="text-gray-500">CGPA:</span> {student.cgpa}</p>
                                    <p><span className="text-gray-500">Semester:</span> {student.semester}</p>
                                    <p><span className="text-gray-500">Backlogs:</span> {student.backlogs}</p>
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
                                  variant={student.status === "active" ? "destructive" : "outline"}
                                  size="sm"
                                  onClick={() => updateStudentStatus(student.id, student.status)}
                                >
                                  <Ban className="h-4 w-4 mr-2" />
                                  {student.status === "active" ? "Block" : "Unblock"}
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
                          onChange={(e) => setEditingStudent({...editingStudent, firstName: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Last Name</Label>
                        <Input 
                          value={editingStudent.lastName} 
                          onChange={(e) => setEditingStudent({...editingStudent, lastName: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input 
                          value={editingStudent.email} 
                          onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input 
                          value={editingStudent.phone} 
                          onChange={(e) => setEditingStudent({...editingStudent, phone: e.target.value})}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setEditingStudent(null)}>
                          Cancel
                        </Button>
                        <Button onClick={() => handleEditStudent(editingStudent)}>
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : activeTab === "recruiters" ? (
            <motion.div
              key="recruiters"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
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
                      <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        {filterStatus === "all" ? "All Status" : filterStatus === "active" ? "Active" : "Blocked"}
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
                  {loading.recruiters ? (
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
                        <div key={recruiter.id} className="border rounded-lg overflow-hidden">
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
                                  <h4 className="font-medium mb-1">Company Information</h4>
                                  <p className="text-sm text-gray-600">{recruiter.companyInfo}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-1">Status</h4>
                                  <p>
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                                      recruiter.status === "active" 
                                        ? "bg-green-100 text-green-800" 
                                        : "bg-red-100 text-red-800"
                                    }`}>
                                      {recruiter.status}
                                    </span>
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-1">Registered On</h4>
                                  <p className="text-sm text-gray-600">{formatDate(recruiter.createdAt)}</p>
                                </div>
                              </div>
                              <div className="flex justify-end space-x-2 mt-4">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setEditingRecruiter(recruiter)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Button>
                                <Button 
                                  variant={recruiter.status === "active" ? "destructive" : "outline"}
                                  size="sm"
                                  onClick={() => updateRecruiterStatus(recruiter.id, recruiter.status)}
                                >
                                  <Ban className="h-4 w-4 mr-2" />
                                  {recruiter.status === "active" ? "Block" : "Unblock"}
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => deleteRecruiter(recruiter.id)}
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
                          onChange={(e) => setEditingRecruiter({...editingRecruiter, companyName: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input 
                          value={editingRecruiter.email} 
                          onChange={(e) => setEditingRecruiter({...editingRecruiter, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Company Info</Label>
                        <Textarea 
                          value={editingRecruiter.companyInfo} 
                          onChange={(e) => setEditingRecruiter({...editingRecruiter, companyInfo: e.target.value})}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setEditingRecruiter(null)}>
                          Cancel
                        </Button>
                        <Button onClick={() => handleEditRecruiter(editingRecruiter)}>
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : activeTab === "totalAdmin" ? (
            <motion.div
              key="totalAdmin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search admins..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        {filterStatus === "all" ? "All Status" : filterStatus === "active" ? "Active" : "Blocked"}
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
                  {loading.admins ? (
                    <div className="flex justify-center items-center h-40">
                      <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                    </div>
                  ) : filteredAdmins.length === 0 ? (
                    <div className="flex items-center justify-center h-40">
                      <div className="text-center">
                        <UserPlus className="h-12 w-12 mx-auto text-indigo-500 mb-2" />
                        <h3 className="text-lg font-medium text-gray-900">
                          No Admins Found
                        </h3>
                        <p className="text-gray-500 mt-2">
                          {searchTerm || filterStatus !== "all" 
                            ? "No matching admins found. Try adjusting your search or filter."
                            : "There are currently no registered admins."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 rounded-lg font-medium text-sm text-gray-600">
                        <div className="col-span-6">Email</div>
                        <div className="col-span-4">Status</div>
                        <div className="col-span-2">Actions</div>
                      </div>
                      {filteredAdmins.map((admin) => (
                        <div key={admin.id} className="grid grid-cols-12 gap-4 px-4 py-3 border-b items-center">
                          <div className="col-span-6 font-medium">
                            {admin.email}
                          </div>
                          <div className="col-span-4">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              admin.status === "active" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {admin.status}
                            </span>
                          </div>
                          <div className="col-span-2 flex justify-end space-x-2">
                            <Button 
                              variant={admin.status === "active" ? "destructive" : "outline"}
                              size="sm"
                              onClick={() => updateAdminStatus(admin.id, admin.status)}
                            >
                              <Ban className="h-4 w-4 mr-1" />
                              {admin.status === "active" ? "Block" : "Unblock"}
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => deleteAdmin(admin.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : activeTab === "messages" ? (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search messages..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        {filterStatus === "all" ? "All Status" : filterStatus === "new" ? "New" : "Viewed"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                        All Status
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("new")}>
                        New
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("viewed")}>
                        Viewed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
                <CardContent className="p-6">
                  {loading.messages ? (
                    <div className="flex justify-center items-center h-40">
                      <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                    </div>
                  ) : filteredMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-40">
                      <div className="text-center">
                        <MessageSquare className="h-12 w-12 mx-auto text-indigo-500 mb-2" />
                        <h3 className="text-lg font-medium text-gray-900">
                          No Messages Found
                        </h3>
                        <p className="text-gray-500 mt-2">
                          {searchTerm || filterStatus !== "all" 
                            ? "No matching messages found. Try adjusting your search or filter."
                            : "There are currently no messages."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 rounded-lg font-medium text-sm text-gray-600">
                        <div className="col-span-4">Name</div>
                        <div className="col-span-4">Email</div>
                        <div className="col-span-2">Type</div>
                        <div className="col-span-2">Actions</div>
                      </div>
                      {filteredMessages.map((message) => (
                        <div key={message.id} className="border rounded-lg overflow-hidden">
                          <div 
                            className="grid grid-cols-12 gap-4 px-4 py-3 items-center cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                              toggleMessageExpand(message.id);
                              if (message.status === "new") {
                                updateMessageStatus(message.id, "viewed");
                              }
                            }}
                          >
                            <div className="col-span-4 font-medium">
                              {message.name}
                              {message.status === "new" && (
                                <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                                  New
                                </span>
                              )}
                            </div>
                            <div className="col-span-4 text-sm text-gray-600">
                              {message.email}
                            </div>
                            <div className="col-span-2 text-sm text-gray-600 capitalize">
                              {message.userType}
                            </div>
                            <div className="col-span-2 flex justify-end">
                              {expandedMessage === message.id ? (
                                <ChevronUp className="h-5 w-5 text-gray-500" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                              )}
                            </div>
                          </div>
                          {expandedMessage === message.id && (
                            <div className="px-4 py-3 bg-gray-50 border-t">
                              <div className="space-y-3">
                                <div>
                                  <h4 className="font-medium mb-1">Message</h4>
                                  <p className="text-sm text-gray-600 whitespace-pre-line">{message.message}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-1">Contact Info</h4>
                                    <div className="text-sm text-gray-600 space-y-1">
                                      <p>Email: {message.email}</p>
                                      {message.phone && <p>Phone: {message.phone}</p>}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-1">Details</h4>
                                    <div className="text-sm text-gray-600 space-y-1">
                                      <p>Type: {message.userType}</p>
                                      <p>Received: {formatDate(message.createdAt)}</p>
                                      <p>Status: 
                                        <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                                          message.status === "new" 
                                            ? "bg-blue-100 text-blue-800" 
                                            : "bg-gray-100 text-gray-800"
                                        }`}>
                                          {message.status}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end space-x-2 mt-4">
                                {message.status === "new" && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => updateMessageStatus(message.id, "viewed")}
                                  >
                                    Mark as Viewed
                                  </Button>
                                )}
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => deleteMessage(message.id)}
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
            </motion.div>
          ) : activeTab === "createAdmin" ? (
            <motion.div
              key="createAdmin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card className="border-0 shadow-lg rounded-xl overflow-hidden bg-white">
                <CardContent className="p-6">
                  <div className="max-w-md mx-auto">
                    <div className="text-center mb-6">
                      <UserPlus className="h-12 w-12 mx-auto text-indigo-500 mb-2" />
                      <h3 className="text-lg font-medium text-gray-900">
                        Create New Admin
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Add a new administrator to the system
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Admin Email
                        </Label>
                        <div className="relative">
                          <Input
                            id="email"
                            type="email"
                            placeholder="admin@example.com"
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            className="h-10 pl-3"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium">
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            className="h-10 pl-3 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium">
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="h-10 pl-3 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="pt-2"
                      >
                        <Button
                          className="w-full h-10 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                          onClick={handleCreateAdmin}
                          disabled={
                            !adminEmail || !adminPassword || !confirmPassword || isCreatingAdmin
                          }
                        >
                          {isCreatingAdmin ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            <>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Create Admin Account
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : activeTab === "studentSignup" ? (
            <motion.div
              key="studentSignup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card className="border-0 shadow-lg rounded-xl overflow-hidden bg-white">
                <CardContent className="p-6">
                  <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-6">
                      <GraduationCap className="h-12 w-12 mx-auto text-blue-500 mb-2" />
                      <h3 className="text-lg font-medium text-gray-900">
                        Student Registration Form
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Create a new student account
                      </p>
                    </div>

                    <SignupStudent
                      onSubmit={handleStudentSubmit}
                      isSubmitting={isCreatingStudent}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="recruiterSignup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card className="border-0 shadow-lg rounded-xl overflow-hidden bg-white">
                <CardContent className="p-6">
                  <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-6">
                      <Building className="h-12 w-12 mx-auto text-purple-500 mb-2" />
                      <h3 className="text-lg font-medium text-gray-900">
                        Recruiter Registration Form
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Create a new recruiter account
                      </p>
                    </div>

                    <SignupRecruiter
                      onSubmit={handleRecruiterSubmit}
                      isSubmitting={isCreatingRecruiter}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;