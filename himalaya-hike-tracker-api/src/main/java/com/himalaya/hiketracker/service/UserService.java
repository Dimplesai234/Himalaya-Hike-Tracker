
package com.himalaya.hiketracker.service;

import com.himalaya.hiketracker.entity.User;

public interface UserService {

    User register(User user);

    boolean login(String email, String password);
}
