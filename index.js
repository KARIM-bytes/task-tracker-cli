const fs = require("fs");

// Read CLI args
const args = process.argv.slice(2);
const command = args[0];
const input = args[1];

// Ensure tasks.json exists
if (!fs.existsSync("tasks.json")) {
  fs.writeFileSync("tasks.json", JSON.stringify([]));
}

// Read tasks
const tasks = JSON.parse(fs.readFileSync("tasks.json", "utf-8"));

if (command === "add") {
  if (!input) {
    console.log("❌ Please provide a task description");
    process.exit(1);
  }
   const newId =
  tasks.length === 0
    ? 1
    : Math.max(...tasks.map(t => t.id)) + 1;

  const newTask = {
    id: newId,
    description: input,
    status: "todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tasks.push(newTask);

  fs.writeFileSync("tasks.json", JSON.stringify(tasks, null, 2));

  console.log(`✅ Task added successfully (ID: ${newTask.id})`);
}

//list check
if (command === "list") {
  let filteredTasks = tasks;

  if (input) {
    filteredTasks = tasks.filter(task => task.status === input);
  }

  if (filteredTasks.length === 0) {
    console.log("📭 No tasks found");
    process.exit(0);
  }

  console.log("📋 Tasks:");
  filteredTasks.forEach((task, index) => {
    console.log(`${index + 1}. ${task.description}  [${task.status}]`);
  });
}

//mark done task
if (command === "mark-done" || command === "mark-in-progress") {
  const id = parseInt(input);

  const task = tasks.find(t => t.id === id);

  if (!task) {
    console.log("❌ Task not found");
    process.exit(1);
  }

  task.status = command === "mark-done" ? "done" : "in-progress";
  task.updatedAt = new Date().toISOString();

  fs.writeFileSync("tasks.json", JSON.stringify(tasks, null, 2));

  console.log(`✅ Task ${id} marked as done`);
}
// deleye task 
if (command === "delete") {
  const id = Number(input);

  const taskExists = tasks.some(t => t.id === id);

  if (!taskExists) {
    console.log("❌ Task not found");
    process.exit(1);
  }

  const updatedTasks = tasks.filter(t => t.id !== id);

  fs.writeFileSync("tasks.json", JSON.stringify(updatedTasks, null, 2));

  console.log(`🗑️ Task ${id} deleted successfully`);
}

