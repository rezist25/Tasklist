const STORAGE_KEY = 'tasklist_tasks';

const DataService = {
  getTasks: function() {
    const tasksJson = localStorage.getItem(STORAGE_KEY);
    if (tasksJson) {
      try {
        const tasks = JSON.parse(tasksJson);
        return Promise.resolve(tasks);
      } catch (e) {
        return Promise.resolve([]);
      }
    }
    return Promise.resolve([]);
  },

  addNewTask: function(body, lastTaskList) {
    const newTask = {
      id: lastTaskList.length > 0 ? lastTaskList[lastTaskList.length - 1].id + 1 : 1,
      title: body.title,
      completed: false,
      priority: body.priority || 'Medium',
      date: body.date || null,
      progress: body.progress || 0
    };
    const newTaskList = [...lastTaskList, newTask];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTaskList));
    return Promise.resolve(newTaskList);
  },

  updateTask: function(updatedTask, lastTaskList) {
    const newTaskList = lastTaskList.map(task => task.id === updatedTask.id ? updatedTask : task);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTaskList));
    return Promise.resolve(newTaskList);
  },

  deleteTask: function(taskId, lastTaskList) {
    const newTaskList = lastTaskList.filter(task => task.id !== taskId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTaskList));
    return Promise.resolve(newTaskList);
  }
};

export default DataService;
