package com.dev.product_web.service;

import com.dev.product_web.dto.category.CategoryResponse;
import com.dev.product_web.dto.user.UserRequest;
import com.dev.product_web.dto.user.UserResponse;
import com.dev.product_web.entity.Category;
import com.dev.product_web.entity.User;

import java.util.List;

public interface UserService {
    User login(String username, String password);
    List<UserResponse> getAllUsersExceptCurrent(Integer currentUser_Id);
    User createUser (UserRequest request);
    UserResponse saveUser(UserRequest request);
    void deleteUser(Integer id);
    List<UserResponse> getAllUsers();
}
