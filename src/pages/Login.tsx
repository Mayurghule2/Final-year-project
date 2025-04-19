import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  Briefcase,
  Shield,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AuthService } from "@/backend/AuthService";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/landing/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Popover } from "@/components/ui/popover";
import { TypeAnimation } from "react-type-animation";
import AnimatedBackground from "@/components/animations/AnimatedBackground";

const RoleIllustration = ({
  selectedRole,
}: {
  selectedRole: string | null;
}) => {
  // Your RoleIllustration implementation here
  return <div>{/* Illustration content */}</div>;
};

const RoleSelector = ({
  onRoleSelect,
  selectedRole,
}: {
  onRoleSelect: (role: string | null) => void;
  selectedRole: string | null;
}) => {
  const roleIcons = {
    students: <GraduationCap className="w-5 h-5 mr-2" />,
    recruiters: <Briefcase className="w-5 h-5 mr-2" />,
    admins: <Shield className="w-5 h-5 mr-2" />,
  };

  return (
    <div className="space-y-4">
      <h3 className="text-center font-medium">Select your role</h3>
      <div className="flex justify-center gap-4">
        {(["students", "recruiters", "admins"] as const).map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => onRoleSelect(role)}
            className={`flex items-center px-4 py-3 rounded-xl border transition-all text-base ${
              selectedRole === role
                ? "border-indigo-600 bg-indigo-100 text-indigo-700 font-semibold shadow-md"
                : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 text-gray-700"
            }`}
          >
            {roleIcons[role]}
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

const LoginForm = ({
  onLoginSuccess,
  onRoleSelect,
  selectedRole,
}: {
  onLoginSuccess: (email: string, password: string) => Promise<void>;
  onRoleSelect: (role: string | null) => void;
  selectedRole: string | null;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      toast({
        title: "Error",
        description: "Please select a role.",
        variant: "destructive",
      });
      return;
    }

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onLoginSuccess(email, password);
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <RoleSelector onRoleSelect={onRoleSelect} selectedRole={selectedRole} />

      {selectedRole && (
        <div className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 shadow-sm">
            <p className="text-sm text-indigo-700">
              <strong>Important Note:</strong> If you accidentally select the
              wrong role, don’t worry. Our smart and secure system will
              automatically detect your actual account type based on your email
              ID and redirect you to the correct page.
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </div>
      )}
    </form>
  );
};

const Login = () => {
  const [selectedRole, setSelectedRole] = useState<
    "student" | "recruiter" | "admin" | null
  >(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleRoleSelect = (role: "student" | "recruiter" | "admin" | null) => {
    setSelectedRole(role);
  };
  const handleLoginSuccess = async (email: string, password: string) => {
    try {
      // Use only one authentication method - the AuthService login
      const { user, error } = await AuthService.login(email, password);

      if (error) throw new Error(error);
      if (!user) throw new Error("Authentication failed");

      // Update auth context with the user data - this will also set localStorage
      login(user);

      toast({
        title: "Login Successful",
        description: `Welcome, ${user.email}`,
        variant: "default",
      });

      // Navigate based on role
      switch (user.role) {
        case "student":
          navigate("/joblistingspage");
          break;
        case "recruiter":
          navigate("/recruiterjobpostpage");
          break;
        case "admin":
          navigate("/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-gray-50 to-indigo-50">
      <AnimatedBackground />

      {/* Sparkles effect for the header */}
      <div className="w-full absolute top-0 h-[40rem]">
        <Popover
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={50}
          className="w-full h-full"
          particleColor="#6366f1"
        />
      </div>

      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-100/80">
            {/* Left side - illustration with gradient background */}
            <div className="hidden lg:flex flex-col h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600 p-8 text-white relative overflow-hidden">
              {/* Background animations */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <motion.div
                  className="absolute top-10 left-10 w-24 h-24 rounded-full bg-white"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-white"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-white transform -translate-x-1/2 -translate-y-1/2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>

              <div className="h-full flex flex-col justify-center relative z-10">
                <h2 className="text-4xl font-bold mb-6 text-center">
                  <TypeAnimation
                    sequence={[
                      "Welcome Back",
                      2000,
                      "Ready to Continue?",
                      2000,
                      "Your Journey Awaits",
                      2000,
                    ]}
                    wrapper="span"
                    speed={50}
                    style={{ display: "inline-block" }}
                    repeat={Infinity}
                  />
                </h2>

                <motion.div
                  className="transform transition-all duration-300 hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                >
                  <RoleIllustration selectedRole={selectedRole} />
                </motion.div>

                <div className="mt-8 text-indigo-100">
                  <p className="text-center mb-6 text-xl font-medium">
                    Connecting talent with opportunity
                  </p>
                  <ul className="space-y-3">
                    <motion.li
                      className="flex items-center"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span className="inline-flex items-center justify-center rounded-full bg-indigo-500/30 p-2 mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </span>
                      <span className="text-lg">
                        Streamlined placement process
                      </span>
                    </motion.li>
                    <motion.li
                      className="flex items-center"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <span className="inline-flex items-center justify-center rounded-full bg-indigo-500/30 p-2 mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </span>
                      <span className="text-lg">
                        Direct communication channels
                      </span>
                    </motion.li>
                    <motion.li
                      className="flex items-center"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <span className="inline-flex items-center justify-center rounded-full bg-indigo-500/30 p-2 mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </span>
                      <span className="text-lg">
                        Real-time application tracking
                      </span>
                    </motion.li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right side - login form */}
            <div className="p-6 sm:p-8 md:p-10 lg:p-12">
              <div className="mb-6 md:mb-8 text-center lg:text-left">
                <motion.h1
                  className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  Login
                </motion.h1>
                <motion.p
                  className="text-gray-600 text-base sm:text-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  {selectedRole
                    ? `Continue as ${
                        selectedRole.charAt(0).toUpperCase() +
                        selectedRole.slice(1)
                      }`
                    : "Select your role to continue"}
                </motion.p>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedRole || "empty"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <LoginForm
                    onLoginSuccess={handleLoginSuccess}
                    onRoleSelect={handleRoleSelect}
                    selectedRole={selectedRole}
                  />
                </motion.div>
              </AnimatePresence>

              <motion.div
                className="mt-6 md:mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-gray-600 text-sm sm:text-base">
                  Don't have an account?{" "}
                  <button
                    onClick={() => navigate("/signup")}
                    className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 hover:underline"
                  >
                    Create account
                  </button>
                </p>
                <button
                  onClick={() => navigate("/forgot-password")}
                  className="mt-2 sm:mt-4 text-indigo-600 hover:text-indigo-800 text-xs sm:text-sm font-medium transition-colors duration-200 hover:underline"
                >
                  Forgot password?
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
