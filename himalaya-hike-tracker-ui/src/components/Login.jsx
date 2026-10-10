import { useState } from "react";

/*
  Login component provides the login form for existing users.
  It sends the user's credentials to the backend for verification,
  displays the login result, and notifies the parent component
  when authentication succeeds.
 */
function Login({ onSwitch, onLoginSuccess }) {
  // Stores the email entered by the user.
  const [email, setEmail] = useState("");

  // Stores the password entered by the user.
  const [password, setPassword] = useState("");

  // Stores the login result or an error message for display.
  const [message, setMessage] = useState("");

  // Submits the login credentials to the backend for verification.
  async function handleLogin(e) {
    // Prevent the browser from reloading the page when the form is submitted.
    e.preventDefault();
    setMessage("");

    try {
      // Send the email and password to the backend login endpoint.
      const response = await fetch(
        "http://localhost:8080/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      // Read the login result returned by the backend.
      const result = await response.text();
      setMessage(result);

      // Notify the parent component when login is successful.
      if (response.ok && result === "Login successful") {
        onLoginSuccess();
      }
    } catch (error) {
      // Display an error if the frontend cannot reach the backend.
      setMessage("Unable to connect to the server.");
    }
  }

  // Render the login form and the option to navigate to registration.
  return (
    <div className="auth-form">
      <h2>Login</h2>

      {/* Collect the user's credentials and submit them for verification. */}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      {/* Display the login result or connection error. */}
      {message && <p>{message}</p>}

      {/* Allow users without an account to switch to the registration form. */}
      <p>
        Don't have an account?{" "}
        <button type="button" onClick={onSwitch}>
          Register
        </button>
      </p>
    </div>
  );
}

// Export Login so the parent component can render it.
export default Login;
