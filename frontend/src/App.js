import React, { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/tasks")
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    fetch("http://localhost:4000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTaskTitle }),
    })
      .then(res => res.json())
      .then(newTask => {
        setTasks([...tasks, newTask]);
        setNewTaskTitle("");
      });
  };

  const toggleTask = (task) => {
    fetch(`http://localhost:4000/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    })
      .then(res => res.json())
      .then(updatedTask => {
        setTasks(tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)));
      });
  };

  const deleteTask = (id) => {
    fetch(`http://localhost:4000/tasks/${id}`, {
      method: "DELETE",
    }).then(() => {
      setTasks(tasks.filter(t => t.id !== id));
    });
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h1>Lista de Tareas</h1>

      <input
        type="text"
        value={newTaskTitle}
        onChange={e => setNewTaskTitle(e.target.value)}
        placeholder="Nueva tarea"
        onKeyDown={e => e.key === "Enter" && addTask()}
        style={{ width: "70%", padding: 8 }}
      />
      <button onClick={addTask} style={{ padding: 8, marginLeft: 8 }}>
        Añadir
      </button>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map(task => (
          <li
            key={task.id}
            style={{
              marginTop: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#f0f0f0",
              padding: 10,
              borderRadius: 4,
            }}
          >
            <span
              onClick={() => toggleTask(task)}
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
            >
              {task.title}
            </span>
            <button
              onClick={() => deleteTask(task.id)}
              style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
