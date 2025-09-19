package com.dev.product_web.controller.admin.user;

import com.dev.product_web.dto.role.RoleResponse;
import com.dev.product_web.dto.user.UserRequest;
import com.dev.product_web.dto.user.UserResponse;
import com.dev.product_web.entity.User;
import com.dev.product_web.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/list")
    public ResponseEntity<List<UserResponse>> getAllUsersExceptCurrent(HttpSession session) {
        User currentUser  = (User)session.getAttribute("user");
        if (currentUser  == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Integer currentUser_Id = currentUser.getId();
        List<UserResponse> users = userService.getAllUsersExceptCurrent(currentUser_Id);
        return ResponseEntity.ok(users);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addUser (@RequestBody @Valid UserRequest request) {
        try {
            User user = userService.createUser(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    // Cập nhật người dùng
    @PostMapping("/update")
    public ResponseEntity<?> updateUser (@RequestBody @Valid UserRequest request) {
        try {
            UserResponse updatedUser  = userService.saveUser(request);
            return ResponseEntity.ok(updatedUser );
        } catch (NoSuchElementException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", ex.getMessage()));
        }
    }
    // Xóa người dùng
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser (@PathVariable Integer id) {
        try {
            userService.deleteUser (id);
            return ResponseEntity.ok(Map.of("message", "Xóa người dùng thành công"));
        } catch (NoSuchElementException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", ex.getMessage()));
        }
    }
}
