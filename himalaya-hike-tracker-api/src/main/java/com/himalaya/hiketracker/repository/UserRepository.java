/*
  Repository interface for performing database operations on users.
  JpaRepository provides built-in CRUD operations for the User entity.
 */
package com.himalaya.hiketracker.repository;

import com.himalaya.hiketracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Finds a user by email and returns an Optional if the user exists.
    Optional<User> findByEmail(String email);

    // Checks whether a user with the given email already exists.
    boolean existsByEmail(String email);
}
