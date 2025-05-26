import React, { useState, useEffect } from 'react';
import './TodoWrapper.css';
import TodoForm from './TodoForm';

const TodoWrapper = () => {
  const [todos, setTodos] = useState(() => {
    const storedTodos = localStorage.getItem('todos');
    return storedTodos ? JSON.parse(storedTodos) : [];
  });

  const [filter, setFilter] = useState('all');      // 'all', 'active', 'completed'
  const [sort, setSort] = useState('newest');       // 'newest', 'oldest', 'alphabetical'

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const removeTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Filter todos
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // Sort todos (copy array before sorting to avoid mutation)
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sort === 'newest') return b.id - a.id;
    if (sort === 'oldest') return a.id - b.id;
    if (sort === 'alphabetical') return a.text.localeCompare(b.text);
    return 0;
  });

  return (
    <div className="TodoWrapper">
      <h1>React To-Do List</h1>

      {/* Filter buttons */}
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setFilter('all')} disabled={filter === 'all'}>
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          disabled={filter === 'active'}
          style={{ marginLeft: '0.5rem' }}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('completed')}
          disabled={filter === 'completed'}
          style={{ marginLeft: '0.5rem' }}
        >
          Completed
        </button>
      </div>

      {/* Sort buttons */}
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setSort('newest')}
          disabled={sort === 'newest'}
        >
          Newest
        </button>
        <button
          onClick={() => setSort('oldest')}
          disabled={sort === 'oldest'}
          style={{ marginLeft: '0.5rem' }}
        >
          Oldest
        </button>
        <button
          onClick={() => setSort('alphabetical')}
          disabled={sort === 'alphabetical'}
          style={{ marginLeft: '0.5rem' }}
        >
          A-Z
        </button>
      </div>

      <TodoForm addTodo={addTodo} />

      <ul className="todo-list">
        {sortedTodos.map((todo) => (
          <li
            key={todo.id}
            className={todo.completed ? 'completed' : ''}
            onClick={() => toggleComplete(todo.id)}
          >
            {todo.text}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeTodo(todo.id);
              }}
              style={{ marginLeft: '1rem' }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoWrapper;
