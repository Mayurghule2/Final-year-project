// src/components/auth/SignupRecruiter.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Eye, EyeOff } from "lucide-react";

const recruiterFormSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
  companyInfo: z.string().min(30, "Company information must be at least 30 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface SignupRecruiterProps {
  onSubmit: (data: z.infer<typeof recruiterFormSchema>) => void;
  isSubmitting: boolean;
}

const SignupRecruiter = ({ onSubmit, isSubmitting }: SignupRecruiterProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof recruiterFormSchema>>({
    resolver: zodResolver(recruiterFormSchema),
    defaultValues: {
      companyName: "",
      email: "",
      password: "",
      confirmPassword: "",
      companyInfo: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 py-2 sm:py-4">
        <div className="space-y-3 sm:space-y-4">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs sm:text-sm">Company Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Your company name" 
                    {...field} 
                    className="text-xs sm:text-sm h-8 sm:h-9"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <div className="mt-2 sm:mt-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm">Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="company@example.com" 
                      {...field} 
                      className="text-xs sm:text-sm h-8 sm:h-9"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-2 sm:mt-4">
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
          </div>
          <div className="mt-2 sm:mt-4">
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
                        placeholder="Confirm password" 
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
          <div className="mt-2 sm:mt-4">
            <FormField
              control={form.control}
              name="companyInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm">Company Information</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your company (at least 30 characters)"
                      {...field}
                      className="text-xs sm:text-sm h-24"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
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
            "Create Recruiter Account"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SignupRecruiter;