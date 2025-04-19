import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Search,
  HelpCircle,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/landing/Footer";
import { motion, AnimatePresence } from "framer-motion";

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FaqItem[] = [
  {
    question: "When does the placement season begin and end?",
    answer:
      "The placement season begins from the end of August 2024 and continues up to June 30, 2025. Core sector engineering companies and software product/services companies are given preference in the first half of the placement season.",
    category: "General",
  },
  {
    question: "What is the minimum salary offered during placements?",
    answer:
      "The minimum salary to be offered to the AY 2024-25 batch graduates shall not be less than INR 3.00 Lacs per annum. The CTC breakdown must be clearly indicated in the offer letter.",
    category: "General",
  },
  {
    question: "Can students accept multiple job offers?",
    answer:
      "The institute follows a 'One Student One Offer' policy with some provisions. Students getting multiple Day 1 offers must choose one. Non-CS/IT students with a software offer can appear for core sector interviews if the CTC is 50% higher. CS/IT students with core offers can appear for software interviews if the CTC is 50% higher.",
    category: "For Students",
  },
  {
    question: "What is the Dream Company policy?",
    answer:
      "Selected students can appear for 'Dream Company' interviews if the CTC is 100% higher than their current offer. They must provide an undertaking to accept the new offer and cancel the previous one. The institute reserves the right to accord Dream Company status based on institutional needs.",
    category: "For Students",
  },
  {
    question: "What are the internship opportunities during 8th semester?",
    answer:
      "Students can undergo 4-6 month full-time onsite internships during their 8th semester. Companies must indicate their willingness to offer internships before the campus drive. The internship is governed by the institute's Internship Policy.",
    category: "For Students",
  },
  {
    question: "What documents are required for joining after placement?",
    answer:
      "The institute provides provisional degree certificates and final semester grade cards. If joining before document availability, companies should allow provisional joining based on Course Completion Certificate/Academic Activity Completion Certificate.",
    category: "For Students",
  },
  {
    question: "How can companies participate in the placement process?",
    answer:
      "Companies must communicate through tpo@gcoea.ac.in only. All job offers must be made through the T&P Cell. Companies should not contact students directly before selection. The placement schedule provided by the institute must be strictly followed.",
    category: "For Recruiters",
  },
  {
    question: "What information must be included in offer letters?",
    answer:
      "Offer letters must clearly indicate: gross salary per annum, CTC breakdown (allowances, fixed/variable components), joining bonus, stock options, joining date/place, accommodation/transport provisions, required documents, bond details (if any), and training period information.",
    category: "For Recruiters",
  },
  {
    question: "Are there any fees for companies to participate?",
    answer:
      "No, there are no registration or participation fees for companies to conduct recruitment drives at GCOE Amravati. We aim to build mutually beneficial relationships with our industry partners.",
    category: "For Recruiters",
  },
  {
    question: "What is the policy regarding bonds/agreements?",
    answer:
      "Companies must clearly specify any agreement/bond terms including duration, value, signing process, legal process, documents required, training period, and performance tests that may impact employment continuation.",
    category: "For Recruiters",
  },
  {
    question: "What are the ethical guidelines for students during placement?",
    answer:
      "Students must: accurately represent academic details (no rounding off marks), disclose any backlogs/gaps, attend pre-placement talks, follow test/interview guidelines, not use unfair means during online tests, and maintain professional conduct throughout the process.",
    category: "For Students",
  },
  {
    question: "What happens if a student violates placement policies?",
    answer:
      "Violations like misrepresenting eligibility, unethical conduct during tests/interviews, or not honoring accepted offers will lead to disqualification from campus recruitment and potential disciplinary action by the institute.",
    category: "For Students",
  },
  {
    question: "How are 8th semester academics handled during internships?",
    answer:
      "Internship students can complete courses through self-study, NPTEL/Coursera equivalent courses, or offline materials. They must appear for ESE exams as per schedule. Attendance is based on internship records authenticated by supervisors.",
    category: "For Students",
  },
  {
    question: "What is the policy for terminating internships early?",
    answer:
      "Students must inform the T&P Cell in writing within one month of starting the internship. Premature termination may lead to revocation of the employment offer. Students must then complete institute projects as per academic calendar.",
    category: "For Students",
  },
  {
    question: "What are the social media guidelines during placements?",
    answer:
      "Students must not post any negative comments about recruiting organizations, their selection processes, or compensation packages. All communication with companies should be through the T&P Cell only.",
    category: "For Students",
  },
];

const FaqsPage = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const categories = [
    "All",
    ...Array.from(new Set(faqData.map((faq) => faq.category))),
  ];

  const filteredFaqs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === null ||
      activeCategory === "All" ||
      faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    // Reset active FAQ when search query changes
    setActiveIndex(null);
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-slate-50">
      <Navbar />
      <div className="flex-grow">
        {/* Hero Section */}
        <div className="relative overflow-hidden pt-24 pb-12 md:pt-32 md:pb-20">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600 opacity-90"></div>

          {/* Background pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0zMHY2aDZ2LTZoLTZ6bTMwIDMwdjZoNnYtNmgtNnptMC0zMHY2aDZ2LTZoLTZ6bS0xNSAxNXY2aDZ2LTZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] mix-blend-overlay opacity-70"></div>

          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Frequently Asked Questions
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-indigo-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto"
            >
              Find answers to common questions about our placement process,
              eligibility, and more.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative max-w-2xl mx-auto"
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-300 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for questions..."
                className="pl-12 pr-4 py-6 text-base md:text-lg rounded-full border-none shadow-xl focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-0 bg-white/10 text-white placeholder:text-indigo-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 py-12 -mt-10 relative z-20">
          {/* Category filters */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-indigo-950">
                Filter by category
              </h2>
              <button
                className="md:hidden flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-1" />
                {showFilters ? "Hide filters" : "Show filters"}
              </button>
            </div>

            <div className={`md:block ${showFilters ? "block" : "hidden"}`}>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeCategory === category ||
                      (category === "All" && activeCategory === null)
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md"
                        : "bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-100"
                    }`}
                    onClick={() =>
                      setActiveCategory(category === "All" ? null : category)
                    }
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ items */}
          {filteredFaqs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-2xl shadow-sm border border-indigo-100"
            >
              <HelpCircle className="mx-auto h-16 w-16 text-indigo-200" />
              <h3 className="mt-4 text-xl font-medium text-indigo-900">
                No questions found
              </h3>
              <p className="mt-2 text-indigo-500">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-indigo-100 hover:shadow-md transition-all duration-300"
                >
                  <button
                    className="flex justify-between items-center w-full p-6 text-left focus:outline-none"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={activeIndex === index}
                  >
                    <span className="text-lg font-medium text-indigo-950">
                      {faq.question}
                    </span>
                    <span className="ml-6 flex-shrink-0 bg-indigo-50 rounded-full p-2 transition-transform duration-300">
                      {activeIndex === index ? (
                        <ChevronUp className="h-5 w-5 text-indigo-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-indigo-400" />
                      )}
                    </span>
                  </button>
                  <AnimatePresence>
                    {activeIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <p className="text-indigo-700 whitespace-pre-line">
                            {faq.answer}
                          </p>
                          <div className="mt-4 flex justify-between items-center">
                            <span className="text-xs px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full font-medium">
                              {faq.category}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Extra help section */}
          <div className="mt-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-8 shadow-sm">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-indigo-800 mb-4">
                Still have questions?
              </h3>
              <p className="text-indigo-600 mb-6">
                Our placement team is here to help you with any queries.
              </p>
              <a
                href="mailto:principal@gcoea.ac.in"
                className="inline-flex items-center px-6 py-3 font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full shadow-md transition-all duration-300 hover:scale-105 hover:brightness-110 hover:shadow-lg"
              >
                Contact Us <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FaqsPage;
