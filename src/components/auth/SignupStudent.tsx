// src/components/auth/SignupStudent.tsx
import { useState } from "react";
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
import { Loader2, Eye, EyeOff, Phone } from "lucide-react";

const studentFormSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(2, "Last name is required"),
  gender: z.string().min(1, "Gender is required"),
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
  semester: z.string().min(1, "Semester is required"),
  backlogs: z.string().min(1, "Backlogs information is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface SignupStudentProps {
  onSubmit: (data: z.infer<typeof studentFormSchema>) => void;
  isSubmitting: boolean;
}

const SignupStudent = ({ onSubmit, isSubmitting }: SignupStudentProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const branches = [
    "Computer Science & Engineering",
    "Information Technology",
    "Electronics & Communication",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Aeronautical Engineering",
    "Biotechnology",
    "Biomedical Engineering",
    "Automobile Engineering",
    "Agricultural Engineering",
    "Mechatronics",
    "Robotics",
    "Artificial Intelligence",
    "Data Science",
    "Cyber Security",
    "Petroleum Engineering",
    "Metallurgical Engineering",
    "Industrial Engineering",
    "Other"
  ];

  const genders = [
    "Male",
    "Female",
    "Non-binary",
    "Prefer not to say",
    "Other"
  ];

  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const backlogOptions = ["No Backlog", "1", "2", "3", "4", "5", "6", "7", "8"];

  const form = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      dob: "",
      tenthPercentage: "",
      twelfthPercentage: "",
      cgpa: "",
      branch: "",
      semester: "",
      backlogs: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 py-2 sm:py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs sm:text-sm">First Name</FormLabel>
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
                <FormLabel className="text-xs sm:text-sm">Middle Name</FormLabel>
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
                <FormLabel className="text-xs sm:text-sm">Last Name</FormLabel>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs sm:text-sm">Gender</FormLabel>
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
                <FormLabel className="text-xs sm:text-sm">Phone Number</FormLabel>
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
                <FormLabel className="text-xs sm:text-sm">Date of Birth</FormLabel>
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
                <FormLabel className="text-xs sm:text-sm">Email</FormLabel>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs sm:text-sm">Password</FormLabel>
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
                <FormLabel className="text-xs sm:text-sm">Confirm Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input 
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password" 
                      {...field} 
                      className="text-xs sm:text-sm h-8 sm:h-9 pr-8"
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <FormField
            control={form.control}
            name="tenthPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs sm:text-sm">10th Percentage</FormLabel>
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
                <FormLabel className="text-xs sm:text-sm">12th Percentage</FormLabel>
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
                <FormLabel className="text-xs sm:text-sm">CGPA</FormLabel>
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
                <FormLabel className="text-xs sm:text-sm">Branch</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="text-xs sm:text-sm h-8 sm:h-9">
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="text-xs sm:text-sm max-h-60 overflow-y-auto">
                    {branches.map((branch) => (
                      <SelectItem 
                        key={branch} 
                        value={branch}
                        className="text-xs sm:text-sm"
                      >
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
                <FormLabel className="text-xs sm:text-sm">Semester</FormLabel>
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
                <FormLabel className="text-xs sm:text-sm">Backlogs</FormLabel>
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

        <Button 
          type="submit" 
          className="w-full h-9 sm:h-10" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
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
  );
};

export default SignupStudent;