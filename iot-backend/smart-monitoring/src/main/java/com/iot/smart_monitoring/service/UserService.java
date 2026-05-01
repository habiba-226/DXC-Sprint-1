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

        if (!user.getEmail().contains("@") || !user.getEmail().contains(".")) {
            return ResponseEntity.badRequest().body("Invalid email format");
        }

        if (user.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body("Password must be at least 6 characters");
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
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


    public User getProfile(String email) {

        var user = userRepository.findByEmail(email);

        if (user.isEmpty()) {
            return null;
        }

        return user.get();
    }


    public String updateProfile(User updatedUser) {

        if (updatedUser.getEmail() == null || updatedUser.getEmail().isEmpty()) {
            return "Email is required";
        }

        var existingUser = userRepository.findByEmail(updatedUser.getEmail());

        if (existingUser.isEmpty()) {
            return "User not found";
        }

        User user = existingUser.get();

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        if (updatedUser.getProfilePicture() != null) {
            user.setProfilePicture(updatedUser.getProfilePicture());
        }

        if (updatedUser.getFirstName() != null && !updatedUser.getFirstName().isEmpty()) {
            user.setFirstName(updatedUser.getFirstName());
        }

        if (updatedUser.getLastName() != null && !updatedUser.getLastName().isEmpty()) {
            user.setLastName(updatedUser.getLastName());
        }

        userRepository.save(user);

        return "Profile updated successfully";
    }
}
