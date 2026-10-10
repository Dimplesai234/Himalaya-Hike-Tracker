package com.himalaya.hiketracker.service;

import com.himalaya.hiketracker.entity.User;
import com.himalaya.hiketracker.repository.UserRepository;
import org.springframework.stereotype.Service;

/*
  Service implementation containing the business logic for user registration and login.
  It uses UserRepository to interact with the database.
 */
@Service
public class UserServiceImpl implements UserService {

    // Repository used to perform database operations on users.
    private final UserRepository userRepository;

    // Constructor injection provides the repository dependency.
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User register(User user) {

        // Check whether the email is already registered.
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException(
                    "Email is already registered.");
        }

        // Save the new user to the database and return the saved record.
        return userRepository.save(user);
    }

    @Override
    public boolean login(String email, String password) {

        // Find the user by email, compare the provided password with
        // the stored password, and return false if the user is not found.
        return userRepository.findByEmail(email)
                .map(user -> user.getPassword().equals(password))
                .orElse(false);
    }
}
