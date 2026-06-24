package com.sportshop.service;

import com.sportshop.dto.AuthRequest;
import com.sportshop.dto.AuthResponse;
import com.sportshop.dto.RegisterRequest;
import com.sportshop.entity.Role;
import com.sportshop.entity.User;
import com.sportshop.entity.UserProvider;
import com.sportshop.repository.UserRepository;
import com.sportshop.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow();

        String token = jwtService.generateToken(user);

        return new AuthResponse(token);
    }

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("User already exists");
        }
        if (request.getEmail() != null && !request.getEmail().isBlank()
                && userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail() != null && !request.getEmail().isBlank()
                ? request.getEmail().trim()
                : request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setProvider(UserProvider.LOCAL);

        // якщо роль не передана — робимо по замовчуванню USER
        Role role = request.getRole() != null ? request.getRole() : Role.ROLE_USER;
        user.setRole(role);

        userRepository.save(user);

        String token = jwtService.generateToken(user);

        return new AuthResponse(token);
    }
}
