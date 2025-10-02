type TaskState = 'running' | 'success' | 'error' | 'cancelled';

interface Task {
  id: string;
  label: string;
  state: TaskState;
  message?: string;
  cancellable: boolean;
}

class TaskManager {
  private tasks: Map<string, Task> = new Map();

  createTask(task: Task): Task {
    this.tasks.set(task.id, task);
    this.notifyRenderer();
    return task;
  }

  updateTask(id: string, updates: Partial<Task>) {
    const task = this.tasks.get(id);
    if (!task) return;
    Object.assign(task, updates);
    this.notifyRenderer();
  }

  private notifyRenderer() {
    // send IPC event to renderer
  }
}

export const tasks = new TaskManager();