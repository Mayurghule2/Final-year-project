import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const [typedText, setTypedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = "Welcome to the Placement Portal";
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText((prevText) => prevText + fullText[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, 105);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-12">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="animate-float absolute top-20 right-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="animate-float delay-300 absolute bottom-20 left-20 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="animate-float delay-700 absolute top-1/2 left-1/2 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              <span className="block text-gray-900">
                {typedText}
                <span
                  className={`${
                    showCursor ? "opacity-100" : "opacity-0"
                  } transition-opacity`}
                >
                  |
                </span>
              </span>
              <span className="block text-gradient mt-2">
                Government College Of Engineering Amravati{" "}
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto lg:mx-0">
              Connecting talented students with leading companies for a brighter
              future. Streamline your placement process with our all-in-one
              platform.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/contactus">
                <Button size="lg" className="text-md font-semibold group">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-md font-semibold hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative lg:block hidden">
            {/* Animated illustration replacing the static card */}
            <div className="relative">
              <div className="absolute -top-10 -left-10 animate-float delay-200">
                <div className="flex items-center bg-white p-4 rounded-lg shadow-lg">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <svg
                      className="h-6 w-6 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Resume Uploaded</p>
                    <p className="text-xs text-gray-500">Just now</p>
                  </div>
                </div>
              </div>

              <div className="animate-float delay-500">
                <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-secondary"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg
                            className="h-6 w-6 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            New Job Opening
                          </p>
                          <p className="text-xs text-gray-500">Just now</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 animate-pulse">
                        New
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900">
                      Software Developer at Infosys
                    </h3>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-center">
                        <div className="w-1/3 text-sm font-medium text-gray-500">
                          Location:
                        </div>
                        <div className="w-2/3 text-sm text-gray-900">
                          Pune, Maharashtra
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-1/3 text-sm font-medium text-gray-500">
                          Salary:
                        </div>
                        <div className="w-2/3 text-sm text-gray-900">
                          ₹5-8 LPA
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-1/3 text-sm font-medium text-gray-500">
                          Requirements:
                        </div>
                        <div className="w-2/3 text-sm text-gray-900">
                          B.Tech/MCA, 60% in 10th & 12th, 7.0 CGPA
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full animate-pulse"
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>75% Match</span>
                        <span>25 Applicants</span>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button size="sm" className="w-full text-center group">
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute top-20 -right-10 animate-float delay-700">
                <div className="bg-white rounded-lg shadow-xl p-4 transform rotate-6 w-64">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <svg
                        className="h-4 w-4 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 19l-7-7-7 7"
                        />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-900">
                      Click to apply for this job
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
