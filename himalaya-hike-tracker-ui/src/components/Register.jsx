import { useState } from "react";

/*
  Register component allows new users to create an account.
  It collects the user's name, email, and password, sends the
  registration details to the backend, and switches to the login
  form when registration succeeds.
 */
function Register({ onSwitch }) {
  // Stores the name entered by the user.
  const [name, setName] = useState("");

  // Stores the email entered by the user.
  const [email, setEmail] = useState("");

  // Stores the password entered by the user.
  const [password, setPassword] = useState("");

  // Stores the registration result or an error message.
  const [message, setMessage] = useState("");

  // Submits the user's details to the backend registration endpoint.
  async function handleRegister(e) {
    // Prevent the browser from reloading the page on form submission.
    e.preventDefault();

    try {
      // Send the registration details to the Spring Boot backend.
      const response = await fetch(
        "http://localhost:8080/api/users/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );

      // Read and display the response returned by the backend.
      const result = await response.text();
      setMessage(result);

      // Switch to the login form when registration succeeds.
      if (response.ok) {
        onSwitch();
      }
    } catch {
      // Display an error if the frontend cannot reach the backend.
      setMessage("Unable to connect to the server.");
    }
  }

  // Render the registration form and the option to return to login.
  return (
    <div className="auth-form">
      <h2>Create Account</h2>

      {/* Collect the new user's details and submit them for registration. */}
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

      {/* Display registration feedback or connection errors. */}
      <p>{message}</p>

      {/* Allow existing users to switch to the login form. */}
      <p>
        Already registered?{" "}
        <button type="button" onClick={onSwitch}>
          Login
        </button>
      </p>
    </div>
  );
}

// Export Register so the parent component can render it.
export default Register;
