/*************  ✨ Windsurf Command ⭐  *************/
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  Search,
  Filter,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/backend/FirebaseConfig";
import { useAuth } from "@/context/AuthContext";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: string;
  message: string;
  status: string;
  createdAt: Date;
}

const ViewMessages = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);

  const { toast } = useToast();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;
    fetchMessages();
  }, [currentUser]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || message.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const toggleMessageExpand = (id: string) => {
    setExpandedMessage(expandedMessage === id ? null : id);
  };

  const fetchMessages = async () => {
    if (!currentUser) return; // make sure currentUser exists

    try {
      setLoading(true);

      const submissionsRef = collection(db, "contactSubmissions");

      let querySnapshot;

      if (currentUser.type === "A2") {
        // Filter only by user's departmentCode
        const q = query(
          submissionsRef,
          where("departmentCode", "==", currentUser.deptCode)
        );
        querySnapshot = await getDocs(q);
      } else {
        // Fetch all messages without any filter
        querySnapshot = await getDocs(submissionsRef);
      }

      const messagesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Message[];

      setMessages(messagesData);
    } catch (error) {
      console.error(error); // also log error for debugging
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "contactSubmissions", messageId), {
        status: newStatus,
      });
      toast({
        title: "Success",
        description: `Message has been marked as ${newStatus}`,
      });
      fetchMessages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update message status",
        variant: "destructive",
      });
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      await deleteDoc(doc(db, "contactSubmissions", messageId));
      toast({
        title: "Success",
        description: "Message has been deleted successfully",
      });
      fetchMessages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search messages..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {filterStatus === "all"
                  ? "All Status"
                  : filterStatus === "new"
                  ? "New"
                  : "Viewed"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("new")}>
                New
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("viewed")}>
                Viewed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
        <CardContent className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-indigo-500 mb-2" />
                <h3 className="text-lg font-medium text-gray-900">
                  No Messages Found
                </h3>
                <p className="text-gray-500 mt-2">
                  {searchTerm || filterStatus !== "all"
                    ? "No matching messages found. Try adjusting your search or filter."
                    : "There are currently no messages."}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 rounded-lg font-medium text-sm text-gray-600">
                <div className="col-span-4">Name</div>
                <div className="col-span-4">Email</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Actions</div>
              </div>
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <div
                    className="grid grid-cols-12 gap-4 px-4 py-3 items-center cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      toggleMessageExpand(message.id);
                      if (message.status === "new") {
                        updateMessageStatus(message.id, "viewed");
                      }
                    }}
                  >
                    <div className="col-span-4 font-medium">
                      {message.name}
                      {message.status === "new" && (
                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <div className="col-span-4 text-sm text-gray-600">
                      {message.email}
                    </div>
                    <div className="col-span-2 text-sm text-gray-600 capitalize">
                      {message.userType}
                    </div>
                    <div className="col-span-2 flex justify-end">
                      {expandedMessage === message.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                  {expandedMessage === message.id && (
                    <div className="px-4 py-3 bg-gray-50 border-t">
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-1">Contact Info</h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>Email: {message.email}</p>
                              {message.phone && <p>Phone: {message.phone}</p>}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Details</h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>Type: {message.userType}</p>
                              <p>Received: {formatDate(message.createdAt)}</p>
                              <p>
                                Status:
                                <span
                                  className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                                    message.status === "new"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {message.status}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Message</h4>
                          <p className="text-sm text-gray-600 whitespace-pre-line">
                            {message.message}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 mt-4">
                        {message.status === "new" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateMessageStatus(message.id, "viewed")
                            }
                          >
                            Mark as Viewed
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMessage(message.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default ViewMessages;
