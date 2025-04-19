
import {
  Clock,
  UserCheck,
  UserPlus,
  Briefcase,
  Shield,
  CheckCircle,
} from "lucide-react";

const features = [
  {
    title: "Streamlined Applications",
    description:
      "Apply to multiple companies with just a few clicks, no repetitive form filling required.",
    icon: CheckCircle,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Real-time Approvals",
    description:
      "Get instant notifications when your application status changes or when you're approved for interviews.",
    icon: Clock,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Eligibility Checker",
    description:
      "Our smart system automatically checks if you meet company requirements before you apply.",
    icon: UserCheck,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Easy Recruitment",
    description:
      "Companies can post job openings, review applications, and manage the hiring process effortlessly.",
    icon: Briefcase,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "Secure Platform",
    description:
      "Your data is protected with enterprise-grade security. Only approved recruiters can view student profiles.",
    icon: Shield,
    color: "bg-red-100 text-red-600",
  },
  {
    title: "Simple Onboarding",
    description:
      "Setting up your profile is quick and easy, with a straightforward approval process.",
    icon: UserPlus,
    color: "bg-indigo-100 text-indigo-600",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-10 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Powerful Features for Everyone
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform offers a complete solution for students and recruiters
            to streamline the placement process.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
            >
              <div className="p-6">
                <div
                  className={`inline-flex rounded-full p-3 ${feature.color}`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
