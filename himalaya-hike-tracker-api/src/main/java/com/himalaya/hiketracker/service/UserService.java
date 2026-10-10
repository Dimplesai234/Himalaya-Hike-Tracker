/*
  Service interface defining the business operations for user registration and login.
  The implementation of these methods is provided by UserServiceImpl.
 */
package com.himalaya.hiketracker.service;

import com.himalaya.hiketracker.entity.User;

public interface UserService {

    // Registers a new user and returns the saved user details.
    User register(User user);

    // Checks whether the provided email and password match a registered user.
    boolean login(String email, String password);
}
