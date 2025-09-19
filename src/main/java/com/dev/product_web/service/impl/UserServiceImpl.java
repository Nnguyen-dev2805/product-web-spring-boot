package com.dev.product_web.service.impl;

import com.dev.product_web.dto.category.CategoryResponse;
import com.dev.product_web.dto.product.ProductResponse;
import com.dev.product_web.dto.role.RoleResponse;
import com.dev.product_web.dto.user.UserRequest;
import com.dev.product_web.dto.user.UserResponse;
import com.dev.product_web.entity.Role;
import com.dev.product_web.entity.User;
import com.dev.product_web.repository.RoleRepository;
import com.dev.product_web.repository.UserRepository;
import com.dev.product_web.service.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ModelMapper modelMapper;

    @Override
    public User login(String username, String password) {
        return userRepository.findByUsernameAndPassword(username,password);
    }

    @Override
    public List<UserResponse> getAllUsersExceptCurrent(Integer currentUser_Id) {
        return userRepository.findAllExceptCurrentUser(currentUser_Id);
    }

    @Override
    public User createUser(UserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Tên đăng nhập đã tồn tại");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email đã tồn tại");
        }
        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new IllegalArgumentException("Vai trò không hợp lệ"));
        User user = new User();
        user.setUsername(request.getUsername());
        user.setFullname(request.getFullname());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(request.getPassword());
        user.setRole(role);
        return userRepository.save(user);
    }

    @Override
    public UserResponse saveUser(UserRequest request) {
        User user = userRepository.findByEmail(request.getEmail());
        if (user == null) {
            throw new NoSuchElementException("Người dùng không tồn tại");
        }
        user.setFullname(request.getFullname());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new IllegalArgumentException("Vai trò không hợp lệ"));
        user.setRole(role);
        User savedUser = userRepository.save(user);
        UserResponse dto = new UserResponse();
        dto.setId(savedUser.getId());
        dto.setFullname(savedUser.getFullname());
        dto.setEmail(savedUser.getEmail());
        dto.setPhone(savedUser.getPhone());
        dto.setRoleName(savedUser.getRole().getRoleName());
        return dto;
    }

    @Override
    public void deleteUser(Integer id) {
        if (!userRepository.existsById(id)) {
            throw new NoSuchElementException("Người dùng không tồn tại");
        }
        userRepository.deleteById(id);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(c -> modelMapper.map(c, UserResponse.class))
                .collect(Collectors.toList());
    }
}
