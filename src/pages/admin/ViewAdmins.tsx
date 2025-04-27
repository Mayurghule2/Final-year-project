import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Ban,
  Trash2,
  Search,
  Filter,
  Loader2,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  db,
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "../../backend/FirebaseConfig";

interface Admin {
  id: string;
  uid: string;
  email: string;
  status: string;
  createdAt: Date;
}


const ViewAdmins = (userid: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch = admin.email
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || admin.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      const querySnapshot = await getDocs(collection(db, "admins"));
      const adminsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        status: doc.data().status || "active",
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Admin[];
      setAdmins(adminsData);
      console.log(adminsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch admins",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateAdminStatus = async (
    adminId: string,
    currentStatus: string
  ) => {
    try {
      const newStatus = currentStatus === "active" ? "blocked" : "active";
      await updateDoc(doc(db, "admins", adminId), {
        status: newStatus,
      });
      toast({
        title: "Success",
        description: `Admin has been ${
          newStatus === "active" ? "unblocked" : "blocked"
        }`,
      });
      fetchAdmins();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update admin status",
        variant: "destructive",
      });
    }
  };

  const deleteAdmin = async (adminId: string) => {
    try {
      await deleteDoc(doc(db, "admins", adminId));
      toast({
        title: "Success",
        description: "Admin has been deleted successfully",
      });
      fetchAdmins();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete admin",
        variant: "destructive",
      });
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="totalAdmin"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search admins..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  {filterStatus === "all"
                    ? "All Status"
                    : filterStatus === "active"
                    ? "Active"
                    : "Blocked"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterStatus("active")}
                >
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterStatus("blocked")}
                >
                  Blocked
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              </div>
            ) : filteredAdmins.length === 0 ? (
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <UserPlus className="h-12 w-12 mx-auto text-indigo-500 mb-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    No Admins Found
                  </h3>
                  <p className="text-gray-500 mt-2">
                    {searchTerm || filterStatus !== "all"
                      ? "No matching admins found. Try adjusting your search or filter."
                      : "There are currently no registered admins."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 rounded-lg font-medium text-sm text-gray-600">
                  <div className="col-span-6">Email</div>
                  <div className="col-span-4">Status</div>
                  <div className="col-span-2">Actions</div>
                </div>
                {filteredAdmins.map((admin) => (
                  <div
                    key={admin.id}
                    className="grid grid-cols-12 gap-4 px-4 py-3 border-b items-center"
                  >
                    <div className="col-span-6 font-medium">
                      {admin.email}
                    </div>
                    <div className="col-span-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          admin.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {admin.status}
                      </span>
                    </div>
                    <div className="col-span-2 flex justify-end space-x-2">
                      {admin.uid !== userid.userid ? (
                        <>
                          <Button
                            variant={
                              admin.status === "active"
                                ? "destructive"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              updateAdminStatus(admin.id, admin.status)
                            }
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            {admin.status === "active"
                              ? "Block"
                              : "Unblock"}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteAdmin(admin.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <div className="bg-gray-100 p-2 rounded-lg">
                          <span className="font-medium text-gray-900">
                            User
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default ViewAdmins;
