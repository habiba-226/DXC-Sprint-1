package com.iot.smart_monitoring.service;

import com.iot.smart_monitoring.model.User;
import com.iot.smart_monitoring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public ResponseEntity<String> signup(User user) {

        if (user.getEmail() == null || user.getEmail().isEmpty() ||
                user.getPassword() == null || user.getPassword().isEmpty() ||
                user.getFirstName() == null || user.getFirstName().isEmpty() ||
                user.getLastName() == null || user.getLastName().isEmpty()) {

            return ResponseEntity.badRequest().body("All fields are required");
        }

        if (!user.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            return ResponseEntity.badRequest().body("Invalid email format");
        }

        if (user.getEmail().length() > 255) {
            return ResponseEntity.badRequest().body("Email too long");
        }

        if (user.getPassword().length() < 8) {
            return ResponseEntity.badRequest().body("Password must be at least 8 characters");
        }

        if (!user.getPassword().matches("^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=]).*$")) {
            return ResponseEntity.badRequest().body("Password must contain uppercase, number, and special character");
        }

        if (user.getConfirmPassword() == null || !user.getPassword().equals(user.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Passwords do not match");
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
        }

        if (user.getProfilePicture() == null || user.getProfilePicture().isEmpty()) {
            return ResponseEntity.badRequest().body("Profile picture is required");
        }

        String pic = user.getProfilePicture().toLowerCase();

        if (!(pic.startsWith("data:image/jpeg") || pic.startsWith("data:image/png")
                || pic.startsWith("data:image/jpg"))) {

            return ResponseEntity.badRequest().body("Profile picture must be .jpg, .jpeg, or .png");

        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    public ResponseEntity<String> login(User user) {

        if (user.getEmail() == null || user.getEmail().isEmpty() ||
                user.getPassword() == null || user.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("Email and password are required");
        }

        var existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid credentials");
        }

        if (!passwordEncoder.matches(user.getPassword(), existingUser.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        return ResponseEntity.ok("Login successful");
    }

    public ResponseEntity<?> getProfile(String email) {

        var user = userRepository.findByEmail(email);

        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        }

        User userData = user.get();
        userData.setPassword(null);

        return ResponseEntity.ok(userData);
    }

    public ResponseEntity<String> updateProfile(User updatedUser) {

        if (updatedUser.getEmail() == null || updatedUser.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        var existingUser = userRepository.findByEmail(updatedUser.getEmail());

        if (existingUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = existingUser.get();

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {

            // 1. CHECK THE OLD PASSWORD FIRST!
            if (updatedUser.getConfirmPassword() == null
                    || !passwordEncoder.matches(updatedUser.getConfirmPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Current password is incorrect");
            }

            // 2. Validate the new password
            if (updatedUser.getPassword().length() < 8) {
                return ResponseEntity.badRequest().body("Password must be at least 8 characters");
            }

            if (updatedUser.getPassword().length() < 8) {
                return ResponseEntity.badRequest().body("Password must be at least 8 characters");
            }

            if (!updatedUser.getPassword().matches("^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=]).*$")) {
                return ResponseEntity.badRequest()
                        .body("Password must contain uppercase, number, and special character");
            }

            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        if (updatedUser.getProfilePicture() != null && !updatedUser.getProfilePicture().isEmpty()) {

            String pic = updatedUser.getProfilePicture().toLowerCase();

            if (!(pic.startsWith("data:image/jpeg") || pic.startsWith("data:image/png")
                    || pic.startsWith("data:image/jpg"))) {

                return ResponseEntity.badRequest().body("Profile picture must be .jpg, .jpeg, or .png");

            }

            user.setProfilePicture(updatedUser.getProfilePicture());
        }

        if (updatedUser.getFirstName() != null && !updatedUser.getFirstName().isEmpty()) {
            user.setFirstName(updatedUser.getFirstName());
        }

        if (updatedUser.getLastName() != null && !updatedUser.getLastName().isEmpty()) {
            user.setLastName(updatedUser.getLastName());
        }

        userRepository.save(user);

        return ResponseEntity.ok("Profile updated successfully");
    }
}
