package com.dev.product_web.service;

import com.dev.product_web.entity.User;

public interface UserService {
    User login(String username, String password);
}
