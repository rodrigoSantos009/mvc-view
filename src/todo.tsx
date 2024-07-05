import * as React from "react";
import { api } from "./lib/axios";

type Task = {
  id: string;
  title: string;
  done: boolean
};


const TodoItem: React.FC<Task & { onDelete: () => void, onEdit: () => void }> = ({ id, title, done, onDelete, onEdit }) => {
  const todoItemStyle = {
    marginBottom: "10px",
  };
  id
  const todoTitleStyle = {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: done ? "gray" : "white",
    textDecoration: done ? "line-through" : "none",
  };

  return (
    <article style={todoItemStyle} className="todo-item">
      <div className="todo-content">
        <div className="todo-text">
          <h2 style={todoTitleStyle} className="todo-title">
            {title}
          </h2>
          <p>
            <button
              style={{
                color: "white",
                backgroundColor: "green",
                cursor: "pointer",
              }}
              onClick={onEdit}
              disabled={done}
            >
              Finalizar
            </button>{" "}
            |{" "}
            <button
              style={{
                color: "white",
                backgroundColor: "red",
                cursor: "pointer",
              }}
              onClick={onDelete}
            >
              Apagar
            </button>
          </p>
        </div>
      </div>
    </article>
  );
};

const TodoList: React.FC = () => {
  const [taskInput, setTaskInput] = React.useState<string>("");
  const [tasks, setTasks] = React.useState<Task[]>([]);

  const fetchData = async () => {
    try {
      const response = await api.get("tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Erro", error);
    }
  };
  React.useEffect(() => {
    fetchData();
  }, []);

  const addTask = async () => {
    try {
      await api.post("tasks", { title: taskInput });
      setTaskInput("");
      fetchData();
    } catch (error) {
      console.error("Erro: ", error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await api.delete(`tasks/${taskId}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

   const taskDone = async (taskId: string) => {
     try {
       await api.put(`tasks/${taskId}`);
       fetchData();
     } catch (error) {
       console.error("Erro ao editar tarefa: ", error);
     }
   };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskInput(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (taskInput.trim() !== "") {
      addTask()
    }
  };

  const inputStyle = {
    padding: "10px",
    marginRight: "10px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    width: "300px",
    marginBottom: '20px',
  };

  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
  };


  return (
    <section className="todo-list">
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={taskInput}
          onChange={handleInputChange}
          placeholder="Digite uma nova tarefa..."
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          Adicionar Tarefa
        </button>
      </form>

      {tasks.length > 0 ? (
        tasks.map((task) => (
          <TodoItem
            key={task.id}
            id={task.id}
            title={task.title}
            done={task.done}
            onDelete={() => deleteTask(task.id)}
            onEdit={() => taskDone(task.id)}
          />
        ))
      ) : (
        <div>Você não possui tarefas!</div>
      )}
    </section>
  );
};

const App: React.FC = () => {
  return (
    <main className="app-container">
      <TodoList />
    </main>
  );
};

export default App;
