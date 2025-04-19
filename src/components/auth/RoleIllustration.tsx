import { User, Building2, ShieldCheck } from "lucide-react";

type Role = "student" | "recruiter" | "admin" | null;

interface RoleIllustrationProps {
  selectedRole: Role;
}

const RoleIllustration = ({ selectedRole }: RoleIllustrationProps) => {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-8">Welcome to the Placement Portal</h2>
      
      <div className="relative mx-auto w-48 h-48 mb-8">
        {selectedRole === "student" && (
          <div className="animate-fade-in">
            <User className="w-full h-full p-8 rounded-full bg-white/20 text-white" />
            <div className="absolute top-0 right-0 w-12 h-12 bg-white/30 rounded-full flex items-center justify-center text-white animate-bounce">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        )}
        {selectedRole === "recruiter" && (
          <div className="animate-fade-in">
            <Building2 className="w-full h-full p-8 rounded-full bg-white/20 text-white" />
            <div className="absolute top-0 right-0 w-12 h-12 bg-white/30 rounded-full flex items-center justify-center text-white animate-bounce">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        )}
        {selectedRole === "admin" && (
          <div className="animate-fade-in">
            <ShieldCheck className="w-full h-full p-8 rounded-full bg-white/20 text-white" />
            <div className="absolute top-0 right-0 w-12 h-12 bg-white/30 rounded-full flex items-center justify-center text-white animate-bounce">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        )}
        {!selectedRole && (
          <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center text-white">
            <svg className="w-28 h-28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        )}
      </div>
      
      <p className="text-white/90 max-w-xs mx-auto">
        {selectedRole 
          ? `Access your ${selectedRole} dashboard with all the tools you need.` 
          : "Select your role to proceed with the login process"}
      </p>
    </div>
  );
};

export default RoleIllustration;