package com.dev.product_web.dto.user;

import lombok.Data;

@Data
public class UserRequest {
    private String username;
    private String fullname;
    private String email;
    private String phone;
    private String password;
    private Integer roleId;
}
