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
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDepartmentStore } from "@/store/department";
import { useEmployeeStore } from "@/store/employee";
import { Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Department } from "@/types";

interface EditDepartmentProps {
  department: Department;
}

const EditDepartment = ({ department }: EditDepartmentProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: department.name,
    head: department.head,
    employeeCount: department.employeeCount.toString(),
    description: department.description,
  });

  const { updateDepartment, isLoading } = useDepartmentStore();
  const { employees, fetchEmployees } = useEmployeeStore();
  const { toast } = useToast();

  useEffect(() => {
    if (isDialogOpen) {
      fetchEmployees();
    }
  }, [isDialogOpen, fetchEmployees]);

  const activeEmployees = employees.filter((emp) => emp.status === "active");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const deptData = {
      name: formData.name,
      head: formData.head === "none" ? "" : formData.head,
      employeeCount: parseInt(formData.employeeCount) || 0,
      description: formData.description,
    };

    const success = await updateDepartment(department.id, deptData);

    if (success) {
      toast({
        title: "Success",
        description: "Department updated successfully",
      });
      setIsDialogOpen(false);
    } else {
      toast({
        title: "Error",
        description: "Failed to update department",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>
          <DialogDescription>
            Update the department information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Department Name</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              disabled={isLoading}
              placeholder="e.g., IT Department"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-head">Department Head</Label>
            <Select
              value={formData.head}
              onValueChange={(value) =>
                setFormData({ ...formData, head: value })
              }
              disabled={isLoading}
            >
              <SelectTrigger id="edit-head">
                <SelectValue placeholder="Select department head" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {activeEmployees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.name}>
                    {employee.name} - {employee.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-employeeCount">Employee Count</Label>
            <Input
              id="edit-employeeCount"
              type="number"
              min="0"
              value={formData.employeeCount}
              onChange={(e) =>
                setFormData({ ...formData, employeeCount: e.target.value })
              }
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              disabled={isLoading}
              placeholder="Brief description of the department"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Department"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
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

export default EditDepartment;

