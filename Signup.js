import React, { useState } from "react";
import axios from "axios";

function Signup() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     
      const res = await axios.post("http://localhost:5000/signup", formData);

      console.log("Signup Response:", res.data);

      if (res.data.success) {
        alert("Signup successful!");
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
        }); 
      } else {
        alert("Signup failed: " + (res.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      const msg = error.response?.data?.message || "Server Error";
      alert("Signup failed: " + msg);
    }
  };

  return (
    <div style={{ width: "350px", margin: "50px auto" }}>
      <h2>Signup</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={formData.first_name}
          onChange={(e) =>
            setFormData({ ...formData, first_name: e.target.value })
          }
          required
        />
        <br /><br />

        <input
          type="text"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={(e) =>
            setFormData({ ...formData, last_name: e.target.value })
          }
          required
        />
        <br /><br />

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
        <br /><br />

        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
