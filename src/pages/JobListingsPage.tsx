import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  BookOpen,
  CheckCircle,
  ChevronDown,
  User,
  AlertCircle,
  Clock as PendingIcon,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/landing/Footer";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner"; // Add this import at the top of your file

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "@/backend/FirebaseConfig";

const FormItem = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">{children}</div>
);

const FormLabel = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <label className={`text-gray-600 ${className || ""}`}>{children}</label>;

const JobListingsPage = () => {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [loading, setLoading] = useState({
    jobs: true,
    applications: true,
    profile: true,
  });
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "available" | "applied" | "profile"
  >("available");
  const [showApplicationForm, setShowApplicationForm] = useState<string | null>(
    null
  );
  const [internshipCount, setInternshipCount] = useState("0");
  const [internshipMonths, setInternshipMonths] = useState("0");
  const [hasProjects, setHasProjects] = useState("No");
  const [projects, setProjects] = useState([
    { link: "", description: "" },
    { link: "", description: "" },
    { link: "", description: "" },
  ]);

  // Fetch all required data
  // Change this useEffect
  useEffect(() => {
    if (!currentUser?.uid) {
      console.error("No current user found");
      setLoading({ jobs: false, applications: false, profile: false });
      return;
    }

    console.log("Fetching data for user:", currentUser.uid);

    // First try to get profile from localStorage
    const storedProfile = localStorage.getItem("user");
    if (storedProfile) {
      try {
        const parsedProfile = JSON.parse(storedProfile);
        if (parsedProfile.role === "student") {
          console.log("Using profile from localStorage");
          setStudentProfile(parsedProfile);
          setLoading((prev) => ({ ...prev, profile: false }));
        }
      } catch (error) {
        console.error("Error parsing stored profile:", error);
      }
    }

    const fetchData = async () => {
      if (!currentUser?.uid) {
        console.error("No current user found");
        setLoading({ jobs: false, applications: false, profile: false });
        return () => {}; // Return empty cleanup function
      }

      // Utility function to safely convert Firestore timestamps
      const safeToDate = (timestamp: any): Date => {
        if (!timestamp) return new Date();
        if (timestamp instanceof Date) return timestamp;
        if (typeof timestamp.toDate === "function") return timestamp.toDate();
        return new Date(timestamp);
      };

      try {
        // If we didn't get profile from localStorage, try Firestore
        const storedProfile = localStorage.getItem("user");
        if (storedProfile) {
          try {
            const parsedProfile = JSON.parse(storedProfile);
            if (parsedProfile.role === "student") {
              console.log("Using profile from localStorage");
              setStudentProfile(parsedProfile);
              setLoading((prev) => ({ ...prev, profile: false }));
            }
          } catch (error) {
            console.error("Error parsing stored profile:", error);
          }
        } else {
          console.log("Fetching student profile from Firestore...");
          const collectionsToTry = ["students", "users"];
          let profileFound = false;

          for (const collectionName of collectionsToTry) {
            try {
              const profileRef = doc(db, collectionName, currentUser.uid);
              const profileSnap = await getDoc(profileRef);

              if (profileSnap.exists()) {
                const profileData = profileSnap.data();
                if (profileData.role === "student") {
                  console.log(`Found profile in ${collectionName} collection`);
                  setStudentProfile(profileData);
                  localStorage.setItem("user", JSON.stringify(profileData));
                  profileFound = true;
                  break;
                }
              }
            } catch (error) {
              console.error(`Error fetching from ${collectionName}:`, error);
            }
          }

          if (!profileFound) {
            console.error("Student profile not found in any collection");
          }

          setLoading((prev) => ({ ...prev, profile: false }));
        }

        // Fetch active jobs
        console.log("Fetching active jobs...");
        const jobsQuery = query(
          collection(db, "jobPosts"),
          where("status", "==", "active")
        );

        const unsubscribeJobs = onSnapshot(
          jobsQuery,
          (snapshot) => {
            const jobsData = snapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                createdAt: safeToDate(data.createdAt),
                // Handle other potential date fields
                updatedAt: safeToDate(data.updatedAt),
                deadline: safeToDate(data.deadline),
              };
            });
            console.log("Fetched jobs:", jobsData);
            setJobs(jobsData);
            setLoading((prev) => ({ ...prev, jobs: false }));
          },
          (error) => {
            console.error("Error fetching jobs:", error);
            setLoading((prev) => ({ ...prev, jobs: false }));
          }
        );

        // Fetch applications
        console.log("Fetching applications...");
        const appsQuery = query(
          collection(db, "applications"),
          where("studentId", "==", currentUser.uid)
        );

        const unsubscribeApps = onSnapshot(
          appsQuery,
          (snapshot) => {
            const apps = snapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                appliedAt: safeToDate(data.appliedAt),
                // Handle other potential date fields
                updatedAt: safeToDate(data.updatedAt),
                decisionDate: safeToDate(data.decisionDate),
              };
            });
            console.log("Fetched applications:", apps);
            setApplications(apps);
            setLoading((prev) => ({ ...prev, applications: false }));
          },
          (error) => {
            console.error("Error fetching applications:", error);
            setLoading((prev) => ({ ...prev, applications: false }));
          }
        );

        return () => {
          unsubscribeJobs();
          unsubscribeApps();
        };
      } catch (error) {
        console.error("Error in fetchData:", error);
        setLoading({ jobs: false, applications: false, profile: false });
        return () => {}; // Return empty cleanup function in case of error
      }
    };

    fetchData();
  }, [currentUser]); // Removed studentProfile from dependencies

  const handleApply = (jobId: string) => {
    setShowApplicationForm(jobId);
  };

  const handleSubmitApplication = async (jobId: string) => {
    // Show loading toast
    const toastId = toast.loading("Submitting your application...", {
      description: "Please wait while we process your application",
    });

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Authentication required", {
          description: "Please sign in to apply for jobs",
        });
        throw new Error("Not authenticated");
      }

      const job = jobs.find((j) => j.id === jobId);
      if (!job) {
        toast.error("Job not found", {
          description: "The job you are trying to apply for does not exist",
        });
        throw new Error("Job not found");
      }

      // Create a clean student profile object
      const cleanStudentProfile = {
        firstName: studentProfile?.firstName,
        lastName: studentProfile?.lastName,
        middleName: studentProfile?.middleName,
        email: studentProfile?.email,
        phone: studentProfile?.phone,
        gender: studentProfile?.gender,
        dob: studentProfile?.dob,
        tenthPercentage: studentProfile?.tenthPercentage,
        twelfthPercentage: studentProfile?.twelfthPercentage,
        cgpa: studentProfile?.cgpa,
        branch: studentProfile?.branch,
        semester: studentProfile?.semester,
        backlogs: studentProfile?.backlogs,
      };

      const applicationData = {
        jobId,
        jobTitle: job.jobTitle,
        companyName: job.companyName,
        studentId: user.uid,
        studentName: `${studentProfile?.firstName} ${studentProfile?.lastName}`,
        studentEmail: studentProfile?.email,
        status: "pending",
        appliedAt: serverTimestamp(),
        internshipCount,
        internshipMonths,
        hasProjects,
        projects: hasProjects === "Yes" ? projects : [],
        studentProfile: cleanStudentProfile,
      };

      // Add to applications collection
      const applicationRef = await addDoc(
        collection(db, "applications"),
        applicationData
      );

      // Add to job's applicants subcollection
      await addDoc(collection(db, "jobPosts", jobId, "applicants"), {
        studentId: user.uid,
        applicationId: applicationRef.id,
        status: "pending",
        appliedAt: serverTimestamp(),
      });

      // Update toast to success
      toast.success("Application submitted successfully!", {
        id: toastId,
        description: `You've applied for ${job.jobTitle} at ${job.companyName}`,
        action: {
          label: "View Applications",
          onClick: () => setActiveTab("applied"),
        },
        duration: 10000, // Show for 10 seconds
      });

      setShowApplicationForm(null);
      // Reset form fields
      setInternshipCount("0");
      setInternshipMonths("0");
      setHasProjects("No");
      setProjects([
        { link: "", description: "" },
        { link: "", description: "" },
        { link: "", description: "" },
      ]);
    } catch (error) {
      console.error("Error submitting application:", error);

      // Update toast to error
      toast.error("Failed to submit application", {
        id: toastId,
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        action: {
          label: "Try Again",
          onClick: () => handleSubmitApplication(jobId),
        },
        duration: 10000,
      });
    }
  };

  const toggleExpand = (jobId: string) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  const handleProjectChange = (index: number, field: string, value: string) => {
    const newProjects = [...projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setProjects(newProjects);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved": // Changed from "selected" to "approved"
        return (
          <Badge className="bg-green-100 text-green-800 text-xs sm:text-sm">
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 text-xs sm:text-sm">
            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 text-xs sm:text-sm">
            <PendingIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "approved": // Changed from "selected" to match your status
        return (
          <div className="bg-green-50 p-3 rounded-lg border border-green-100 mb-4">
            <p className="text-green-700 text-sm">
              ✅ You have been selected! The recruiter will contact you via your
              email ID or registered phone number.
            </p>
          </div>
        );
      case "rejected":
        return (
          <div className="bg-red-50 p-3 rounded-lg border border-red-100 mb-4">
            <p className="text-red-700 text-sm">
              ❌ You have not been selected for this position.
            </p>
          </div>
        );
      default:
        return (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
            <p className="text-blue-700 text-sm">
              🕐 Your application is pending review by the recruiter.
            </p>
          </div>
        );
    }
  };
  const availableJobs = jobs.filter(
    (job) => !applications.some((app) => app.jobId === job.id)
  );
  const appliedJobs = useMemo(() => {
    return applications.map((app) => {
      const job = jobs.find((j) => j.id === app.jobId);
      return {
        ...app,
        ...job,
        // Ensure status comes from the application, not the job
        status: app.status,
      };
    });
  }, [applications, jobs]);

  const getProfileImage = () => {
    return studentProfile?.gender === "Female"
      ? "https://cdn-icons-png.flaticon.com/512/4140/4140047.png"
      : "https://cdn-icons-png.flaticon.com/512/4140/4140048.png";
  };

  if (loading.profile || !studentProfile) {
    console.log("Loading profile...", { loading, studentProfile });
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  console.log("Rendering with data:", {
    jobs,
    applications,
    studentProfile,
    availableJobs,
    appliedJobs,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl pt-20 font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-1 sm:pt-20">
            <TypeAnimation
              sequence={[
                "Your Dream Career Awaits",
                1000,
                "Find Your Perfect Job Match",
                1000,
                "Launch Your Professional Journey",
                1000,
              ]}
              wrapper="span"
              speed={50}
              style={{ display: "inline-block" }}
              repeat={Infinity}
            />
          </h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <Button
            variant={activeTab === "available" ? "default" : "outline"}
            onClick={() => setActiveTab("available")}
            className="gap-2 text-xs sm:text-sm"
            size="sm"
          >
            <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />
            Available Jobs ({availableJobs.length})
          </Button>
          <Button
            variant={activeTab === "applied" ? "default" : "outline"}
            onClick={() => setActiveTab("applied")}
            className="gap-2 text-xs sm:text-sm"
            size="sm"
          >
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            My Applications ({appliedJobs.length})
          </Button>
          <Button
            variant={activeTab === "profile" ? "default" : "outline"}
            onClick={() => setActiveTab("profile")}
            className="gap-2 text-xs sm:text-sm"
            size="sm"
          >
            <User className="h-3 w-3 sm:h-4 sm:w-4" />
            Your Profile
          </Button>
        </div>

        {/* Available Jobs Section */}
        <AnimatePresence mode="wait">
          {activeTab === "available" && (
            <motion.section
              key="available"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3 sm:space-y-4"
            >
              {loading.jobs ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : availableJobs.length > 0 ? (
                availableJobs.map((job) => (
                  <Card
                    key={job.id}
                    className="border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-white/90 backdrop-blur-sm"
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div>
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                            {job.jobTitle}
                          </h3>
                          <p className="text-sm sm:text-base text-gray-600">
                            {job.companyName}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            className="text-xs sm:text-sm"
                            onClick={() => handleApply(job.id)}
                          >
                            Apply Now
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800"
                            onClick={() => toggleExpand(job.id)}
                          >
                            {expandedJob === job.id
                              ? "Hide Details"
                              : "View Details"}
                            <ChevronDown
                              className={`h-3 w-3 sm:h-4 sm:w-4 ml-1 transition-transform ${
                                expandedJob === job.id ? "rotate-180" : ""
                              }`}
                            />
                          </Button>
                        </div>
                      </div>

                      {/* Application Form */}
                      {showApplicationForm === job.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100"
                        >
                          <h4 className="font-medium text-sm sm:text-base text-blue-800 mb-3">
                            Additional Application Information
                          </h4>
                          <p className="text-xs sm:text-sm text-blue-600 mb-4">
                            By default, your saved profile information will also
                            be sent to the recruiter along with this
                            application.
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                How many internships have you done?
                              </label>
                              <select
                                value={internshipCount}
                                onChange={(e) =>
                                  setInternshipCount(e.target.value)
                                }
                                className="w-full text-xs sm:text-sm h-8 sm:h-9 border border-gray-300 rounded-md px-2"
                              >
                                {[0, 1, 2, 3, 4, 5].map((num) => (
                                  <option key={num} value={num}>
                                    {num}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Total internship experience (in months)
                              </label>
                              <select
                                value={internshipMonths}
                                onChange={(e) =>
                                  setInternshipMonths(e.target.value)
                                }
                                className="w-full text-xs sm:text-sm h-8 sm:h-9 border border-gray-300 rounded-md px-2"
                              >
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                                  (num) => (
                                    <option key={num} value={num}>
                                      {num}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                              Have you worked on any projects?
                            </label>
                            <div className="flex gap-4">
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="hasProjects"
                                  value="Yes"
                                  checked={hasProjects === "Yes"}
                                  onChange={() => setHasProjects("Yes")}
                                  className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600"
                                />
                                <span className="ml-2 text-xs sm:text-sm">
                                  Yes
                                </span>
                              </label>
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="hasProjects"
                                  value="No"
                                  checked={hasProjects === "No"}
                                  onChange={() => setHasProjects("No")}
                                  className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600"
                                />
                                <span className="ml-2 text-xs sm:text-sm">
                                  No
                                </span>
                              </label>
                            </div>
                          </div>

                          {hasProjects === "Yes" && (
                            <div className="space-y-3 mb-4">
                              {projects.map((project, index) => (
                                <div
                                  key={index}
                                  className="bg-white p-3 rounded border border-gray-200"
                                >
                                  <h5 className="text-xs sm:text-sm font-medium mb-2">
                                    Project {index + 1}
                                  </h5>
                                  <div className="space-y-2">
                                    <div>
                                      <label className="block text-xs text-gray-500 mb-1">
                                        Link (optional)
                                      </label>
                                      <input
                                        type="text"
                                        value={project.link}
                                        onChange={(e) =>
                                          handleProjectChange(
                                            index,
                                            "link",
                                            e.target.value
                                          )
                                        }
                                        className="w-full text-xs sm:text-sm h-8 border border-gray-300 rounded-md px-2"
                                        placeholder="https://example.com/project"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-500 mb-1">
                                        Description (optional)
                                      </label>
                                      <textarea
                                        value={project.description}
                                        onChange={(e) =>
                                          handleProjectChange(
                                            index,
                                            "description",
                                            e.target.value
                                          )
                                        }
                                        className="w-full text-xs sm:text-sm h-16 border border-gray-300 rounded-md px-2 py-1"
                                        placeholder="Brief description of the project"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs sm:text-sm"
                              onClick={() => setShowApplicationForm(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              className="text-xs sm:text-sm"
                              onClick={() => handleSubmitApplication(job.id)}
                            >
                              Submit Application
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                        <div className="flex items-center text-gray-700">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-indigo-500" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-500" />
                          <span>{job.salaryRange}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-yellow-500" />
                          <span>
                            Posted:{" "}
                            {job.createdAt
                              ? job.createdAt.toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedJob === job.id &&
                          showApplicationForm !== job.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="mt-4 sm:mt-6"
                            >
                              <div className="border-t border-gray-200 pt-4 sm:pt-6">
                                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                                  <h4 className="font-medium text-sm sm:text-base text-gray-800 mb-2 flex items-center">
                                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-500" />
                                    Job Description
                                  </h4>
                                  <p className="text-xs sm:text-sm text-gray-600">
                                    {job.jobDescription}
                                  </p>
                                </div>

                                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                  <h4 className="font-medium text-sm sm:text-base text-gray-800 mb-2">
                                    Skills Required
                                  </h4>
                                  <div className="flex flex-wrap gap-1 sm:gap-2">
                                    {job.skillsRequired?.map(
                                      (skill: string, index: number) => (
                                        <Badge
                                          key={index}
                                          variant="secondary"
                                          className="text-xs sm:text-sm bg-indigo-100 text-indigo-700"
                                        >
                                          {skill}
                                        </Badge>
                                      )
                                    )}
                                  </div>
                                </div>

                                <div className="mt-4 sm:mt-6">
                                  <h4 className="font-medium text-sm sm:text-base text-gray-800 mb-2">
                                    Eligibility Criteria
                                  </h4>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                                      <span className="font-medium">
                                        Min CGPA:
                                      </span>{" "}
                                      {job.minCGPA}
                                    </div>
                                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                                      <span className="font-medium">
                                        10th %:
                                      </span>{" "}
                                      {job.minTenthPercentage}%
                                    </div>
                                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                                      <span className="font-medium">
                                        12th %:
                                      </span>{" "}
                                      {job.minTwelfthPercentage}%
                                    </div>
                                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                                      <span className="font-medium">
                                        Max Backlogs:
                                      </span>{" "}
                                      {job.maxBacklogs}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                      </AnimatePresence>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
                  <p className="text-sm sm:text-base text-gray-500">
                    No available jobs at the moment. Please check back later.
                  </p>
                </div>
              )}
            </motion.section>
          )}

          {/* My Applications Section */}
          {activeTab === "applied" && (
            <motion.section
              key="applied"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3 sm:space-y-4"
            >
              {loading.applications ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : appliedJobs.length > 0 ? (
                appliedJobs.map((application) => (
                  <Card
                    key={application.id}
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="p-4 sm:p-6">
                      {/* Status message at the top */}
                      {getStatusMessage(application.status)}

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div>
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                            {application.jobTitle}
                          </h3>
                          <p className="text-sm sm:text-base text-gray-600">
                            {application.companyName}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(application.status)}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs sm:text-sm text-gray-500 hover:text-gray-700"
                            onClick={() => toggleExpand(application.jobId)}
                          >
                            {expandedJob === application.jobId
                              ? "Hide Details"
                              : "View Details"}
                            <ChevronDown
                              className={`h-3 w-3 sm:h-4 sm:w-4 ml-1 transition-transform ${
                                expandedJob === application.jobId
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </Button>
                        </div>
                      </div>

                      {/* Job details */}
                      <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                        <div className="flex items-center text-gray-700">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-indigo-500" />
                          <span>{application.location}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-500" />
                          <span>{application.salaryRange}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-yellow-500" />
                          <span>
                            Applied on:{" "}
                            {application.appliedAt
                              ? application.appliedAt.toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* Expanded details */}
                      <AnimatePresence>
                        {expandedJob === application.jobId && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-4 sm:mt-6"
                          >
                            <div className="border-t border-gray-200 pt-4 sm:pt-6">
                              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                                <h4 className="font-medium text-sm sm:text-base text-gray-800 mb-2 flex items-center">
                                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-500" />
                                  Job Description
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-600">
                                  {application.jobDescription}
                                </p>
                              </div>

                              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                <h4 className="font-medium text-sm sm:text-base text-gray-800 mb-2">
                                  Skills Required
                                </h4>
                                <div className="flex flex-wrap gap-1 sm:gap-2">
                                  {application.skillsRequired?.map(
                                    (skill: string, index: number) => (
                                      <Badge
                                        key={index}
                                        variant="secondary"
                                        className="text-xs sm:text-sm"
                                      >
                                        {skill}
                                      </Badge>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
                  <p className="text-sm sm:text-base text-gray-500">
                    You haven't applied to any jobs yet.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-3 sm:mt-4 text-xs sm:text-sm"
                    size="sm"
                    onClick={() => setActiveTab("available")}
                  >
                    Browse Available Jobs
                  </Button>
                </div>
              )}
            </motion.section>
          )}

          {/* Your Profile Section */}
          {activeTab === "profile" && (
            <motion.section
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3 sm:space-y-4"
            >
              <Card className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={getProfileImage()}
                        alt="Profile"
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-indigo-100"
                      />
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                          {studentProfile.firstName} {studentProfile.middleName}{" "}
                          {studentProfile.lastName}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600">
                          {studentProfile.branch}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        First Name
                      </FormLabel>
                      <div className="text-sm sm:text-base">
                        {studentProfile.firstName}
                      </div>
                    </FormItem>

                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        Middle Name
                      </FormLabel>
                      <div className="text-sm sm:text-base">
                        {studentProfile.middleName || "-"}
                      </div>
                    </FormItem>

                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        Last Name
                      </FormLabel>
                      <div className="text-sm sm:text-base">
                        {studentProfile.lastName}
                      </div>
                    </FormItem>

                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        Gender
                      </FormLabel>
                      <div className="text-sm sm:text-base">
                        {studentProfile.gender}
                      </div>
                    </FormItem>

                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        Phone
                      </FormLabel>
                      <div className="text-sm sm:text-base">
                        {studentProfile.phone}
                      </div>
                    </FormItem>

                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        Email
                      </FormLabel>
                      <div className="text-sm sm:text-base">
                        {studentProfile.email}
                      </div>
                    </FormItem>

                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        Date of Birth
                      </FormLabel>
                      <div className="text-sm sm:text-base">
                        {new Date(studentProfile.dob).toLocaleDateString()}
                      </div>
                    </FormItem>

                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        10th %
                      </FormLabel>
                      <div className="text-sm sm:text-base">
                        {studentProfile.tenthPercentage}%
                      </div>
                    </FormItem>

                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        12th %
                      </FormLabel>
                      <div className="text-sm sm:text-base">
                        {studentProfile.twelfthPercentage}%
                      </div>
                    </FormItem>

                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">CGPA</FormLabel>
                      <div className="text-sm sm:text-base">
                        {studentProfile.cgpa}/10
                      </div>
                    </FormItem>

                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        Branch
                      </FormLabel>
                      <div className="text-sm sm:text-base">
                        {studentProfile.branch}
                      </div>
                    </FormItem>

                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        Semester
                      </FormLabel>
                      <div className="text-sm sm:text-base">
                        {studentProfile.semester}
                      </div>
                    </FormItem>

                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        Backlogs
                      </FormLabel>
                      <div className="text-sm sm:text-base">
                        {studentProfile.backlogs}
                      </div>
                    </FormItem>
                  </div>
                </div>
              </Card>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-8 sm:mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default JobListingsPage;
