package org.workspace.nas_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.workspace.nas_backend.model.User;
import org.workspace.nas_backend.repository.UserRepository;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/users")
    public ResponseEntity<String> addUser(@RequestBody User newUser) {
        // Check if username already exists
        if (userRepository.findByUsername(newUser.getUsername()) != null) {
            return new ResponseEntity<>("Username already exists!", HttpStatus.CONFLICT);
        }
        if (userRepository.findByEmail(newUser.getEmail()) != null) {
            return new ResponseEntity<>("Email already exists!", HttpStatus.CONFLICT);
        }
        // Encrypt the password
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));

        // Save the new user to the database
        userRepository.save(newUser);
        return new ResponseEntity<>("User created successfully!", HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        // Find the user by username
        User user = userRepository.findByUsername(loginRequest.getUsername());

        if (user != null && passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            // Create a DTO with only the required fields
            UserResponse userResponse = new UserResponse(user.getUsername(), user.getEmail());
            return ResponseEntity.ok(userResponse);
        }

        // Return unauthorized status for invalid credentials
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @DeleteMapping("/users/{username}")
    public ResponseEntity<String> deleteUser(@PathVariable String username) {
        // Find the user by username
        User user = userRepository.findByUsername(username);

        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        // Delete the user
        userRepository.delete(user);
        return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
    }
}
