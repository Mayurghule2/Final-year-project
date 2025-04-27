// src/components/admin/AdminDashboard.tsx
import {
  Users,
  Briefcase,
  ChevronLeft,
  UserPlus,
  Menu,
  GraduationCap,
  Building,
  Loader2,
  ChevronDown,
  ChevronUp,
  Trash2,
  Search,
  Filter,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import Typewriter from "typewriter-effect";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SignupStudent from "../../components/auth/SignupStudent";
import SignupAdmin from "../../components/auth/SignupAdmin";
import SignupRecruiter from "../../components/auth/SignupRecruiter";

import {
  db,
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "../../backend/FirebaseConfig";
import ViewStudents from "./ViewStudents";
import { useAuth } from "@/context/AuthContext";
import ViewAdmins from "./ViewAdmins";
import ViewRecruiters from "./ViewRecruiters";

interface Student {
  id: string;
  firstName: string;
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
  const [selectedDeptCode, setSelectedDeptCode] = useState<string | null>(
    null
  );
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState({
    students: true,
    recruiters: true,
    admins: true,
    messages: true,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { currentUser, logout } = useAuth(); 

  const { toast } = useToast();
  const navigate = useNavigate();

  const departmentCodeMap: Record<string, string> = {
    "Computer Science & Engineering": "CS",
    "Information Technology": "IT",
    "Electronics & Telecommunication Engineering": "EN",
    "Electrical Engineering": "EE",
    "Mechanical Engineering": "ME",
    "Civil Engineering": "CE",
    "Instrumentation Engineering": "IN",
  };

  const departments = Object.keys(departmentCodeMap);

  useEffect(() => {
    if (activeTab === "students") {
      setSelectedDeptCode(
        currentUser.type === "A2" ? currentUser.deptCode : null
      );
    } else if (activeTab === "messages") {
      fetchMessages();
    }
  }, [activeTab]);

  const fetchMessages = async () => {
    try {
      setLoading((prev) => ({ ...prev, messages: true }));
      const querySnapshot = await getDocs(
        collection(db, "contactSubmissions")
      );
      const messagesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Message[];
      setMessages(messagesData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, messages: false }));
    }
  };

  const toggleMessageExpand = (id: string) => {
    setExpandedMessage(expandedMessage === id ? null : id);
  };

  const updateMessageStatus = async (
    messageId: string,
    newStatus: string
  ) => {
    try {
      await updateDoc(doc(db, "contactSubmissions", messageId), {
        status: newStatus,
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || message.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const tabs = [
    {
      key: "studentSignup",
      label: "Create Student",
      icon: <GraduationCap className="mr-2 h-4 w-4" />,
    },
    {
      key: "recruiterSignup",
      label: "Create Recruiter",
      icon: <Building className="mr-2 h-4 w-4" />,
      adminOnly: true, // mark this as admin-only
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
      adminOnly: true, // admin-only
    },
    {
      key: "totalAdmin",
      label: "Admins",
      icon: <UserPlus className="mr-2 h-4 w-4" />,
      adminOnly: true, // admin-only
    },
    {
      key: "messages",
      label: "Messages",
      icon: <MessageSquare className="mr-2 h-4 w-4" />,
    },
  ];

  const handleLogout = () => {
    logout(); // Call the logout function from auth context
    navigate("/"); // Redirect to home after logout
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-10">
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 shadow-md">
          <h1 className="text-3xl font-extrabold text-center text-white py-3 -mb-1 bg-clip-text text-transparent">
            <Typewriter
              options={{
                strings: [
                  "Welcome to Admin Panel",
                  "Manage Users Efficiently",
                ],
                autoStart: true,
                loop: true,
              }}
            />
          </h1>

          <p className="text-center text-white mt-2 text-sm mb-1">
            Here you can create and manage student, recruiter, and admin
            accounts.
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
                  <h1 className="text-xl font-bold">
                    Recruiter Management
                  </h1>
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
                  <h1 className="text-xl font-bold">
                    Student Registration
                  </h1>
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
                  <h1 className="text-xl font-bold">
                    Recruiter Registration
                  </h1>
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
              {tabs
                .filter((tab) => {
                  // Hide admin-only tabs if user is A2
                  if (tab.adminOnly && currentUser?.type === "A2") {
                    return false;
                  }
                  return true;
                })
                .map(({ key, label, icon }) => (
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

            <Button
                  onClick={handleLogout}
                  className="border border-red-600 text-red-600 bg-white hover:bg-red-500 hover:text-white transition-all"
                >
                  Logout
            </Button>

            <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setActiveTab("studentSignup")}
                  >
                    Create Student Account
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setActiveTab("recruiterSignup")}
                  >
                    Create Recruiter Account
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setActiveTab("students")}
                  >
                    Manage Students
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setActiveTab("recruiters")}
                  >
                    Manage Recruiters
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setActiveTab("createAdmin")}
                  >
                    Create Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setActiveTab("totalAdmin")}
                  >
                    Total Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setActiveTab("messages")}
                  >
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
            >
              {selectedDeptCode ? (
                <ViewStudents 
                  setSelectedDeptCode={setSelectedDeptCode}
                  selectedDeptCode={selectedDeptCode} 
                  adminType={currentUser?.type}
                  />
              ) : (
                <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {departments.map((department, index) => (
                    <div
                      key={index}
                      className="relative group bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
                      onClick={() => setSelectedDeptCode(departmentCodeMap[department])}
                    >
                      <div className="p-6">
                        <div className="inline-flex rounded-full p-3 bg-blue-100 text-blue-600">
                          <Building className="h-6 w-6" />
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-gray-900">
                          {department} ({departmentCodeMap[department]})
                        </h3>
                        <p className="mt-2 text-gray-600">
                          Department Description
                        </p>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100" />
                    </div>
                  ))}
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
              <ViewRecruiters adminType={currentUser?.type}/>
            </motion.div>
          ) : activeTab === "totalAdmin" ? (
            <ViewAdmins userid = {currentUser?.uid.toString()}/>
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
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Filter className="h-4 w-4" />
                        {filterStatus === "all"
                          ? "All Status"
                          : filterStatus === "new"
                          ? "New"
                          : "Viewed"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setFilterStatus("all")}
                      >
                        All Status
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setFilterStatus("new")}
                      >
                        New
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setFilterStatus("viewed")}
                      >
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
                        <div
                          key={message.id}
                          className="border rounded-lg overflow-hidden"
                        >
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
                                  <h4 className="font-medium mb-1">
                                    Message
                                  </h4>
                                  <p className="text-sm text-gray-600 whitespace-pre-line">
                                    {message.message}
                                  </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-1">
                                      Contact Info
                                    </h4>
                                    <div className="text-sm text-gray-600 space-y-1">
                                      <p>Email: {message.email}</p>
                                      {message.phone && (
                                        <p>Phone: {message.phone}</p>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-1">
                                      Details
                                    </h4>
                                    <div className="text-sm text-gray-600 space-y-1">
                                      <p>Type: {message.userType}</p>
                                      <p>
                                        Received:{" "}
                                        {formatDate(message.createdAt)}
                                      </p>
                                      <p>
                                        Status:
                                        <span
                                          className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                                            message.status === "new"
                                              ? "bg-blue-100 text-blue-800"
                                              : "bg-gray-100 text-gray-800"
                                          }`}
                                        >
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
                                    onClick={() =>
                                      updateMessageStatus(
                                        message.id,
                                        "viewed"
                                      )
                                    }
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
                  <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-6">
                      <UserPlus className="h-12 w-12 mx-auto text-indigo-500 mb-2" />
                      <h3 className="text-lg font-medium text-gray-900">
                        Create New Admin
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Add a new administrator to the system
                      </p>
                    </div>
                    <SignupAdmin />
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
                  <SignupStudent/>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <SignupRecruiter/>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;
