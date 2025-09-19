package com.dev.product_web.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    Integer id;
    String username;
    String fullname;
    String email;
    String phone;
    String roleName;
}
