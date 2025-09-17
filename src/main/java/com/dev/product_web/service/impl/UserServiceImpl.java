package com.dev.product_web.service.impl;

import com.dev.product_web.entity.User;
import com.dev.product_web.repository.UserRepository;
import com.dev.product_web.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public User login(String username, String password) {
        return userRepository.findByUsernameAndPassword(username,password);
    }
}
