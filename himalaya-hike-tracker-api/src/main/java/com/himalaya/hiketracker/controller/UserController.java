package com.himalaya.hiketracker.controller;

import com.himalaya.hiketracker.entity.User;
import com.himalaya.hiketracker.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        userService.register(user);
        return "Registration successful";
    }

    @PostMapping("/login")
    public String login(@RequestBody Map<String, String> request) {
        boolean success = userService.login(
                request.get("email"),
                request.get("password")
        );

        return success ? "Login successful" : "Invalid credentials";
    }
}