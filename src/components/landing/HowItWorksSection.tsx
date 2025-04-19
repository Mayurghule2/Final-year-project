

import {
  ClipboardList,
  UserCheck,
  Briefcase,
  Headphones,
} from "lucide-react";


const steps = [
  {
    title: "Request Account",
    description:"Students or recruiters can initiate access by submitting their details through our contact form or via email.",
    icon: ClipboardList,
    color: "bg-blue-100 text-blue-600",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"  },
  {
    title: "Admin Approval",
    description:
      "GCOEA placement cell verifies credentials and activates account",
    icon: UserCheck,
    color: "bg-green-100 text-green-600",
    image: "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1738&q=80"
  },
  {
    title: "Platform Access",
    description:
      "Students apply to jobs, recruiters manage postings through dashboard",
    icon: Briefcase,
    color: "bg-purple-100 text-purple-600",
    image: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1732&q=80"
  },
  {
    title: "24/7 Support",
    description:
      "Direct access to placement cell for any queries through multiple channels",
    icon: Headphones,
    color: "bg-orange-100 text-orange-600",
    image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-14 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Placement Platform Process
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600">
            Simple steps to connect students with career opportunities
          </p>
        </div>

        <div className="mt-20">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`mb-16 lg:mb-24 ${index % 2 !== 0 ? "lg:flex-row-reverse" : ""}`}
            >
              <div className="lg:flex items-center gap-12">
                <div className="lg:w-1/2 mb-8 lg:mb-0">
                  <div className="relative">
                    <div className="bg-white p-3 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                      <div className="relative overflow-hidden rounded-xl aspect-video">
                        <img 
                          src={step.image} 
                          alt={step.title}
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div className={`absolute -top-6 -right-6 md:top-4 md:-right-6 w-16 h-16 rounded-full flex items-center justify-center ${step.color} shadow-lg z-10`}>
                      <span className="text-2xl font-bold">{index + 1}</span>
                    </div>
                  </div>
                </div>
                
                <div className="lg:w-1/2">
                  <div className="p-6 md:p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center mr-4`}>
                        <step.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-lg text-gray-600">{step.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </section>
  );
};

export default HowItWorksSection;