
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutSection = () => {
  return (
    <section id="about" className="py-14 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
                alt="Campus"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-primary/10 rounded-full z-0"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-secondary/10 rounded-full z-0"></div>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              About Government College, Amravati
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Government College of Amravati is one of the premier educational
              institutions in Maharashtra, known for its excellence in academics
              and professional courses. Established in 1964, the college has been
              consistently producing talented professionals who excel in various
              fields.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Our placement cell works tirelessly to connect students with top
              companies across India. Through this portal, we aim to streamline
              the entire placement process, making it easier for both students
              and recruiters.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              With state-of-the-art facilities and dedicated faculty, we ensure
              that our students are well-prepared for the industry challenges.
            </p>

            <div className="flex gap-4">
              <Link to="/login">
                <Button variant="outline">Join as Student</Button>
              </Link>
              <Link to="/login">
                <Button>Join as Recruiter</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
