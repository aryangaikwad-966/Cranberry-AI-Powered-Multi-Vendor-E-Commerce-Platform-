package com.cranberry.marketplace.service;

import com.cranberry.marketplace.dto.UserResponse;
import com.cranberry.marketplace.exception.ResourceNotFoundException;
import com.cranberry.marketplace.model.User;
import com.cranberry.marketplace.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public UserResponse getUserProfile(Long userId) {
        User user = getUserById(userId);
        return toUserResponse(user);
    }

    public UserResponse updateUserProfile(Long userId, String name, String email) {
        User user = getUserById(userId);

        if (name != null && !name.isBlank()) {
            user.setName(name);
        }
        if (email != null && !email.isBlank()) {
            user.setEmail(email);
        }

        User updatedUser = userRepository.save(user);
        return toUserResponse(updatedUser);
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
