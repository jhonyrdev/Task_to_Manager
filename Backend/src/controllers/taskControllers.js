import { db } from '../dataBase.js';  // Importamos la conexión a la base de datos
import { v4 as uuidv4 } from 'uuid';
import Task from '../models/taskModels.js';

// Obtener todas las tareas con filtros
const getAllTasks = (req, res) => {
  const { status } = req.query;

  let filteredTasks = db.data.tasks; // Usamos los datos de db.json

  if (status === 'completed') {
    filteredTasks = filteredTasks.filter(task => task.isCompleted);
  } else if (status === 'incomplete') {
    filteredTasks = filteredTasks.filter(task => !task.isCompleted);
  }

  res.json(filteredTasks);
};

const createTask = async (req, res) => {
  try {
    const { name, description, dueDate } = req.body;

    const dueDateParsed = new Date(dueDate);
    if (isNaN(dueDateParsed)) {
      return res.status(400).json({ error: "Fecha inválida" });
    }

    const newTask = new Task(uuidv4(), name, description, dueDateParsed);

    db.data.tasks.push(newTask);

    await db.write();

    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  const taskId = req.params.id;
  const { name, description, dueDate, isCompleted } = req.body;


  const task = db.data.tasks.find(t => t.id === taskId);

  if (!task) return res.status(404).json({ error: "Tarea no encontrada" });

  if (task.isCompleted) {
    return res.status(400).json({ error: "No se puede editar una tarea completada" });
  }

  if (dueDate) {
    const dueDateParsed = new Date(dueDate);
    if (isNaN(dueDateParsed)) {
      return res.status(400).json({ error: "Fecha inválida" });
    }
    task.dueDate = dueDateParsed;
  }

  if (name) task.name = name;
  if (description) task.description = description;
  if (dueDate) task.dueDate = new Date(dueDate);
  if (typeof isCompleted === 'boolean') task.isCompleted = isCompleted;

  await db.write();

  res.json(task);
};

const deleteTask = async (req, res) => {
  const taskId = req.params.id;

  const taskIndex = db.data.tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) return res.status(404).json({ error: "Tarea no encontrada" });

  const task = db.data.tasks[taskIndex];
  if (task.isCompleted) {
    return res.status(400).json({ error: "No se puede eliminar una tarea completada" });
  }

  db.data.tasks.splice(taskIndex, 1);

  await db.write();

  res.status(204).send();
};

export { getAllTasks, createTask, updateTask, deleteTask };
