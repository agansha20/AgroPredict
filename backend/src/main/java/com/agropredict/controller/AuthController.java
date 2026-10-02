
package com.agropredict.controller;

import com.agropredict.model.User;
import com.agropredict.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ==============================
    // SIGNUP
    // ==============================
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {

        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email is required"));
        }

        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Password is required"));
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email already exists"));
        }

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Signup successful",
                        "user", savedUser
                )
        );
    }

    // ==============================
    // LOGIN
    // ==============================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {

        if (loginUser.getEmail() == null ||
                loginUser.getEmail().trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email is required"));
        }

        if (loginUser.getPassword() == null ||
                loginUser.getPassword().trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Password is required"));
        }

        return userRepository
                .findByEmail(loginUser.getEmail().trim())
                .map(user -> {

                    if (user.getPassword() != null &&
                            user.getPassword().equals(loginUser.getPassword())) {

                        return ResponseEntity.ok(
                                Map.of(
                                        "message", "Login successful",
                                        "user", user
                                )
                        );
                    }

                    return ResponseEntity
                            .badRequest()
                            .body(Map.of(
                                    "message",
                                    "Invalid password"
                            ));
                })
                .orElseGet(() ->
                        ResponseEntity
                                .badRequest()
                                .body(Map.of(
                                        "message",
                                        "User not found"
                                ))
                );
    }
        // ==============================
    // UPDATE PROFILE
    // ==============================
    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long id,
            @RequestBody User updatedUser) {

        return userRepository.findById(id)
                .map(user -> {

                    if (updatedUser.getName() != null &&
                            !updatedUser.getName().trim().isEmpty()) {
                        user.setName(updatedUser.getName().trim());
                    }

                    if (updatedUser.getPhone() != null) {
                        user.setPhone(updatedUser.getPhone().trim());
                    }

                    if (updatedUser.getEmail() != null &&
                            !updatedUser.getEmail().trim().isEmpty()) {
                        user.setEmail(updatedUser.getEmail().trim());
                    }

                    User savedUser = userRepository.save(user);

                    return ResponseEntity.ok(
                            Map.of(
                                    "message", "Profile updated successfully",
                                    "user", savedUser
                            )
                    );
                })
                .orElseGet(() ->
                        ResponseEntity
                                .badRequest()
                                .body(Map.of(
                                        "message",
                                        "User not found"
                                ))
                );
    }
}
