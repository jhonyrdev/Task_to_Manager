export default class Task {
    constructor(id, name, description, dueDate, isCompleted = false) {
      if (!name || name.trim() === '') throw new Error("El nombre no puede estar vacío.");
      if (new Date(dueDate) < new Date()) throw new Error("La fecha de vencimiento no puede ser pasada.");
  
      this.id = id;
      this.name = name;
      this.description = description;
      this.dueDate = new Date(dueDate);
      this.isCompleted = isCompleted;
    }
  }
  