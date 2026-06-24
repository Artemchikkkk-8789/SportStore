package com.sportshop.service;

import com.sportshop.dto.UserDto;
import com.sportshop.entity.Role;
import com.sportshop.entity.User;
import com.sportshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserManagementService {

    private static final String ROOT_ADMIN_USERNAME = "admin";

    private final UserRepository userRepository;

    public List<UserDto> findAll() {
        return userRepository.findAll().stream()
                .sorted(Comparator.comparing(User::getUsername, String.CASE_INSENSITIVE_ORDER))
                .map(this::toDto)
                .toList();
    }

    public UserDto updateRole(Long id, Role role, String actorUsername) {
        if (!ROOT_ADMIN_USERNAME.equals(actorUsername)) {
            throw new AccessDeniedException("Only root admin can change user roles");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        if (ROOT_ADMIN_USERNAME.equals(user.getUsername()) && role != Role.ROLE_ADMIN) {
            throw new AccessDeniedException("Root admin role cannot be removed");
        }

        user.setRole(role);
        return toDto(userRepository.save(user));
    }

    private UserDto toDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setProvider(user.getProvider() != null ? user.getProvider().name() : null);
        dto.setRole(user.getRole().name());
        return dto;
    }
}
