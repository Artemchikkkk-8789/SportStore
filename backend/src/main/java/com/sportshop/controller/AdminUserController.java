package com.sportshop.controller;

import com.sportshop.dto.UserDto;
import com.sportshop.entity.Role;
import com.sportshop.service.UserManagementService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserManagementService userManagementService;

    @GetMapping
    public List<UserDto> getUsers() {
        return userManagementService.findAll();
    }

    @PutMapping("/{id}/role")
    public UserDto updateRole(@PathVariable Long id, @RequestBody UpdateRoleRequest request, Principal principal) {
        return userManagementService.updateRole(id, request.getRole(), principal.getName());
    }

    @Data
    public static class UpdateRoleRequest {
        private Role role;
    }
}
