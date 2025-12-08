import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTaskStore } from "@/store/task";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Spinner } from "@/components/ui/Loader/spinner";

export default function EmployeeTasks() {
    const { tasks, isLoading, error, fetchTasks, toggleTask } = useTaskStore();

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleToggle = async (id: string, completed: boolean) => {
        await toggleTask(id, completed);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "destructive";
            case "medium":
                return "default";
            case "low":
                return "secondary";
            default:
                return "secondary";
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold">My Tasks</h1>
                <p className="text-muted-foreground">View and manage your assigned tasks.</p>
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
                    You have no assigned tasks.
                </div>
            ) : (
                <div className="space-y-4">
                    {tasks.map((task) => (
                        <Card key={task.id} className={`transition-all ${task.completed ? "opacity-60 bg-muted/50" : ""}`}>
                            <CardContent className="p-6 flex items-start gap-4">
                                <Checkbox
                                    checked={task.completed}
                                    onCheckedChange={(checked) => handleToggle(task.id, checked as boolean)}
                                    className="mt-1"
                                />

                                <div className="flex-1 space-y-2">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <h3 className={`font-semibold text-lg ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                                                {task.title}
                                            </h3>
                                            <div className="flex gap-2">
                                                <Badge variant={getPriorityColor(task.priority) as any} className="text-xs capitalize">
                                                    {task.priority}
                                                </Badge>
                                                {task.dueDate && (
                                                    <span className={`text-xs ${new Date(task.dueDate) < new Date() && !task.completed ? "text-destructive font-bold" : "text-muted-foreground"}`}>
                                                        Due: {format(new Date(task.dueDate), "PPP")}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-muted-foreground">
                                        {task.description || "No description provided."}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
