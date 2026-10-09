import { useState } from "react";

function Register({ onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8080/api/users/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password })
        }
      );

      const result = await response.text();
      setMessage(result);

      if (response.ok) {
        onSwitch();
      }
    } catch {
      setMessage("Unable to connect to the server.");
    }
  }

  return (
    <div className="auth-form">
      <h2>Create Account</h2>

      <form onSubmit={handleRegister}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>
      </form>

      <p>{message}</p>
      <p>
        Already registered?{" "}
        <button type="button" onClick={onSwitch}>
          Login
        </button>
      </p>
    </div>
  );
}

export default Register;