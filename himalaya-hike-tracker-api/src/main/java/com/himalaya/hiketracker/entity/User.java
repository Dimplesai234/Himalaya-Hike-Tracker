/*
  Entity class representing a registered user.
  Each User object is mapped to a record in the app_users table.
 */
package com.himalaya.hiketracker.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "app_users")
public class User {

    // Unique identifier generated automatically by the database.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User's name; the database does not allow a null value.
    @Column(nullable = false)
    private String name;

    // User's email; it must not be null and must be unique.
    @Column(nullable = false, unique = true)
    private String email;

    // User's password used by the current login implementation.
    // this project currently stores passwords as plain text.
    @Column(nullable = false)
    private String password;

    /*
      Default constructor required by JPA to create User objects.
     */
    public User() {
    }

    //Getter and Setter Methods for retrieving and updating the fields
    // Returns the user's unique ID.
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}
