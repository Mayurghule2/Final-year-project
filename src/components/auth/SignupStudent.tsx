// src/components/auth/SignupStudent.tsx
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Loader2,
  Eye,
  EyeOff,
  Phone,
  GraduationCap,
  Upload,
  ArrowLeft,
  Info,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { addDoc, auth, collection, db } from "@/backend/FirebaseConfig";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const studentFormSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(2, "Last name is required"),
    gender: z.string().min(1, "Gender is required"),
    registrationNo: z
      .string()
      .min(8, "Registration number is required")
      .length(8),
    phone: z.string().min(10, "Valid phone number is required").max(15),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
    dob: z.string().refine((val) => {
      const date = new Date(val);
      const now = new Date();
      const minAge = new Date();
      minAge.setFullYear(now.getFullYear() - 16);
      return date <= minAge;
    }, "You must be at least 16 years old"),
    tenthPercentage: z.string().refine(
      (val) => {
        const num = parseFloat(val);
        return num >= 0 && num <= 100;
      },
      { message: "Percentage must be between 0 and 100" }
    ),
    twelfthPercentage: z.string().refine(
      (val) => {
        const num = parseFloat(val);
        return num >= 0 && num <= 100;
      },
      { message: "Percentage must be between 0 and 100" }
    ),
    cgpa: z.string().refine(
      (val) => {
        const num = parseFloat(val);
        return num >= 0 && num <= 10;
      },
      { message: "CGPA must be between 0 and 10" }
    ),
    branch: z.string().min(1, "Branch is required"),
    branchCode: z.string().min(2),
    semester: z.string().min(1, "Semester is required"),
    backlogs: z.string().min(1, "Backlogs information is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const branchCodeMap: Record<string, string> = {
  "Computer Science & Engineering": "CS",
  "Information Technology": "IT",
  "Electronics & Telecommunication Engineering": "EN",
  "Electrical Engineering": "EE",
  "Mechanical Engineering": "ME",
  "Civil Engineering": "CE",
  "Instrumentation Engineering": "IN",
};

const StudentRegistration = ({
  setRegistration,
}: {
  setRegistration: (value: boolean | null) => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [studentPassword, setStudentPassword] = useState("");
  const [confirmStudentPassword, setConfirmStudentPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const branches = Object.keys(branchCodeMap);

  const genders = ["Male", "Female", "Prefer not to say", "Other"];

  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const backlogOptions = [
    "No Backlog",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
  ];

  const form = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "",
      registrationNo: "",
      phone: "",
      email: "",
      dob: "",
      tenthPercentage: "",
      twelfthPercentage: "",
      cgpa: "",
      branch: "",
      branchCode: "",
      semester: "",
      backlogs: "",
    },
  });

  const handleStudentSubmit = async (data: any) => {
    setLoading(true);

    if (studentPassword !== confirmStudentPassword) {
      toast({
        title: "Error",
        description: "Passwords doesn't match",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        studentPassword
      );

      await addDoc(collection(db, "students"), {
        ...data,
        uid: userCredential.user.uid,
        createdAt: new Date(),
        role: "student",
        status: "active",
      });

      resetForm();

      toast({
        title: "Student Created",
        description: `Student ${data.firstName} ${data.lastName} has been registered successfully.`,
      });
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
      setLoading(false);
    }
  };

  const resetForm = () => {
    form.reset();
    setStudentPassword("");
    setConfirmStudentPassword("");
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-4">
            <Button
              variant="outline"
              className="flex items-center"
              onClick={() => setRegistration(false)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="text-center mb-6">
            <GraduationCap className="h-12 w-12 mx-auto text-blue-500 mb-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Student Registration Form
            </h3>
            <p className="text-gray-500 text-sm">
              Create a new student account
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleStudentSubmit)}
              className="space-y-4 sm:space-y-6 py-2 sm:py-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="First Name"
                          {...field}
                          className="text-xs sm:text-sm h-8 sm:h-9"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="middleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        Middle Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Middle Name (Optional)"
                          {...field}
                          className="text-xs sm:text-sm h-8 sm:h-9"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Last Name"
                          {...field}
                          className="text-xs sm:text-sm h-8 sm:h-9"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3  gap-3 sm:gap-4">
                <FormField
                  control={form.control}
                  name="registrationNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        Registration Number
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="20017001"
                            className="text-xs sm:text-sm"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        Gender
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-xs sm:text-sm h-8 sm:h-9">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="text-xs sm:text-sm">
                          {genders.map((gender) => (
                            <SelectItem
                              key={gender}
                              value={gender}
                              className="text-xs sm:text-sm"
                            >
                              {gender}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        Phone Number
                      </FormLabel>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 text-gray-400" />
                        </div>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+91 9876543210"
                            className="text-xs sm:text-sm h-8 sm:h-9 pl-8"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        Date of Birth
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="text-xs sm:text-sm h-8 sm:h-9"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          {...field}
                          className="text-xs sm:text-sm h-8 sm:h-9"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <FormField
                  control={form.control}
                  name="tenthPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        10th Percentage
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="e.g. 85.5"
                          {...field}
                          className="text-xs sm:text-sm h-8 sm:h-9"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="twelfthPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        12th Percentage
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="e.g. 82.3"
                          {...field}
                          className="text-xs sm:text-sm h-8 sm:h-9"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cgpa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        CGPA
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="e.g. 8.5"
                          {...field}
                          className="text-xs sm:text-sm h-8 sm:h-9"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <FormField
                  control={form.control}
                  name="branch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        Branch
                      </FormLabel>
                      <Select
                        onValueChange={(selected) => {
                          field.onChange(selected);
                          form.setValue(
                            "branchCode",
                            branchCodeMap[selected]
                          );
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-xs sm:text-sm h-8 sm:h-9">
                            <SelectValue placeholder="Select branch" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="text-xs sm:text-sm max-h-60 overflow-y-auto">
                          {branches.map((branch) => (
                            <SelectItem key={branch} value={branch}>
                              {branch}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="semester"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        Semester
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-xs sm:text-sm h-8 sm:h-9">
                            <SelectValue placeholder="Select semester" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="text-xs sm:text-sm">
                          {semesters.map((semester) => (
                            <SelectItem
                              key={semester}
                              value={semester}
                              className="text-xs sm:text-sm"
                            >
                              {semester}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="backlogs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        Backlogs
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-xs sm:text-sm h-8 sm:h-9">
                            <SelectValue placeholder="Select backlogs" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="text-xs sm:text-sm">
                          {backlogOptions.map((option) => (
                            <SelectItem
                              key={option}
                              value={option}
                              className="text-xs sm:text-sm"
                            >
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        Password
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="********"
                            {...field}
                            className="text-xs sm:text-sm h-8 sm:h-9 pr-8"
                          />
                        </FormControl>
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        Confirm Password
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={
                              showConfirmPassword ? "text" : "password"
                            }
                            placeholder="Confirm your password"
                            {...field}
                            className="text-xs sm:text-sm h-8 sm:h-9 pr-8"
                          />
                        </FormControl>
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-9 sm:h-10"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Student Account"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const SignupStudent = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleRegisterClick = () => {
    setShowRegistration(true);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the input value
    }
  };

  const handleBulkUploadClick = () => {
    fileInputRef.current?.click(); // programmatically open file picker
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processBulkUpload(file); // Call function to handle parsing + uploading
  };

  const processBulkUpload = async (file: File) => {
    try {
      setLoading(true);
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      // defval: "" ensures missing cells come through as empty strings
      const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      console.log(rows);

      if (rows.length === 0) {
        throw new Error("File is empty or not recognized.");
      }
      if (rows.length > 100) {
        throw new Error("Max 100 records allowed per upload.");
      }

      // 2) Validate every row first
      const mandatory = [
        "firstName",
        "lastName",
        "gender",
        "registrationNo",
        "phone",
        "email",
        "dob",
        "tenthPercentage",
        "twelfthPercentage",
        "cgpa",
        "branch",
        "semester",
        "backlogs",
      ];
      for (let idx = 0; idx < rows.length; idx++) {
        const row = rows[idx];
        const missing = mandatory.filter(
          (field) =>
            row[field] === undefined ||
            row[field] === null ||
            String(row[field]).trim() === ""
        );

        if (missing.length) {
          throw new Error(
            `Row ${idx + 2}: missing fields → ${missing.join(", ")}`
          );
        }

        // Branch validity check
        if (!branchCodeMap[row.branch]) {
          throw new Error(
            `Row ${idx + 2}: invalid branch "${row.branch}"`
          );
        }

        // Check if email already registered in Auth
        // It will not work, as fetchSignInMethodsForEmail is disabled by firebase
        const methods = await fetchSignInMethodsForEmail(
          auth,
          row.email.trim()
        );
        if (methods.length > 0) {
          throw new Error(
            `Row ${idx + 2}: Email already registered → ${row.email}`
          );
        }
      }

      // 3) Loop and register each student
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];

        // Generate password from DOB: ddmmyyyy
        console.log(r.dob, typeof r.dob);
        const [day, month, year] = r.dob.split("-").map(Number); // Split "15-10-2002" into [15, 10, 2002]
        const dobDate = new Date(year, month - 1, day); // Month is 0-indexed

        const dd = String(dobDate.getDate()).padStart(2, "0");
        const mm = String(dobDate.getMonth() + 1).padStart(2, "0");
        const yyyy = dobDate.getFullYear();

        const password = `${dd}${mm}${yyyy}`;
        const dobSaved = `${yyyy}-${mm}-${dd}`;

        // 3a) Create Auth user
        const userCred = await createUserWithEmailAndPassword(
          auth,
          r.email.trim(),
          password
        );

        // 3b) Write Firestore doc
        await setDoc(doc(db, "students", userCred.user.uid), {
          firstName: r.firstName.trim(),
          lastName: r.lastName.trim(),
          gender: r.gender.trim(),
          registrationNo: r.registrationNo.trim(),
          phone: String(r.phone).trim(),
          email: r.email.trim(),
          dob: dobSaved.trim(),
          tenthPercentage: Number(r.tenthPercentage),
          twelfthPercentage: Number(r.twelfthPercentage),
          cgpa: Number(r.cgpa),
          branch: r.branch.trim(),
          branchCode: branchCodeMap[r.branch.trim()],
          semester: String(r.semester).trim(),
          backlogs: Number(r.backlogs),
          createdAt: Timestamp.now(),
          uid: userCred.user.uid,
          role: "student",
          status: "active",
        });
      }

      toast({
        title: "Success",
        description: "Bulk upload completed!",
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast({
        title: "Error",
        description:
          error.message ||
          "Failed to process the file. Please upload a valid file.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      resetFileInput();
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1 }}
      >
        {!showRegistration ? (
          <div className="h-full flex flex-col items-center justify-center p-6">
            {/* Loader */}
            {loading ? (
              <div className="absolute inset-0 flex justify-center items-center z-10 bg-white bg-opacity-50 rounded-xl">
                <div className="animate-spin rounded-full border-t-4 border-green-600 h-12 w-12"></div>{" "}
                {/* Circular loader */}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* Bulk Upload Card */}

                <div className="relative group bg-white rounded-xl overflow-visible hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 cursor-pointer max-w-lg w-full">
                  {/* Info Icon with Tooltip */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute top-4 right-4 z-20">
                          <Info className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        className="max-w-md w-80 p-4 text-sm text-gray-700 bg-white border border-gray-200 shadow-lg rounded-md 
        z-30 transform translate-y-2 absolute top-0 right-12 overflow-y-auto max-h-80"
                      >
                        <div className="font-semibold mb-2">
                          Upload Guidelines
                        </div>
                        <ul className="list-disc list-inside space-y-2">
                          <li>
                            The following fields are mandatory and must be
                            spelled exactly as listed:
                            <br />
                            <ul className="list-disc list-inside space-y-1 ml-5">
                              <li>firstName</li>
                              <li>lastName</li>
                              <li>gender</li>
                              <li>registrationNo</li>
                              <li>phone</li>
                              <li>email</li>
                              <li>dob</li>
                              <li>tenthPercentage</li>
                              <li>twelfthPercentage</li>
                              <li>cgpa</li>
                              <li>branch</li>
                              <li>semester</li>
                              <li>backlogs</li>
                            </ul>
                            The fields are case-sensitive and must be
                            written exactly as specified.
                          </li>
                          <li>Acceptable file: .csv or .xlsx</li>
                          <li>Max 100 records per upload</li>
                          <li>DOB format: DD-MM-YYYY</li>
                          <li>
                            Email must not already exist in the system
                          </li>
                          <li className="flex flex-wrap space-x-4">
                            <span>Max file size: 10MB</span>
                            <span>File encoding: UTF-8</span>
                          </li>
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Upload content */}
                  <div className="p-8 flex flex-col items-center text-center">
                    <div
                      className="inline-flex rounded-full p-4 bg-green-100 text-green-600"
                      onClick={handleBulkUploadClick}
                    >
                      <Upload className="h-10 w-10" />
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                      />
                    </div>
                    <h3 className="mt-6 text-2xl font-semibold text-gray-900">
                      Upload Bulk Data
                    </h3>
                    <p className="mt-4 text-gray-600 text-sm sm:text-base">
                      Upload an Excel or CSV file containing multiple
                      students.
                      <br />
                      Bulk uploads may take some time to process. Click to
                      upload.
                    </p>
                  </div>

                  {/* Bottom gradient */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </div>

                {/* Individual Registration Card */}
                <div
                  className="relative group bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 cursor-pointer"
                  onClick={handleRegisterClick}
                >
                  <div className="p-8 flex flex-col items-center text-center">
                    <div className="inline-flex rounded-full p-4 bg-blue-100 text-blue-600">
                      <GraduationCap className="h-10 w-10" />
                    </div>
                    <h3 className="mt-6 text-2xl font-semibold text-gray-900">
                      Register Individual Student
                    </h3>
                    <p className="mt-4 text-gray-600 text-sm sm:text-base">
                      Add a single student's details manually into the
                      system.
                      <br />
                      Quick and simple one-by-one registration.
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <StudentRegistration setRegistration={setShowRegistration} />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SignupStudent;
