package com.sportshop.dto;

import com.sportshop.entity.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private Role role; // ROLE_USER або ROLE_ADMIN
}

