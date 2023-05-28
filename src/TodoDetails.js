import React from 'react';
import { useParams } from 'react-router-dom';

function TodoDetails({ todos }) {
  const { id } = useParams();

  // Find the todo with the matching id
  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    return <p>Todo not found</p>;
  }

  return (
    <div>
      <h2>Todo Details</h2>
      <p>Title: {todo.title}</p>
      <p>Description: {todo.description}</p>
      <p>Completed: {todo.completed ? 'Yes' : 'No'}</p>
    </div>
  );
}

export default TodoDetails;
