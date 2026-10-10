/*
  REST controller for handling user registration and login requests.
  It receives HTTP requests and delegates the operations to UserService.
 */
package com.himalaya.hiketracker.controller;

import com.himalaya.hiketracker.entity.User;
import com.himalaya.hiketracker.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    // Service used to perform user registration and login operations.
    private final UserService userService;

    // Constructor injection provides the service dependency.
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Registers a new user and returns a success message.
    @PostMapping("/register")
    public String register(@RequestBody User user) {

        // Pass the user details to the service for registration.
        userService.register(user);

        return "Registration successful";
    }

    // Checks the supplied email and password against the stored user details.
    @PostMapping("/login")
    public String login(@RequestBody Map<String, String> request) {

        // Extract the email and password from the incoming JSON request.
        boolean success = userService.login(
                request.get("email"),
                request.get("password")
        );

        // Return the appropriate message based on the login result.
        return success ? "Login successful" : "Invalid credentials";
    }
}
