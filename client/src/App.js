import { useEffect, useState } from "react";
import API from "./api/api";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

function App() {
  const [boards, setBoards] = useState([]);
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [boardTitle, setBoardTitle] = useState("");
  const [listTitle, setListTitle] = useState("");
  const [taskTitle, setTaskTitle] = useState("");

  const [selectedBoard, setSelectedBoard] = useState(null);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    const res = await API.get("/boards");
    setBoards(res.data);
  };

  const fetchLists = async (boardId) => {
    const res = await API.get(`/lists/${boardId}`);
    setLists(res.data);
  };

  const fetchTasks = async (listId) => {
    const res = await API.get(`/tasks/${listId}`);
    setTasks((prev) => [...prev, ...res.data]);
  };

  const createBoard = async () => {
    if (!boardTitle) return;
    await API.post("/boards", { title: boardTitle });
    setBoardTitle("");
    fetchBoards();
  };

  const createList = async () => {
    if (!listTitle || !selectedBoard) return;
    await API.post("/lists", { title: listTitle, boardId: selectedBoard, });
    setListTitle("");
    fetchLists(selectedBoard);
  };

  const createTask = async (listId) => {
    if (!taskTitle) return;
    await API.post("/tasks", { title: taskTitle, listId });
    setTaskTitle("");
    fetchTasks(listId);
  };

  // 🔥 DRAG FUNCTION
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const movedTask = tasks.find(
      (t) => t._id === result.draggableId
    );

    movedTask.listId = result.destination.droppableId;

    setTasks([...tasks]);
  };

  return (
  <div
    style={{
      background: "#0079bf",
      minHeight: "100vh",
      padding: "20px",
    }}
  >
    <h1 style={{ color: "white", marginBottom: "20px" }}>
      TaskFlow
    </h1>

    {/* Create Board */}
    <div style={{ marginBottom: "20px" }}>
      <input
        placeholder="Board name"
        value={boardTitle}
        onChange={(e) => setBoardTitle(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "5px",
          border: "none",
          marginRight: "10px",
        }}
      />
      <button
        onClick={createBoard}
        style={{
          padding: "10px 15px",
          background: "#5aac44",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Create Board
      </button>
    </div>

    {/* Boards */}
    <div style={{ marginBottom: "20px" }}>
      {boards.map((b) => (
        <button
          key={b._id}
          onClick={() => {
            setSelectedBoard(b._id);
            setTasks([]);
            fetchLists(b._id);
          }}
          style={{
            marginRight: "10px",
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            background: "#026aa7",
            color: "white",
            cursor: "pointer",
          }}
        >
          {b.title}
        </button>
      ))}
    </div>

    {/* Lists */}
    {selectedBoard && (
      <>
        <div style={{ marginBottom: "15px" }}>
          <input
            placeholder="List name"
            value={listTitle}
            onChange={(e) => setListTitle(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "none",
              marginRight: "10px",
            }}
          />
          <button
            onClick={createList}
            style={{
              padding: "10px 15px",
              background: "#5aac44",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Add List
          </button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div style={{ display: "flex", gap: "20px" }}>
            {lists.map((list) => (
              <Droppable droppableId={list._id} key={list._id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      background: "#ebecf0",
                      padding: "10px",
                      borderRadius: "10px",
                      width: "250px",
                      minHeight: "300px",
                    }}
                  >
                    <h3 style={{ marginBottom: "10px" }}>
                      {list.title}
                    </h3>

                    <button
                      onClick={() => fetchTasks(list._id)}
                      style={{
                        marginBottom: "10px",
                        padding: "5px 10px",
                        border: "none",
                        borderRadius: "5px",
                        background: "#0079bf",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      Load Tasks
                    </button>

                    <input
                      placeholder="Task"
                      onChange={(e) => setTaskTitle(e.target.value)}
                      style={{
                        padding: "8px",
                        borderRadius: "5px",
                        border: "none",
                        width: "100%",
                        marginBottom: "5px",
                      }}
                    />

                    <button
                      onClick={() => createTask(list._id)}
                      style={{
                        width: "100%",
                        padding: "8px",
                        background: "#5aac44",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        marginBottom: "10px",
                        cursor: "pointer",
                      }}
                    >
                      Add Task
                    </button>

                    {/* Tasks */}
                    {tasks
                      .filter((t) => t.listId === list._id)
                      .map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                background: "white",
                                padding: "10px",
                                marginBottom: "10px",
                                borderRadius: "8px",
                                boxShadow:
                                  "0 2px 5px rgba(0,0,0,0.1)",
                                ...provided.draggableProps.style,
                              }}
                            >
                              {task.title}
                            </div>
                          )}
                        </Draggable>
                      ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </>
    )}
  </div>
);
}

export default App;