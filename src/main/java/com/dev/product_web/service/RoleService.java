package com.dev.product_web.service;

import com.dev.product_web.dto.role.RoleResponse;

import java.util.List;

public interface RoleService {
    List<RoleResponse> getAllRoles();
}
