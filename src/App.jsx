import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';


const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');


  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    sortTodos();
  }, [sortOrder]);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/todo');
      setTodos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const createTodo = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/todo', { name: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      console.error(error);
    }
  };

  const editTodo = async (id, newName) => {
    try {
      await axios.put(`http://127.0.0.1:5000/api/todo/${id}`, { name: newName });
      const updatedTodos = todos.map(todo => {
        if (todo._id === id) {
          return { ...todo, name: newName };
        }
        return todo;
      });
      setTodos(updatedTodos);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/todo/${id}`);
      const filteredTodos = todos.filter(todo => todo._id !== id);
      setTodos(filteredTodos);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (event) => {
    setNewTodo(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const sortTodos = () => {
    const sortedTodos = [...todos].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (sortOrder === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
    setTodos(sortedTodos);
  };

  return (
    // <div>
    //   <input type="text" value={newTodo} onChange={handleInputChange} />
    //   <button onClick={createTodo}>Add</button>
    //   <ul>
    //     {todos.map(todo => (
    //       <li key={todo._id}>
    //         <input
    //           type="text"
    //           value={todo.name}
    //           onChange={(event) => editTodo(todo._id, event.target.value)}
    //         />
    //         <button onClick={() => deleteTodo(todo._id)}>Delete</button>
    //       </li>
    //     ))}
    //   </ul>
    // </div>

    <div className="container">
      <h2 className="heading">Todo-List</h2>
    <div className="todo-container">
      <input
        type="text"
        value={newTodo}
        onChange={handleInputChange}
        className="todo-input"
      />
      <button onClick={createTodo} className="add-button">Add</button>
      <div className="sort-container">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortOrder}
            onChange={handleSortChange}
            className="sort-select"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo._id} className="todo-item">
            <input
              type="text"
              value={todo.name}
              onChange={(event) => editTodo(todo._id, event.target.value)}
              className="todo-input"
            />
            <button onClick={() => deleteTodo(todo._id)} className="delete-button">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  </div>
  );
};

export default App;
