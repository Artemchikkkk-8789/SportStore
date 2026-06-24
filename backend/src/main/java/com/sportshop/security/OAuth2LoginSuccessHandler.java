package com.sportshop.security;

import com.sportshop.entity.Role;
import com.sportshop.entity.User;
import com.sportshop.entity.UserProvider;
import com.sportshop.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Value("${app.frontend-url:https://sport-store-gules.vercel.app}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        if (email == null || email.isBlank()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Google account email is required");
            return;
        }

        User user = userRepository.findByEmail(email)
                .or(() -> userRepository.findByUsername(email))
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setUsername(email);
                    newUser.setEmail(email);
                    newUser.setPassword("GOOGLE_AUTH");
                    newUser.setRole(Role.ROLE_USER);
                    newUser.setProvider(UserProvider.GOOGLE);
                    return newUser;
                });

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            user.setEmail(email);
        }
        if (user.getProvider() == null) {
            user.setProvider(UserProvider.GOOGLE);
        }
        if (user.getUsername() == null || user.getUsername().isBlank()) {
            user.setUsername(name != null && !name.isBlank() ? name : email);
        }

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser);
        String encodedToken = URLEncoder.encode(token, StandardCharsets.UTF_8);
        response.sendRedirect(frontendUrl + "/oauth2/success?token=" + encodedToken);
    }
}
