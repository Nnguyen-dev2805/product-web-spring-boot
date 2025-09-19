package com.dev.product_web.service.impl;

import com.dev.product_web.dto.role.RoleResponse;
import com.dev.product_web.entity.Role;
import com.dev.product_web.repository.RoleRepository;
import com.dev.product_web.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    public List<RoleResponse> getAllRoles() {
        List<Role> roles =  roleRepository.findAll();
        return roles.stream()
                .map(role -> {
                    RoleResponse dto = new RoleResponse();
                    dto.setId(role.getId());
                    dto.setRoleName(role.getRoleName());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
