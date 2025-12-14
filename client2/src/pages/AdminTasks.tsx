import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTaskStore, type Task } from "@/store/task";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Spinner } from "@/components/ui/Loader/spinner";
import TaskForm from "@/components/forms/TaskForm";
import { useToast } from "@/hooks/use-toast";

export default function AdminTasks() {
    const { tasks, isLoading, error, fetchTasks, deleteTask } = useTaskStore();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
    const { toast } = useToast();

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleCreate = () => {
        setEditingTask(undefined);
        setIsFormOpen(true);
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            await deleteTask(id);
            toast({
                title: "Success",
                description: "Task deleted successfully",
            });
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "destructive";
            case "medium":
                return "default"; // or secondary
            case "low":
                return "secondary"; // or outline
            default:
                return "secondary";
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Tasks</h1>
                    <p className="text-muted-foreground">Manage and assign tasks to employees.</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Task
                </Button>
            </div>

            {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-destructive">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Spinner />
                </div>
            ) : tasks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    No tasks found. Create one to get started.
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tasks.map((task) => (
                        <Card key={task.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-start justify-between pb-2">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg font-semibold line-clamp-1" title={task.title}>
                                        {task.title}
                                    </CardTitle>
                                    <div className="flex gap-2">
                                        <Badge variant={getPriorityColor(task.priority) as any} className="capitalize">
                                            {task.priority}
                                        </Badge>
                                        <Badge variant={task.completed ? "secondary" : "outline"} className="capitalize">
                                            {task.completed ? "Completed" : "Pending"}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(task)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(task.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <p className="text-sm text-muted-foreground line-clamp-2" title={task.description}>
                                    {task.description || "No description provided."}
                                </p>
                                <div className="text-xs text-muted-foreground space-y-1">
                                    <div className="flex justify-between">
                                        <span>Assigned to:</span>
                                        <span className="font-medium text-foreground">{task.assignedTo?.name || "Unassigned"}</span>
                                    </div>
                                    {task.dueDate && (
                                        <div className="flex justify-between">
                                            <span>Due Date:</span>
                                            <span className="font-medium text-foreground">{format(new Date(task.dueDate), "PPP")}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <TaskForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                task={editingTask}
            />
        </div>
    );
}
