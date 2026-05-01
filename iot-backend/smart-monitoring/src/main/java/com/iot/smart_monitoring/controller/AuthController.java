package com.iot.smart_monitoring.controller;

import com.iot.smart_monitoring.model.User;
import com.iot.smart_monitoring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody User user) {
        return userService.signup(user);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
        return userService.login(user);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestParam String email) {
        return userService.getProfile(email);
    }

    @PutMapping("/profile")
    public ResponseEntity<String> updateProfile(@RequestBody User updatedUser) {
        return userService.updateProfile(updatedUser);
    }
}