import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDepartmentStore } from "@/store/department";
import { Trash2, Users } from "lucide-react";
import type { Department as DepartmentType } from "@/types";
import { Spinner } from "@/components/ui/Loader/spinner";
import AddDepartments from "@/components/forms/admin/AddDepartments";
import EditDepartment from "@/components/forms/admin/EditDepartment";
import { useToast } from "@/hooks/use-toast";

export default function Departments() {
  const { departments, isLoading, error, fetchDepartments, deleteDepartment } =
    useDepartmentStore();
  const { toast } = useToast();

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleDelete = async (department: DepartmentType) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${department.name}? This action cannot be undone.`
      )
    ) {
      const success = await deleteDepartment(department.id);
      if (success) {
        toast({
          title: "Success",
          description: "Department deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete department",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Departments</h1>
          <p className="text-muted-foreground">
            Manage your organization's departments
          </p>
        </div>

        <AddDepartments />
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <Spinner variant="ellipsis" />
          </div>
        ) : departments.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No departments found
          </div>
        ) : (
          departments.map((department) => (
            <DepartmentCards
              key={department.id}
              department={department}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

const DepartmentCards = ({
  department,
  onDelete,
}: {
  department: DepartmentType;
  onDelete: (dept: DepartmentType) => void;
}) => {
  const { isLoading } = useDepartmentStore();

  return (
    <Card className="hover:shadow-lg transition-shadow" key={department.id}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{department.name}</CardTitle>
        <div className="flex gap-1">
          <EditDepartment department={department} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(department)}
            disabled={isLoading}
            title="Delete department"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground">Department Head</p>
          <p className="font-medium">{department.head || "Not assigned"}</p>
        </div>

        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {department.employeeCount}{" "}
            {department.employeeCount === 1 ? "Employee" : "Employees"}
          </span>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            {department.description || "No description"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
