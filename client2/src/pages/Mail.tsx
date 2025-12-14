import { useEffect, useState } from "react";
import { useEmailStore } from "@/store/email";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Mail as MailIcon, Send } from "lucide-react";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import ComposeEmail from "@/components/forms/ComposeEmail";

export default function Mail() {
    const {
        inbox,
        sent,
        isLoading,
        fetchInbox,
        fetchSent,
        deleteEmail,
        markAsRead
    } = useEmailStore();
    const [activeTab, setActiveTab] = useState("inbox");
    const [selectedEmail, setSelectedEmail] = useState<any>(null);
    const [isComposeOpen, setIsComposeOpen] = useState(false);

    useEffect(() => {
        if (activeTab === "inbox") {
            fetchInbox();
        } else {
            fetchSent();
        }
    }, [activeTab, fetchInbox, fetchSent]);

    const handleEmailClick = (email: any) => {
        setSelectedEmail(email);
        if (activeTab === "inbox" && !email.isRead) {
            markAsRead(email._id);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        await deleteEmail(id);
        if (selectedEmail?._id === id) {
            setSelectedEmail(null);
        }
    };

    const currentList = activeTab === "inbox" ? inbox : sent;

    return (
        <div className="flex h-[calc(100vh-2rem)] gap-4 animate-fade-in text-card-foreground">
            {/* Sidebar / List */}
            <Card className="w-96 flex flex-col">
                <div className="p-4 border-b space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="font-semibold text-xl">Mail</h2>
                        <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Compose
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>New Message</DialogTitle>
                                </DialogHeader>
                                <ComposeEmail onClose={() => setIsComposeOpen(false)} />
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="inbox" className="gap-2">
                                <MailIcon className="h-4 w-4" />
                                Inbox
                            </TabsTrigger>
                            <TabsTrigger value="sent" className="gap-2">
                                <Send className="h-4 w-4" />
                                Sent
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <ScrollArea className="flex-1">
                    <div className="flex flex-col gap-1 p-2">
                        {isLoading ? (
                            <div className="p-4 text-center text-muted-foreground">Loading...</div>
                        ) : currentList.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                No {activeTab} messages
                            </div>
                        ) : (
                            currentList.map((email) => (
                                <button
                                    key={email._id}
                                    onClick={() => handleEmailClick(email)}
                                    className={`flex flex-col gap-1 p-4 rounded-lg transition-colors text-left border ${selectedEmail?._id === email._id
                                        ? "bg-accent border-accent"
                                        : "hover:bg-accent/50 border-transparent"
                                        } ${!email.isRead && activeTab === "inbox" ? "font-semibold bg-primary/5" : ""}`}
                                >
                                    <div className="flex justify-between items-start w-full">
                                        <span className="truncate flex-1 pr-2">
                                            {activeTab === "inbox"
                                                ? email.sender?.name || "Unknown Sender"
                                                : `To: ${email.recipient?.name || "Unknown"}`}
                                        </span>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                            {format(new Date(email.createdAt), "MMM d, HH:mm")}
                                        </span>
                                    </div>
                                    <p className="text-sm truncate w-full">{email.subject}</p>
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-xs text-muted-foreground truncate flex-1 pr-2">
                                            {email.body}
                                        </p>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => handleDelete(e, email._id)}
                                        >
                                            <Trash className="h-3 w-3 text-destructive" />
                                        </Button>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </Card>

            {/* View Area */}
            <Card className="flex-1 flex flex-col p-6">
                {selectedEmail ? (
                    <div className="space-y-6">
                        <div className="border-b pb-4">
                            <h2 className="text-2xl font-bold mb-2">{selectedEmail.subject}</h2>
                            <div className="flex justify-between items-start text-sm text-muted-foreground">
                                <div>
                                    <p>From: <span className="font-medium text-foreground">{selectedEmail.sender?.name}</span> ({selectedEmail.sender?.email})</p>
                                    <p>To: <span className="font-medium text-foreground">{selectedEmail.recipient?.name}</span> ({selectedEmail.recipient?.email})</p>
                                </div>
                                <p>{format(new Date(selectedEmail.createdAt), "PPP p")}</p>
                            </div>
                        </div>
                        <div className="whitespace-pre-wrap leading-relaxed">
                            {selectedEmail.body}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-center">
                        <div className="bg-accent/50 p-6 rounded-full mb-4">
                            <MailIcon className="h-12 w-12" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Select a Message</h3>
                        <p>Choose an email from the list to view its contents.</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
