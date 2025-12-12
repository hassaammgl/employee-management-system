import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEmailStore } from "@/store/email";
import { useChatStore } from "@/store/chat"; // Reuse fetchDepartments/Employees for recipient selection
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ComposeEmailProps {
    onClose: () => void;
}

export default function ComposeEmail({ onClose }: ComposeEmailProps) {
    const { sendEmail } = useEmailStore();
    const {
        departments,
        availableEmployees,
        fetchDepartments,
        fetchAvailableEmployees,
        clearAvailableEmployees
    } = useChatStore();

    const [recipientId, setRecipientId] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        fetchDepartments();
        return () => {
            clearAvailableEmployees();
        };
    }, [fetchDepartments, clearAvailableEmployees]);

    useEffect(() => {
        if (selectedDepartment) {
            fetchAvailableEmployees(selectedDepartment);
        } else {
            clearAvailableEmployees();
        }
    }, [selectedDepartment, fetchAvailableEmployees, clearAvailableEmployees]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!recipientId || !subject || !body) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsSending(true);
        try {
            await sendEmail(recipientId, subject, body);
            toast.success("Email sent successfully");
            onClose();
        } catch (error) {
            toast.error("Failed to send email");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Department</Label>
                    <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                            <option key={dept._id} value={dept._id}>
                                {dept.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <Label>Recipient</Label>
                    <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={recipientId}
                        onChange={(e) => setRecipientId(e.target.value)}
                        disabled={!selectedDepartment}
                    >
                        <option value="">Select Recipient</option>
                        {availableEmployees.map((emp) => (
                            <option key={emp._id} value={emp._id}>
                                {emp.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Subject</Label>
                <Input
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                    placeholder="Type your message here..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="h-40 resize-none"
                />
            </div>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSending}>
                    {isSending ? "Sending..." : "Send Message"}
                </Button>
            </div>
        </form>
    );
}
