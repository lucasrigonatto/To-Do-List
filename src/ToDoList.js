import React from "react";

const checkStatus = (response) => {
  if (response.ok) {
    return response;
  }
  throw new Error("Request was either a 404 or 500");
};

const json = (response) => response.json();

class ToDoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      new_task: "",
      tasks: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchTasks = this.fetchTasks.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.toggleComplete = this.toggleComplete.bind(this);
  }

  componentDidMount() {
    this.fetchTasks();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.tasks !== this.state.tasks ||
      nextState.new_task !== this.state.new_task
    );
  }

  fetchTasks() {
    fetch("https://fewd-todolist-api.onrender.com/tasks?api_key=48")
      .then(checkStatus)
      .then(json)
      .then((response) => {
        this.setState({ tasks: response.tasks });
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  handleChange(event) {
    this.setState({ new_task: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    let { new_task } = this.state;
    new_task = new_task.trim();
    if (!new_task) {
      return;
    }
    fetch("https://fewd-todolist-api.onrender.com/tasks?api_key=48", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: { content: new_task } }),
    })
      .then(checkStatus)
      .then(json)
      .then((response) => {
        this.setState((prevState) => ({
          tasks: [...prevState.tasks, response.task], // Adiciona a nova tarefa diretamente no estado
          new_task: "",
        }));
      })
      .catch((error) => {
        console.error(error);
      });
  }

  deleteTask(id) {
    if (!id) return;

    fetch(`https://fewd-todolist-api.onrender.com/tasks/${id}?api_key=48`, {
      method: "DELETE",
      mode: "cors",
    })
      .then(checkStatus)
      .then(() => {
        this.fetchTasks();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  toggleComplete(id, completed) {
    const newCompletedStatus = !completed;

    fetch(`https://fewd-todolist-api.onrender.com/tasks/${id}?api_key=48`, {
      method: "PUT",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: { completed: newCompletedStatus } }),
    })
      .then(checkStatus)
      .then(() => {
        // Em vez de buscar todas as tarefas, atualizamos diretamente no estado
        this.setState((prevState) => ({
          tasks: prevState.tasks.map((task) =>
            task.id === id ? { ...task, completed: newCompletedStatus } : task
          ),
        }));
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const { new_task, tasks } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="mb-3">To Do List</h2>
            {tasks.length > 0 ? (
              tasks.map((task) => {
                return (
                  <div key={task.id} className="row mb-1">
                    <p className="col">{task.content}</p>
                    <button onClick={() => this.deleteTask(task.id)}>
                      Delete
                    </button>
                    <input
                      type="checkbox"
                      onChange={() =>
                        this.toggleComplete(task.id, task.completed)
                      }
                      checked={task.completed}
                    />
                  </div>
                );
              })
            ) : (
              <p>No tasks here</p>
            )}
            <form onSubmit={this.handleSubmit} className="form-inline my-4">
              <input
                type="text"
                className="form-control mr-sm-2 mb-2"
                placeholder="New task"
                value={new_task}
                onChange={this.handleChange}
              />
              <button type="submit" className="btn btn-primary mb-2">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ToDoList;
