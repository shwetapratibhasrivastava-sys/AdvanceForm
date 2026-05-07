import React, { useState, useEffect } from "react";

import axios from "axios";

const App = () => {

  // FORM STATE
  const [form, setForm] = useState({
    name: "",
    email: ""
  });

  // USERS STATE
  const [users, setUsers] = useState([]);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // FETCH USERS
  const fetchUsers = async () => {

    const res = await axios.get(
      "http://localhost:5000/users"
    );

    setUsers(res.data);
  };

  // RUN WHEN PAGE LOADS
  useEffect(() => {

    fetchUsers();

  }, []);

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    await axios.post(
      "http://localhost:5000/register",
      form
    );

    // Fetch updated users
    fetchUsers();

    // Clear form
    setForm({
      name: "",
      email: ""
    });
  };

  return (

    <div>

      <h1>User Form</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={form.name}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={form.email}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">
          Submit
        </button>

      </form>

      <hr />

      <h2>Users Data</h2>

      {
        users.map((user, index) => (

          <div key={index}>

            <p>Name: {user.name}</p>

            <p>Email: {user.email}</p>

            <hr />

          </div>
        ))
      }

    </div>
  );
};

export default App;