
import { useEffect, useState } from "react";
import { Users, Award, Briefcase, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const stats = [
  {
    value: 500,
    label: "Students Placed",
    icon: Users,
    color: "from-blue-400 to-blue-600",
  },
  {
    value: 50,
    label: "Partner Companies",
    icon: Building,
    color: "from-purple-400 to-purple-600",
  },
  {
    value: 200,
    label: "Active Job Listings",
    icon: Briefcase,
    color: "from-green-400 to-green-600",
  },
  {
    value: 95,
    label: "Success Rate (%)",
    icon: Award,
    color: "from-orange-400 to-orange-600",
  },
];

const StatisticsSection = () => {
  const [counters, setCounters] = useState(stats.map(() => 0));
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });

    const section = document.getElementById("statistics-section");
    if (section) observer.observe(section);

    return () => {
      if (section) observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // ms
    const interval = 20; // ms
    const steps = duration / interval;

    const timers = stats.map((stat, index) => {
      const increment = stat.value / steps;
      let currentStep = 0;

      return setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setCounters((prev) => {
            const newCounters = [...prev];
            newCounters[index] = stat.value;
            return newCounters;
          });
          clearInterval(timers[index]);
        } else {
          setCounters((prev) => {
            const newCounters = [...prev];
            newCounters[index] = Math.round(increment * currentStep);
            return newCounters;
          });
        }
      }, interval);
    });

    return () => {
      timers.forEach((timer) => clearInterval(timer));
    };
  }, [isVisible]);

  return (
    <section id="statistics-section" className="py-10 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Placement Success</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-4 mb-4"></div>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            We take pride in our successful placement track record and the strong relationships we've built with industry-leading companies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl shadow-lg group hover:-translate-y-2 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-90 z-0" style={{ 
                backgroundImage: `linear-gradient(to bottom right, hsl(var(--primary)), hsl(var(--secondary)))` 
              }}></div>
              <div className="relative z-10 p-8 text-white h-full flex flex-col items-center justify-center">
                <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-4xl font-bold mb-2">{counters[index].toLocaleString()}</div>
                <div className="text-lg text-white/90">{stat.label}</div>
                <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-white/10 rounded-full filter blur-xl group-hover:w-32 group-hover:h-32 transition-all duration-300"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-xl text-gray-700 mb-6 max-w-2xl mx-auto">
            Join the hundreds of students who've launched their careers through our placement portal.
          </p>
          <Link to="/login">
            <Button size="lg" className="px-8 py-6 text-lg font-semibold rounded-full">
              Start Your Journey
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
