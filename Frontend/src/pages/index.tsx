import { useState, useEffect } from "react";
import { Task } from "@/types/task";
import { TaskCard } from "../components/taskCard";
import { TaskForm } from "../components/taskForm";
import { DeleteAlert } from "../components/com_Dialog/deleteAlert";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { toast } = useToast();
  const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    // Cargar tareas desde el backend
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${URL}/tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleCreateTask = async (taskData: {
    name: string;
    description: string;
    dueDate: string;
  }) => {
    const mappedTaskData = {
      name: taskData.name,
      description: taskData.description,
      dueDate: taskData.dueDate,
      isCompleted: false,
    };

    try {
      const response = await fetch(`${URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mappedTaskData),
      });
      const newTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, newTask]);
      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      });
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error",
        description: "There was an issue creating the task.",
        variant: "destructive",
      });
    }
  };

  const handleEditTask = async (taskData: Omit<Task, "id" | "completed">) => {
    if (!selectedTask) return;
    try {
      const response = await fetch(
        `${URL}/tasks/${selectedTask.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        }
      );
      const updatedTask = await response.json();
      const updatedTasks = tasks.map((task) =>
        task.id === selectedTask.id ? updatedTask : task
      );
      setTasks(updatedTasks);
      setSelectedTask(null);
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    } catch (error) {
      console.error("Error editing task:", error);
      toast({
        title: "Error",
        description: "There was an issue editing the task.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    try {
      await fetch(`${URL}/tasks/${selectedTask.id}`, {
        method: "DELETE",
      });
      const updatedTasks = tasks.filter((task) => task.id !== selectedTask.id);
      setTasks(updatedTasks);
      setSelectedTask(null);
      setIsDeleteAlertOpen(false);
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "There was an issue deleting the task.",
        variant: "destructive",
      });
    }
  };

  const handleCompleteTask = async (task: Task) => {
    try {
      const response = await fetch(`${URL}/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          { ...task, 
            isCompleted: !task.isCompleted }
          ),
      });
      const updatedTask = await response.json();
      
      const updatedTasks = tasks.map((t) =>
        t.id === task.id ? { ...t, isCompleted: updatedTask.isCompleted } : t
      );
      setTasks(updatedTasks);
      
      toast({
        title: task.isCompleted ? "Task uncompleted" : "Task completed",
        description: `Task "${task.name}" has been ${
          task.isCompleted ? "uncompleted" : "completed"
        }.`,
      });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };
  

  return (
    <div className="container py-10 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-8 mb-8">
        <h1 className="text-3xl font-bold text-center sm:text-left">Task Manager</h1>
        <Button onClick={() => setIsFormOpen(true)}  className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No tasks yet. Create your first task!
          </div>
        ) : (
          tasks.map((task) => {
            console.log(task.id); 
            return (
              <TaskCard
                key={task.id} 
                task={task}
                onEdit={(task) => {
                  setSelectedTask(task);
                  setIsFormOpen(true);
                }}
                onDelete={(task) => {
                  setSelectedTask(task);
                  setIsDeleteAlertOpen(true);
                }}
                onComplete={handleCompleteTask}
              />
            );
          })
        )}
      </div>

      <TaskForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={selectedTask ? handleEditTask : handleCreateTask}
        initialData={selectedTask || undefined}
      />

      <DeleteAlert
        open={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
        onConfirm={handleDeleteTask}
      />
    </div>
  );
};

export default Index;
