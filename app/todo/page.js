"use client";

import { useState, useEffect } from "react";
// 1. Import the library components
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function TodoPage() {
    const [task, setTask] = useState("");
    // Start with an empty array. The useEffect will fill it up later.
    const [todos, setTodos] = useState([]); // Start with an empty list
    const [isLoaded, setIsLoaded] = useState(false); // Helps prevent hydration mismatch

    // Load from Local Storage on startup (Runs only once when the page loads)
    useEffect(() => {
        const savedTodos = localStorage.getItem("my-todo-list");
        if (savedTodos) {
            const parsedTodos = JSON.parse(savedTodos);
            const sanitizedTodos = parsedTodos.map(t => ({
                ...t,
                id: String(t.id) // Forces the ID to be a string
            }));

            setTodos(sanitizedTodos);
        }
        setIsLoaded(true); // Mark that we are ready to show the list
    }, []);

    // Save to Local Storage whenever 'todos' changes
    useEffect(() => {
        // Only save if the data has actually loaded to prevent overwriting with []
        if (isLoaded) {
            localStorage.setItem("my-todo-list", JSON.stringify(todos));
        }
    }, [todos, isLoaded]);

    // Add Task
    const addTask = () => {
        if (task.trim() === "") return;
        const newTodo = { id: String(Date.now()), text: task, completed: false };
        setTodos([...todos, newTodo]);
        setTask("");
    };

    // Toggle Completion (Cross out text)
    const toggleTodo = (id) => {
        setTodos(
            todos.map((t) =>
                t.id === id ? { ...t, completed: !t.completed } : t
            )
        );
    };

    // Delete Task
    const deleteTodo = (id) => {
        setTodos(todos.filter((t) => t.id !== id));
    };

    const handleOnDragEnd = (result) => {
        if (!result.destination) return; // Dropped outside the list? Do nothing.

        const items = Array.from(todos);
        // 1. Remove item from old spot
        const [reorderedItem] = items.splice(result.source.index, 1);
        // 2. Insert item into new spot
        items.splice(result.destination.index, 0, reorderedItem);

        setTodos(items);
    };

    const formatDate = (timestamp) => {
        return new Date(parseInt(timestamp)).toLocaleString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    // Render
    // Optional: Show a loading state until we fetch data from the browser
    if (!isLoaded) {
        return <div style={{ padding: "50px", textAlign: "center" }}>Loading...</div>;
    }

    return (
        <div style={{ maxWidth: "500px", margin: "50px auto", fontFamily: "sans-serif" }}>
            <h1 style={{ textAlign: "center" }}>Task Master</h1>

            {/* Input Field */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
                <input
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTask()} // Allow pressing "Enter" to add
                    placeholder="Add a new task..."
                    style={{ padding: "12px", flexGrow: 1, border: "2px solid #ddd", borderRadius: "8px", fontSize: "16px" }}
                />
                <button
                    onClick={addTask}
                    style={{ padding: "10px 25px", background: "#111", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
                >
                    Add
                </button>
            </div>

            {/* --- DRAG DROP CONTEXT STARTS HERE --- */}
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="todo-list">
                    {(provided) => (
                        <ul
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{ listStyle: "none", padding: 0 }}
                        >
                            {todos.map((t, index) => (
                                <Draggable key={t.id} draggableId={t.id} index={index}>
                                    {(provided, snapshot) => (
                                        <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "15px",
                                                padding: "15px",
                                                background: snapshot.isDragging ? "#111" : "white", // Blue tint when dragging!
                                                borderRadius: "8px",
                                                marginBottom: "10px",
                                                boxShadow: snapshot.isDragging
                                                    ? "0 10px 20px rgba(0,0,0,0.2)"
                                                    : "0 2px 5px rgba(0,0,0,0.05)",
                                                transition: "background 0.2s",
                                                // This combines our style with the library's required styles
                                                ...provided.draggableProps.style
                                            }}
                                        >
                                            {/* Drag Handle Icon */}
                                            <span style={{ color: "#ccc", fontSize: "20px", cursor: "grab" }}>☰</span>

                                            {/* Checkbox */}
                                            <input
                                                type="checkbox"
                                                checked={t.completed}
                                                onChange={() => toggleTodo(t.id)}
                                                style={{ width: "20px", height: "20px", cursor: "pointer" }}
                                            />

                                            {/* Text */}
                                            <div style={{ flexGrow: 1 }}>
                                                <div style={{
                                                    textDecoration: t.completed ? "line-through" : "none",
                                                    color: snapshot.isDragging ? "white" : "black",
                                                    fontSize: "18px"
                                                }}>
                                                    {t.text}
                                                </div>
                                                <div style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>
                                                    {formatDate(t.id)}
                                                </div>
                                            </div>

                                            {/* Delete */}
                                            <button
                                                onClick={() => deleteTodo(t.id)}
                                                style={{ background: snapshot.isDragging ? "white" : "transparent", color: "#ff4d4f", border: "1px solid #ff4d4f", borderRadius: "4px", padding: "5px 10px", cursor: "pointer", fontSize: "12px" }}
                                            >
                                                Delete
                                            </button>
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder} {/* Keeps space while dragging */}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}