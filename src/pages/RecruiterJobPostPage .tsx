import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  User,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Layers,
  Award,
  FileText,
  Globe,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Loader2,
  Plus,
  Users, // Add this import
  Trash2, // Also add this since it's used in the ManageJobs component
  Menu, // Add this for the mobile menu
  List, // Add this for the manage jobs tab
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  db,
} from "@/backend/FirebaseConfig";
import { auth } from "@/backend/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  status: "pending" | "approved" | "rejected";
  appliedAt: Date | null;
  updatedAt?: Date | null;
  internshipCount?: number;
  internshipMonths?: number;
  hasProjects?: boolean;
  projects?: Array<{
    title?: string;
    description: string;
    link?: string;
    technologies?: string[];
  }>;
  studentProfile?: {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    gender?: string;
    dob?: Date | string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    bio?: string;
    cgpa?: number | string;
    tenthPercentage?: number | string;
    twelfthPercentage?: number | string;
    branch?: string;
    semester?: number | string;
    backlogs?: number;
    skills?: string[];
    certifications?: Array<{
      name: string;
      issuer: string;
      date: Date | string;
      credentialId?: string;
      url?: string;
    }>;
    socialLinks?: {
      github?: string;
      linkedin?: string;
      twitter?: string;
      portfolio?: string;
    };
    resumeUrl?: string;
  };
}

// Zod schema for job post validation
const jobPostSchema = z.object({
  jobTitle: z
    .string()
    .min(5, "Job title must be at least 5 characters")
    .max(100),
  companyName: z.string().min(2, "Company name is required").max(100),
  companyDescription: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(500),
  jobDescription: z
    .string()
    .min(100, "Job description must be at least 100 characters")
    .max(2000),
  location: z.string().min(2, "Location is required").max(100),
  salaryRange: z.string().min(1, "Salary range is required").max(50),
  jobType: z.enum(["Full-time", "Part-time", "Contract", "Internship"]),
  skillsRequired: z
    .array(z.string().min(1, "Skill cannot be empty"))
    .min(1, "At least one skill is required"),
  minCGPA: z.number().min(0).max(10, "CGPA must be between 0 and 10"),
  minTenthPercentage: z
    .number()
    .min(0)
    .max(100, "Percentage must be between 0 and 100"),
  minTwelfthPercentage: z
    .number()
    .min(0)
    .max(100, "Percentage must be between 0 and 100"),
  maxBacklogs: z.number().min(0, "Backlogs cannot be negative"),
});

// Job Post Form Component
const JobPostForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [skillsInput, setSkillsInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const form = useForm<z.infer<typeof jobPostSchema>>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      jobTitle: "",
      companyName: "",
      companyDescription: "",
      jobDescription: "",
      location: "",
      salaryRange: "",
      jobType: "Full-time",
      skillsRequired: [],
      minCGPA: 0,
      minTenthPercentage: 0,
      minTwelfthPercentage: 0,
      maxBacklogs: 0,
    },
  });

  const addSkill = () => {
    if (skillsInput.trim() && !skills.includes(skillsInput.trim())) {
      const newSkills = [...skills, skillsInput.trim()];
      setSkills(newSkills);
      form.setValue("skillsRequired", newSkills); // Update form value
      setSkillsInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const newSkills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(newSkills);
    form.setValue("skillsRequired", newSkills); // Update form value
  };

  const onSubmit = async (data: z.infer<typeof jobPostSchema>) => {
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("You must be logged in to post a job");
      }

      const jobPostData = {
        ...data,
        recruiterId: user.uid,
        recruiterEmail: user.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: "active",
      };

      await addDoc(collection(db, "jobPosts"), jobPostData);

      toast({
        title: "🎉 Job Posted Successfully",
        description: "Your job listing is now live and visible to candidates.",
        className: "bg-green-100 border-green-500 text-green-700",
      });

      form.reset();
      setSkills([]);
    } catch (error) {
      console.error("Error posting job:", error);
      toast({
        title: "⚠️ Error",
        description: error.message || "Failed to post job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CardTitle className="text-2xl md:text-3xl font-bold">
              Create Job Posting
            </CardTitle>
            <p className="text-indigo-100 mt-2">
              Fill in the details to post a new job opportunity
            </p>
          </motion.div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Job Title *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Software Engineer"
                            {...field}
                            className="h-12 text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jobType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Job Type *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 text-base">
                              <SelectValue placeholder="Select job type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Full-time">Full-time</SelectItem>
                            <SelectItem value="Part-time">Part-time</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
                            <SelectItem value="Internship">
                              Internship
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Location *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Bangalore, India"
                            {...field}
                            className="h-12 text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salaryRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Salary Range *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. ₹6L - ₹10L per annum"
                            {...field}
                            className="h-12 text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Company Name *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your company name"
                            {...field}
                            className="h-12 text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Company Description *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief about your company..."
                            className="min-h-[120px] text-base"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <FormField
                  control={form.control}
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Job Description *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed job description, responsibilities, requirements, etc."
                          className="min-h-[180px] text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <FormLabel className="text-gray-700 font-medium">
                  Required Skills *
                </FormLabel>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    placeholder="Add a skill (e.g. JavaScript)"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addSkill())
                    }
                    className="h-12 text-base"
                  />
                  <Button
                    type="button"
                    onClick={addSkill}
                    variant="secondary"
                    className="h-12 gap-2"
                  >
                    <Plus size={18} />
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {skills.map((skill) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Badge
                          variant="secondary"
                          className="px-3 py-1.5 text-sm flex items-center gap-1.5 rounded-full"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <X size={14} />{" "}
                            {/* This is where the error occurs */}
                          </button>
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                {form.formState.errors.skillsRequired && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.skillsRequired.message}
                  </p>
                )}
              </motion.div>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <FormField
                  control={form.control}
                  name="minCGPA"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Minimum CGPA
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            placeholder="e.g. 7.5"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                            className="h-12 text-base"
                          />
                          <span className="absolute right-3 top-3 text-gray-400">
                            /10
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minTenthPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Minimum 10th %
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="e.g. 75"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                            className="h-12 text-base"
                          />
                          <span className="absolute right-3 top-3 text-gray-400">
                            %
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minTwelfthPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Minimum 12th %
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="e.g. 75"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                            className="h-12 text-base"
                          />
                          <span className="absolute right-3 top-3 text-gray-400">
                            %
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxBacklogs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Max Backlogs Allowed
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="e.g. 2"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                          className="h-12 text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                className="flex justify-end pt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 px-8 text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Posting Job...
                    </>
                  ) : (
                    <>
                      <Briefcase className="mr-2 h-5 w-5" />
                      Post Job Opportunity
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Updated ApplicantDetails component
const ApplicantDetails = ({
  application,
  onStatusChange,
}: {
  application: Application;
  onStatusChange: (
    id: string,
    status: "approved" | "rejected"
  ) => Promise<void>;
}) => {
  const [expanded, setExpanded] = useState(false);
  const profile = application.studentProfile || {};
  const appliedDate =
    application.appliedAt?.toLocaleDateString() || "Not available";
  const updatedDate =
    application.updatedAt?.toLocaleDateString() || "Not updated";
  const dobDate =
    profile.dob instanceof Date
      ? profile.dob.toLocaleDateString()
      : profile.dob || "Not provided";

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={
                  profile.gender === "Female"
                    ? "https://cdn-icons-png.flaticon.com/512/4140/4140047.png"
                    : "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
                }
              />
              <AvatarFallback>
                {profile.firstName?.[0]}
                {profile.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">
                {profile.firstName} {profile.middleName} {profile.lastName}
              </CardTitle>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <Mail className="h-4 w-4 mr-1" />
                <span>{application.studentEmail}</span>
              </div>
              {profile.phone && (
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Phone className="h-4 w-4 mr-1" />
                  <span>{profile.phone}</span>
                </div>
              )}
            </div>
          </div>
          <Badge
            variant={
              application.status === "approved"
                ? "default"
                : application.status === "rejected"
                ? "destructive"
                : "secondary"
            }
            className="text-sm"
          >
            {application.status}
          </Badge>
        </div>
        <div className="mt-4 bg-blue-50 p-3 rounded-lg">
          <h3 className="font-semibold text-blue-800 flex items-center">
            <Briefcase className="h-4 w-4 mr-2" />
            Applied for:{" "}
            <span className="ml-1 font-bold text-blue-900">
              {application.jobTitle}
            </span>
            <span className="text-sm text-blue-700 mt-1">
              {" ,"} at {application.companyName}
            </span>
          </h3>
        </div>
      </CardHeader>

      <CardContent>
        {/* Basic Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <h3 className="font-medium flex items-center">
              <User className="h-4 w-4 mr-2" />
              Personal Details
            </h3>
            <div className="text-sm">
              <p>
                <span className="text-gray-500">Gender:</span>{" "}
                {profile.gender || "Not provided"}
              </p>
              <p>
                <span className="text-gray-500">DOB:</span> {dobDate}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium flex items-center">
              <GraduationCap className="h-4 w-4 mr-2" />
              Education
            </h3>
            <div className="text-sm">
              <p>
                <span className="text-gray-500">Branch:</span>{" "}
                {profile.branch || "Not provided"}
              </p>
              <p>
                <span className="text-gray-500">Semester:</span>{" "}
                {profile.semester || "Not provided"}
              </p>
              <p>
                <span className="text-gray-500">CGPA:</span>{" "}
                {profile.cgpa || "Not provided"}
              </p>
              <p>
                <span className="text-gray-500">Backlogs:</span>{" "}
                {profile.backlogs ?? "Not provided"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Academic History
            </h3>
            <div className="text-sm">
              <p>
                <span className="text-gray-500">10th %:</span>{" "}
                {profile.tenthPercentage || "Not provided"}
              </p>
              <p>
                <span className="text-gray-500">12th %:</span>{" "}
                {profile.twelfthPercentage || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Professional Experience Section */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium flex items-center mb-2">
              <Briefcase className="h-4 w-4 mr-2" />
              Internships Completed
            </h3>
            <div className="text-sm">
              <span className="text-gray-500">Total Internships :</span>{" "}
              {application.internshipCount || "0"}
            </div>
          </div>
          <div>
            <h3 className="font-medium flex items-center mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              Internship Experience
            </h3>
            <div className="text-sm">
              <span className="text-gray-500">
                Toatal Internship Experience:
              </span>{" "}
              {application.internshipMonths || "0"} months
            </div>
          </div>
          <div>
            <h3 className="font-medium flex items-center mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              Application Timeline
            </h3>
            <div className="text-sm">
              <span className="text-gray-500">Applied:</span> {appliedDate}
            </div>
          </div>
        </div>

        {/* Projects Section */}
        {application.projects?.length ? (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium flex items-center">
                <Layers className="h-4 w-4 mr-2" />
                Projects ({application.projects.length})
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="text-sm"
              >
                {expanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Collapse
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Expand
                  </>
                )}
              </Button>
            </div>

            {expanded && (
              <div className="space-y-4">
                {application.projects.map((project, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-2">
                      {project.title && (
                        <h4 className="font-medium">{project.title}</h4>
                      )}
                      <p className="text-sm">{project.description}</p>
                      {project.technologies?.length ? (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.technologies.map((tech, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-blue-600 hover:underline mt-2"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Project
                        </a>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* Action Buttons */}
        <div className="flex justify-end pt-4 border-t">
          <div className="space-x-2">
            <Button
              variant="destructive"
              onClick={() => onStatusChange(application.id, "rejected")}
              disabled={application.status === "rejected"}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              onClick={() => onStatusChange(application.id, "approved")}
              disabled={application.status === "approved"}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Updated ApplicantsList component
const ApplicantsList = ({
  applications,
  onStatusChange,
}: {
  applications: Application[];
  onStatusChange: (
    id: string,
    status: "approved" | "rejected"
  ) => Promise<void>;
}) => {
  return (
    <div className="space-y-6">
      {applications.length > 0 ? (
        applications.map((application) => (
          <ApplicantDetails
            key={application.id}
            application={application}
            onStatusChange={onStatusChange}
          />
        ))
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
            <Users className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No applications found
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Students who apply to your jobs will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

// Manage Jobs Component
const ManageJobs = ({
  jobs,
  onDelete,
}: {
  jobs: any[];
  onDelete: (jobId: string) => Promise<void>;
}) => {
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async (jobId: string) => {
    setDeleting(jobId);
    try {
      await onDelete(jobId);
    } catch (error) {
      toast({
        title: "⚠️ Error",
        description: error.message || "Failed to delete job",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CardTitle className="text-2xl md:text-3xl font-bold">
              Manage Your Job Postings
            </CardTitle>
            <p className="text-indigo-100 mt-2">
              View, edit, or delete your active job postings
            </p>
          </motion.div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="space-y-6">
            {jobs.length > 0 ? (
              <AnimatePresence>
                {jobs.map((job) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {job.jobTitle}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {job.companyName} • {job.location}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Badge variant="outline" className="text-sm">
                            {job.jobType}
                          </Badge>
                          <Badge variant="outline" className="text-sm">
                            {job.salaryRange}
                          </Badge>
                          <Badge variant="outline" className="text-sm">
                            {job.status}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(job.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        disabled={deleting === job.id}
                      >
                        {deleting === job.id ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </Button>
                    </div>
                    <div className="mt-4">
                      <p className="text-gray-700 line-clamp-2">
                        {job.jobDescription}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.skillsRequired?.map((skill: string) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="px-3 py-1 text-sm rounded-full"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                  <Briefcase className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No jobs posted yet
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  You haven't posted any jobs yet. Create your first job posting
                  to get started.
                </p>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Main Recruiter Dashboard Component
const RecruiterJobPostPage = () => {
  const [activeTab, setActiveTab] = useState<
    "jobPosting" | "applicants" | "manageJobs"
  >("jobPosting");
  const [applications, setApplications] = useState<any[]>([]);
  const [postedJobs, setPostedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  // Fetch recruiter's jobs and applications
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Fetch recruiter's jobs
        const jobsQuery = query(
          collection(db, "jobPosts"),
          where("recruiterId", "==", user.uid)
        );

        const unsubscribeJobs = onSnapshot(
          jobsQuery,
          async (jobsSnapshot) => {
            const jobs = jobsSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data().createdAt?.toDate(),
              updatedAt: doc.data().updatedAt?.toDate(),
            }));
            setPostedJobs(jobs);

            // Then fetch applications for these jobs
            if (jobs.length > 0) {
              const applicationsQuery = query(
                collection(db, "applications"),
                where(
                  "jobId",
                  "in",
                  jobs.map((job) => job.id)
                )
              );

              const unsubscribeApps = onSnapshot(
                applicationsQuery,
                (appsSnapshot) => {
                  const apps = appsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    appliedAt: doc.data().appliedAt?.toDate(),
                    updatedAt: doc.data().updatedAt?.toDate(),
                  }));
                  setApplications(apps);
                  setLoading(false);
                },
                (error) => {
                  console.error("Error fetching applications:", error);
                  setLoading(false);
                }
              );

              return unsubscribeApps;
            } else {
              setApplications([]);
              setLoading(false);
            }
          },
          (error) => {
            console.error("Error fetching jobs:", error);
            setLoading(false);
          }
        );

        return unsubscribeJobs;
      } else {
        setPostedJobs([]);
        setApplications([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleStatusChange = async (
    applicationId: string,
    newStatus: "approved" | "rejected"
  ) => {
    try {
      // 1. Update the main application document
      await updateDoc(doc(db, "applications", applicationId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
  
      // 2. Find the application in local state to get jobId
      const application = applications.find((app) => app.id === applicationId);
      if (!application) throw new Error("Application not found");
  
      // 3. Update all references in job's applicants subcollection
      const applicantsRef = collection(db, "jobPosts", application.jobId, "applicants");
      const q = query(applicantsRef, where("applicationId", "==", applicationId));
      const querySnapshot = await getDocs(q);
  
      const updatePromises = querySnapshot.docs.map((docSnapshot) =>
        updateDoc(docSnapshot.ref, {
          status: newStatus,
          updatedAt: serverTimestamp(),
        })
      );
  
      await Promise.all(updatePromises);
  
      // 4. Update local state
      setApplications(applications.map((app) =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
  
      toast({
        title: `Application ${newStatus}`,
        description: `Status updated successfully`,
        variant: newStatus === "approved" ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error updating application status:", error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      // First delete all applications for this job
      const applicationsQuery = query(
        collection(db, "applications"),
        where("jobId", "==", jobId)
      );
      const applicationsSnapshot = await getDocs(applicationsQuery);

      const deletePromises = applicationsSnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );

      // Also delete from job's applicants subcollection
      const applicantsRef = collection(db, "jobPosts", jobId, "applicants");
      const applicantsSnapshot = await getDocs(applicantsRef);

      applicantsSnapshot.docs.forEach((doc) => {
        deletePromises.push(deleteDoc(doc.ref));
      });

      await Promise.all(deletePromises);

      // Then delete the job itself
      await deleteDoc(doc(db, "jobPosts", jobId));

      toast({
        title: "🗑️ Job Deleted",
        description:
          "The job posting and all related applications have been deleted.",
        className: "bg-green-100 border-green-500 text-green-700",
      });
    } catch (error) {
      console.error("Error deleting job:", error);
      throw new Error("Failed to delete job");
    }
  };

  const handleTabChange = (tab: "jobPosting" | "applicants" | "manageJobs") => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/login">
                <Button variant="outline" className="mr-4 bg-slate-200">
                  ← Back
                </Button>
              </Link>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <motion.span
                  className="text-xl font-bold md:ml-20 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Recruiter Portal
                </motion.span>
              </div>
            </div>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <motion.button
                onClick={() => handleTabChange("jobPosting")}
                className={`${
                  activeTab === "jobPosting"
                    ? "border-indigo-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Briefcase className="mr-2 h-5 w-5" />
                Job Posting
              </motion.button>
              <motion.button
                onClick={() => handleTabChange("applicants")}
                className={`${
                  activeTab === "applicants"
                    ? "border-indigo-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Users className="mr-2 h-5 w-5" />
                View Applicants
              </motion.button>
              <motion.button
                onClick={() => handleTabChange("manageJobs")}
                className={`${
                  activeTab === "manageJobs"
                    ? "border-indigo-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <List className="mr-2 h-5 w-5" />
                Manage Jobs
              </motion.button>
            </div>

            <div className="sm:hidden flex items-center">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="top" className="pt-12">
                  <SheetHeader>
                    <SheetTitle className="text-left">Menu</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-4 py-4">
                    <Button
                      variant={
                        activeTab === "jobPosting" ? "secondary" : "ghost"
                      }
                      className="w-full justify-start"
                      onClick={() => handleTabChange("jobPosting")}
                    >
                      <Briefcase className="mr-2 h-5 w-5" />
                      Job Posting
                    </Button>
                    <Button
                      variant={
                        activeTab === "applicants" ? "secondary" : "ghost"
                      }
                      className="w-full justify-start"
                      onClick={() => handleTabChange("applicants")}
                    >
                      <Users className="mr-2 h-5 w-5" />
                      View Applicants
                    </Button>
                    <Button
                      variant={
                        activeTab === "manageJobs" ? "secondary" : "ghost"
                      }
                      className="w-full justify-start"
                      onClick={() => handleTabChange("manageJobs")}
                    >
                      <List className="mr-2 h-5 w-5" />
                      Manage Jobs
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === "jobPosting" ? (
              <JobPostForm />
            ) : activeTab === "applicants" ? (
              <ApplicantsList
                applications={applications}
                onStatusChange={handleStatusChange}
              />
            ) : (
              <ManageJobs jobs={postedJobs} onDelete={handleDeleteJob} />
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
};

export default RecruiterJobPostPage;
