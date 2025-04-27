import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { auth, createUserWithEmailAndPassword, db } from "@/backend/FirebaseConfig";
import { useToast } from "@/hooks/use-toast";
import { set } from "date-fns";

interface Admin {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phone: string;
    username: string;
    type: string;    
    department: string;
    deptCode: string;
    status: string;
    createdAt: Date;
  }

const adminSchema = z
    .object({
        firstName: z.string().min(2, "First name is required"),
        middleName: z.string().optional(),
        lastName: z.string().min(2, "Last name is required"),
        email: z.string().email("Invalid email"),
        phone: z.string().min(10, "Phone number is too short").max(15),
        username: z
            .string()
            .min(3, "Username must be at least 3 characters")
            .max(20, "Username must be at most 20 characters")
            .regex(/^[a-z][a-z]*[0-9]*$/, "Username must start with a lowarecase letter, contain only lowercase letters, and may end with numbers"),
        type: z.string().min(1, "Select a type"),
        department: z.string().min(1, "Select a department"),
        deptCode: z.string(),
    })

type AdminFormType = z.infer<typeof adminSchema>;

const departmentCodeMap: Record<string, string> = {
    "Computer Science & Engineering": "CS",
    "Information Technology": "IT",
    "Electronics & Telecommunication Engineering": "EN",
    "Electrical Engineering": "EE",
    "Mechanical Engineering": "ME",
    "Civil Engineering": "CE",
    "Instrumentation Engineering": "IN",
};



const SignUpAdmin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setLoading ] = useState(false);
    const [adminPassword, setAdminPassword] = useState("");
    const [confirmAdminPassword, setConfirmAdminPassword] = useState("");
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
    const { toast } = useToast();
    

    const form = useForm<AdminFormType>({
        resolver: zodResolver(adminSchema),
        defaultValues: {
            firstName: "",
            middleName: "",
            lastName: "",
            email: "",
            phone: "",
            username: "",
            type: "",
            department: "",
            deptCode: "",   
        },
    });


      const fetchAdmins = async () => {
        try {
          setLoading(true);
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
          setLoading(false);
        }
      };
    
      
        const handleCreateAdmin = async (data: any) => {
          if (adminPassword !== confirmAdminPassword) {
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
              data.email,
              adminPassword
            );
      
            await addDoc(collection(db, "admins"), {
              ...data,
              createdAt: new Date(),
              role: "admin",
              uid: userCredential.user.uid,
              status: "active",
            });

            resetForm();
      
            toast({
              title: "Admin Created",
              description: `New admin with email ${data.username} has been created successfully.`,
            });
      
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
      
        const resetForm = () => {
          form.reset();
          setAdminPassword("");
          setConfirmAdminPassword("");
        }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleCreateAdmin)}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

                <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs sm:text-sm">
                                    Username
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="username"
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
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs sm:text-sm">
                                    Type
                                </FormLabel>
                                <Select
                                    onValueChange={(value) =>
                                        field.onChange(value)
                                    }
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="text-xs sm:text-sm h-8 sm:h-9">
                                            <SelectValue placeholder="Select Admin type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="text-xs sm:text-sm max-h-60 overflow-y-auto">
                                        <SelectItem value="A1">Lead</SelectItem>
                                        <SelectItem value="A2">Assistant</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3  gap-3 sm:gap-4">
                    <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs sm:text-sm">
                                    Department Code
                                </FormLabel>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        form.setValue("deptCode", departmentCodeMap[value]); 
                                    }}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="text-xs sm:text-sm h-8 sm:h-9">
                                            <SelectValue placeholder="Select department code" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="text-xs sm:text-sm max-h-60 overflow-y-auto">
                                        {Object.entries(departmentCodeMap).map(([dept, code]) => (
                                            <SelectItem
                                                key={code}
                                                value={dept} 
                                            >
                                                {dept}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {/* Password Field */}
                    <FormItem>
                        <FormLabel className="text-xs sm:text-sm">
                        Password
                        </FormLabel>
                        <div className="relative">
                        <FormControl>
                            <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="********"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
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
                    </FormItem>

                    {/* Confirm Password Field */}
                    <FormItem>
                        <FormLabel className="text-xs sm:text-sm">
                        Confirm Password
                        </FormLabel>
                        <div className="relative">
                        <FormControl>
                            <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={confirmAdminPassword}
                            onChange={(e) => setConfirmAdminPassword(e.target.value)}
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
                    </FormItem>
                    </div>


                <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="pt-2"
                >
                    <Button
                        type="submit"
                        className="w-full h-9 sm:h-10"
                        disabled={isCreatingAdmin}
                    >
                        {isCreatingAdmin ? (
                            <>
                                <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                                Creating Account...
                            </>
                        ) : (
                            "Create Admin Account"
                        )}
                    </Button>
                </motion.div>
            </form>
        </Form>
    );
};

export default SignUpAdmin;
