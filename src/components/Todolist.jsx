import React, { useState } from 'react';

const Todolist = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  // Add task with timestamp
  const addTask = () => {
    if (task.trim() === '') return;
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTasks([...tasks, { text: task, done: false, date, time }]);
    setTask('');
  };

  // Delete task
  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  // Toggle Done
  const toggleDone = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].done = !updatedTasks[index].done;
    setTasks(updatedTasks);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)',
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '400px',
          background: '#fff',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        }}
      >
        <h1
          style={{
            color: '#333',
            textAlign: 'center',
            marginBottom: '20px',
            fontSize: '24px',
          }}
        >
          📌 Todo List
        </h1>

        {/* Input and Add button */}
        <div style={{ display: 'flex', marginBottom: '15px' }}>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter a task..."
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '14px',
            }}
          />
          <button type="button"
            onClick={addTask}
            style={{
              marginLeft: '10px',
              padding: '10px 15px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background 0.3s',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#218838')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#28a745')}
          >
            Add
          </button>
        </div>

        {/* Task List */}
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
          {tasks.map((t, index) => (
            <li
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                borderBottom: '1px solid #eee',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#f9f9f9')}
              onMouseOut={(e) => (e.currentTarget.style.background = 'white')}
            >
              <div
                onClick={() => toggleDone(index)}
                style={{
                  flexGrow: 1,
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <span
                  style={{
                    textDecoration: t.done ? 'line-through' : 'none',
                    color: t.done ? '#777' : '#333',
                    fontWeight: t.done ? 'normal' : 'bold',
                    fontSize: '15px',
                  }}
                >
                  {t.text}
                </span>
                <br />
                <small style={{ color: '#888', fontSize: '12px' }}>
                  Added on {t.date} at {t.time}
                </small>
              </div>

              <button type="button"
                onClick={() => deleteTask(index)}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 10px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  transition: 'background 0.3s',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#c82333')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#dc3545')}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Todolist;
