import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useEmployeeStore } from "@/store/employee";
import { useTaskStore } from "@/store/task";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import type { Task } from "@/store/task";

interface TaskFormProps {
    isOpen: boolean;
    onClose: () => void;
    task?: Task;
}

const TaskForm = ({ isOpen, onClose, task }: TaskFormProps) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        assignedTo: "",
        priority: "medium",
        dueDate: "",
    });

    const { employees, fetchEmployees } = useEmployeeStore();
    const { addTask, updateTask, isLoading } = useTaskStore();
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen) {
            fetchEmployees();
            if (task) {
                setFormData({
                    title: task.title,
                    description: task.description,
                    assignedTo: task.assignedTo?._id || "",
                    priority: task.priority,
                    dueDate: task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "",
                });
            } else {
                setFormData({
                    title: "",
                    description: "",
                    assignedTo: "",
                    priority: "medium",
                    dueDate: "",
                });
            }
        }
    }, [isOpen, task, fetchEmployees]);

    const activeEmployees = employees.filter((emp) => emp.status === "active");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const taskData = {
            title: formData.title,
            description: formData.description,
            assignedTo: formData.assignedTo,
            priority: formData.priority as "low" | "medium" | "high",
            dueDate: formData.dueDate,
        };

        let success = false;
        try {
            if (task) {
                await updateTask(task.id, taskData);
                success = true;
            } else {
                await addTask(taskData);
                success = true;
            }
        } catch (error) {
            console.error(error);
            success = false;
        }

        if (success) {
            toast({
                title: "Success",
                description: task ? "Task updated successfully" : "Task created successfully",
            });
            onClose();
        } else {
            toast({
                title: "Error",
                description: task ? "Failed to update task" : "Failed to create task",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
                    <DialogDescription>
                        {task ? "Update task details." : "Fill in the details to assign a new task."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Task Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                            required
                            disabled={isLoading}
                            placeholder="e.g., Update Documentation"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="assignedTo">Assign To</Label>
                        <Select
                            value={formData.assignedTo}
                            onValueChange={(value) =>
                                setFormData({ ...formData, assignedTo: value })
                            }
                            disabled={isLoading}
                        >
                            <SelectTrigger id="assignedTo">
                                <SelectValue placeholder="Select employee" />
                            </SelectTrigger>
                            <SelectContent>
                                {activeEmployees.map((employee) => (
                                    <SelectItem key={employee.id} value={employee.id}>
                                        {employee.name} - {employee.role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                            value={formData.priority}
                            onValueChange={(value) =>
                                setFormData({ ...formData, priority: value })
                            }
                            disabled={isLoading}
                        >
                            <SelectTrigger id="priority">
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                            id="dueDate"
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) =>
                                setFormData({ ...formData, dueDate: e.target.value })
                            }
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            rows={4}
                            disabled={isLoading}
                            placeholder="Detailed description of the task"
                        />
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button type="submit" className="flex-1" disabled={isLoading}>
                            {isLoading ? "Saving..." : (task ? "Update Task" : "Create Task")}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default TaskForm;
