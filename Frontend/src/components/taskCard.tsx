import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onComplete: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete, onComplete }: TaskCardProps) {

  const formattedDate = task.dueDate ? format(new Date(task.dueDate), "PPP") : "Invalid Date";
  

  return (
    <div className={`p-4 rounded-lg border bg-card shadow-sm transition-all ${task.isCompleted ? "opacity-75" : ""}`}>
      <div className="flex flex-col-reverse sm:flex-row md:items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className={`font-medium ${task.isCompleted ? "line-through text-muted-foreground" : ""}`}>
            {task.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
          <p className="text-sm text-muted-foreground mt-2">{formattedDate}
          </p>
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              console.log("Button clicked!"); 
              console.log("Calling onComplete with task:", task);
              onComplete(task);
            }}
            className={task.isCompleted ? "text-green-500" : ""}
          >
            <CheckCircle2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}