import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
import TodoDetails from './TodoDetails';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCjYUIQtIGx5osC9vgNkIFz3v-iLqsI9PQ',
  authDomain: 'notes-242c0.firebaseapp.com',
  databaseURL: 'https://notes-242c0-default-rtdb.firebaseio.com',
  projectId: 'notes-242c0',
  storageBucket: 'notes-242c0.appspot.com',
  messagingSenderId: '378520659218',
  appId: '1:378520659218:web:6b991fbc66d4f1c0f43fcb',
};
//firebase.initializeApp(firebaseConfig);

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

function App() {
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatedTodo, setUpdatedTodo] = useState('');
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});
  const [newImage, setNewImage] = useState('');
  const [commentText, setCommentText] = useState('');
  const [todoComments, setTodoComments] = useState({});

  useEffect(() => {
    const todosRef = database.ref('todos');
    const likesRef = database.ref('likes');
    const dislikesRef = database.ref('dislikes');

    // Fetch initial todos from the database
    todosRef.on('value', (snapshot) => {
      const todoData = snapshot.val();
      const todoList = todoData ? Object.values(todoData) : [];
      setTodos(
        todoList.map((todo) => ({
          ...todo,
          comments: todo.comments || [], // Include an empty array for comments if it's not present
        }))
      );
    });

    // Fetch initial likes counts for each todo
    likesRef.on('value', (snapshot) => {
      const likesData = snapshot.val() || {};
      setLikes(likesData);
    });

    // Fetch initial dislikes counts for each todo
    dislikesRef.on('value', (snapshot) => {
      const dislikesData = snapshot.val() || {};
      setDislikes(dislikesData);
    });

    // Fetch initial comments for each todo
    todosRef.on('value', (snapshot) => {
      const todoData = snapshot.val();
      const todoCommentsData = todoData
        ? Object.entries(todoData).reduce((acc, [id, todo]) => {
            acc[id] = todo.comments || [];
            return acc;
          }, {})
        : {};
      setTodoComments(todoCommentsData);
    });

    return () => {
      todosRef.off('value');
      likesRef.off('value');
      dislikesRef.off('value');
    };
  }, []);

  const addTodo = () => {
    if (newTodo.trim() === '') return;
    const todoRef = database.ref('todos').push();
    todoRef.set({
      id: todoRef.key,
      title: newTodo,
      description: newDescription,
      image: newImage, // Include the newImage value
      completed: false,
      likes: 0,
      dislikes: 0,
    });
    setNewTodo('');
    setNewDescription('');
    setNewImage('');
  };
  const likeTodo = (id) => {
    const todoRef = database.ref(`todos/${id}`);
    todoRef.transaction(
      (todo) => {
        if (todo) {
          if (!todo.likes) {
            todo.likes = 1;
          } else {
            todo.likes++;
          }
        }
        return todo;
      },
      (error, committed, snapshot) => {
        if (committed) {
          const updatedTodo = snapshot.val();
          setLikes((prevLikes) => ({
            ...prevLikes,
            [id]: updatedTodo.likes || 0,
          }));
        }
      }
    );
  };
  const addComment = (todoId) => {
    if (commentText.trim() === '') return;

    const commentRef = database.ref(`todos/${todoId}/comments`).push();
    commentRef.set({
      id: commentRef.key,
      text: commentText,
      author: 'User', // Replace with the actual user
      timestamp: Date.now(),
    });

    setCommentText(''); // Reset the comment text after adding the comment

    // Update the comments for the respective todo
    setTodoComments((prevComments) => {
      const comments = prevComments[todoId] || {}; // Default to an empty object if comments is not defined
      return {
        ...prevComments,
        [todoId]: { ...comments, [commentRef.key]: true }, // Store the comment key as a property with value true
      };
    });
  };

  const dislikeTodo = (id) => {
    const todoRef = database.ref(`todos/${id}`);
    todoRef.transaction(
      (todo) => {
        if (todo) {
          if (!todo.dislikes) {
            todo.dislikes = 1;
          } else {
            todo.dislikes++;
          }
        }
        return todo;
      },
      (error, committed, snapshot) => {
        if (committed) {
          const updatedTodo = snapshot.val();
          setDislikes((prevDislikes) => ({
            ...prevDislikes,
            [id]: updatedTodo.dislikes || 0,
          }));
        }
      }
    );
  };
  const updateTodo = (id, completed) => {
    const todoRef = database.ref(`todos/${id}`);
    todoRef.transaction(
      (todo) => {
        if (todo) {
          todo.completed = completed;
          todo.likes = completed ? likes[id] || 0 : 0;
          todo.dislikes = completed ? dislikes[id] || 0 : 0;
        }
        return todo;
      },
      (error, committed, snapshot) => {
        if (committed) {
          const updatedTodo = snapshot.val();
          setLikes((prevLikes) => ({
            ...prevLikes,
            [id]: updatedTodo.likes || 0,
          }));
          setDislikes((prevDislikes) => ({
            ...prevDislikes,
            [id]: updatedTodo.dislikes || 0,
          }));
        }
      }
    );
  };

  const updateTodoName = (id, newName) => {
    const todoRef = database.ref(`todos/${id}`);
    todoRef.update({
      title: newName,
    });
  };

  const deleteTodo = (id) => {
    const todoRef = database.ref(`todos/${id}`);
    todoRef.remove();
  };

  const filterTodos = (todos) => {
    return todos.filter((todo) =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredTodos = filterTodos(todos);

  const handleUpdate = (id) => {
    updateTodoName(id, updatedTodo);
    setUpdatedTodo('ff');
  };
  const TodoList = ({ todos }) => {
    const location = useLocation();
  };

  return (
    <Router>
      <div>
        <h1>Todo App</h1>
        <input
          type="text"
          placeholder="New Todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <button onClick={addTodo}>Add Todo</button>
        <input
          type="text"
          placeholder="Search Todos"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <ul>
          <Routes>
            <Route path="/" element={<TodoList todos={filteredTodos} />} />
            <Route path="/todos/:id" element={<TodoDetails todos={todos} />} />
          </Routes>
          {filteredTodos.map((todo) => (
            <li key={todo.id}>
              <Link to={`/todos/${todo.id}`}>{todo.title}</Link>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={(e) => updateTodo(todo.id, e.target.checked)}
              />
              <input
                type="text"
                onChange={(e) => setUpdatedTodo(e.target.value)}
              />
              <input
                type="text"
                placeholder="Add a comment"
                onChange={(e) => setCommentText(e.target.value)}
              />

              <p>{todo.description}</p>

              <button onClick={() => handleUpdate(todo.id)}>Update</button>
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              <br />
              <button onClick={() => likeTodo(todo.id)}>Like</button>
              <button onClick={() => dislikeTodo(todo.id)}>Dislike</button>
              <button onClick={() => addComment(todo.id)}>Add Comment</button>
              <p>Likes: {todo.likes}</p>
              <p>Dislikes: {todo.dislikes}</p>
              {todo.comments &&
                Object.values(todo.comments).map((comment) => (
                  <p key={comment.id}>{comment.text}</p>
                ))}
            </li>
          ))}
        </ul>
      </div>
    </Router>
  );
}

export default App;
