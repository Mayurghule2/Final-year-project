// src/components/ContactUs.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Mail, User, Phone, Send, CheckCircle2, Loader2, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Footer from "@/components/landing/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/backend/FirebaseConfig";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    userType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, userType: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message || !formData.userType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Add the contact form data to Firestore
      await addDoc(collection(db, "contactSubmissions"), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        userType: formData.userType,
        message: formData.message,
        status: "new", // You can track the status of the submission
        createdAt: serverTimestamp(), // Adds server-side timestamp
      });

      setIsSubmitted(true);
      toast({
        title: "Message Sent!",
        description: "We've received your message and will get back to you soon.",
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      userType: "",
      message: "",
    });
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white relative overflow-hidden">
      <Navbar />
      <ParticleBackground />

      <div className="max-w-6xl mx-auto relative z-10 py-12 px-4 sm:px-6 lg:px-8 mt-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-500 mb-4 pb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Contact Support
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Need help with your account? Contact our admin team for assistance
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Information Panel */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl h-full">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-6">
                <CardTitle className="text-xl font-semibold">
                  How We Can Help
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-lg mb-3 text-gray-800 flex items-center gap-2">
                      <Info className="h-5 w-5 text-indigo-600" />
                      For Students
                    </h3>
                    <ul className="space-y-2 text-gray-600 pl-2">
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Account creation requests</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Profile information updates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Academic record corrections</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Application status inquiries</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Other help and support</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium text-lg mb-3 text-gray-800 flex items-center gap-2">
                      <Info className="h-5 w-5 text-purple-600" />
                      For Recruiters
                    </h3>
                    <ul className="space-y-2 text-gray-600 pl-2">
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Company account setup for recruiting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Profile verification status</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Job posting assistance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Other help and support</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h4 className="font-medium text-blue-800 mb-2">Response Time</h4>
                    <p className="text-sm text-blue-600">
                      We typically respond within 24-48 hours for account-related inquiries.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Form Panel */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden h-full">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-6">
                <CardTitle className="text-xl md:text-2xl font-semibold">
                  Contact Form
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                {isSubmitted ? (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="mb-6 bg-green-100 rounded-full p-4 inline-block"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                      <CheckCircle2 className="h-12 w-12 text-green-600" />
                    </motion.div>
                    <motion.h2
                      className="text-2xl font-bold mb-4 text-gray-800"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      Request Received
                    </motion.h2>
                    <motion.p
                      className="text-gray-600 mb-8 max-w-md mx-auto"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      Our admin team will review your {formData.userType === 'student' ? 'student' : formData.userType === 'recruiter' ? 'recruiter' : ''} request and respond shortly.
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button
                        onClick={resetForm}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      >
                        Submit Another Request
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      {/* User Type Dropdown - Moved to top */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
                          I need help with <span className="text-red-500">*</span>
                        </label>
                        <Select onValueChange={handleSelectChange} value={formData.userType} required>
                          <SelectTrigger className="h-12 text-base">
                            <SelectValue placeholder="Select request type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student Account</SelectItem>
                            <SelectItem value="recruiter">Recruiter Account</SelectItem>
                            <SelectItem value="other">Other Inquiry</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>

                      {/* Name Field */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Your full name"
                            value={formData.name}
                            onChange={handleChange}
                            className="pl-10 h-12 text-base"
                            required
                          />
                        </div>
                      </motion.div>

                      {/* Email Field */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="pl-10 h-12 text-base"
                            required
                          />
                        </div>
                      </motion.div>

                      {/* Phone Field */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number (Optional)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+1 (123) 456-7890"
                            value={formData.phone}
                            onChange={handleChange}
                            className="pl-10 h-12 text-base"
                          />
                        </div>
                      </motion.div>

                      {/* Message Field */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                          Detailed Request <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder={`Please describe your ${
                            formData.userType === 'student' ? 'student account' : 
                            formData.userType === 'recruiter' ? 'recruiter account' : ''
                          } request in detail...`}
                          value={formData.message}
                          onChange={handleChange}
                          className="min-h-[150px] text-base"
                          required
                        />
                      </motion.div>

                      {/* Submit Button */}
                      <motion.div
                        className="pt-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-5 w-5" />
                              Submit Request
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <div className="-mb-10 -mr-14 -ml-4 mt-10">
        <Footer />
      </div>
    </div>
  );
};

export default ContactUs;