package com.cranberry.marketplace.service;

import com.cranberry.marketplace.model.User;
import com.cranberry.marketplace.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

@Service
public class GoogleAuthService {

    private final UserRepository userRepository;
    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${google.client-id:}")
    private String googleClientId;

    public GoogleAuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.webClient = WebClient.builder().build();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Verify Google ID token and return user data
     */
    public User authenticateGoogleUser(String credential) {
        try {
            // Decode the JWT token (Google ID token is a JWT)
            String[] parts = credential.split("\\.");
            if (parts.length != 3) {
                throw new RuntimeException("Invalid Google credential format");
            }

            // Decode payload (second part)
            String payload = new String(Base64.getUrlDecoder().decode(parts[1]));
            JsonNode claims = objectMapper.readTree(payload);

            // Verify the token is for our client
            String audience = claims.has("aud") ? claims.get("aud").asText() : "";
            if (!googleClientId.isEmpty() && !audience.equals(googleClientId)) {
                throw new RuntimeException("Invalid token audience");
            }

            // Check token expiration
            long exp = claims.has("exp") ? claims.get("exp").asLong() : 0;
            if (exp < System.currentTimeMillis() / 1000) {
                throw new RuntimeException("Token has expired");
            }

            // Extract user info from token
            String email = claims.has("email") ? claims.get("email").asText() : null;
            String name = claims.has("name") ? claims.get("name").asText() : null;
            String picture = claims.has("picture") ? claims.get("picture").asText() : null;
            String googleId = claims.has("sub") ? claims.get("sub").asText() : null;

            if (email == null || email.isEmpty()) {
                throw new RuntimeException("Email not found in Google token");
            }

            // Find or create user
            Optional<User> existingUser = userRepository.findByEmail(email);
            
            if (existingUser.isPresent()) {
                // User exists, update their info if needed
                User user = existingUser.get();
                if (name != null && !name.isEmpty()) {
                    user.setName(name);
                }
                if (picture != null) {
                    user.setAvatar(picture);
                }
                user.setGoogleId(googleId);
                return userRepository.save(user);
            } else {
                // Create new user
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setName(name != null ? name : email.split("@")[0]);
                newUser.setPassword(UUID.randomUUID().toString()); // Random password for OAuth users
                newUser.setRole("CUSTOMER");
                newUser.setGoogleId(googleId);
                if (picture != null) {
                    newUser.setAvatar(picture);
                }
                return userRepository.save(newUser);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to authenticate with Google: " + e.getMessage());
        }
    }
}
