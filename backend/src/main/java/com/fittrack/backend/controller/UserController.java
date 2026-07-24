package com.fittrack.backend.controller;

import com.fittrack.backend.dto.ChangePasswordRequest;
import com.fittrack.backend.dto.UpdateProfileRequest;
import com.fittrack.backend.model.User;
import com.fittrack.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // GET /api/user/profile
    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(user);
    }

    // PUT /api/user/profile
    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody UpdateProfileRequest req) {
        User existing = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (req.getFirstName() != null) existing.setFirstName(req.getFirstName());
        if (req.getLastName() != null) existing.setLastName(req.getLastName());
        if (req.getEmail() != null) existing.setEmail(req.getEmail());
        if (req.getPhone() != null) existing.setPhone(req.getPhone());
        if (req.getEmergencyContact() != null) existing.setEmergencyContact(req.getEmergencyContact());
        if (req.getEmailNotifs() != null) existing.setEmailNotifs(req.getEmailNotifs());
        if (req.getSmsNotifs() != null) existing.setSmsNotifs(req.getSmsNotifs());

        return ResponseEntity.ok(userRepository.save(existing));
    }

    // POST /api/user/change-password
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal User user,
            @RequestBody ChangePasswordRequest req) {
        User existing = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(req.getCurrentPassword(), existing.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Current password does not match"));
        }

        existing.setPassword(passwordEncoder.encode(req.getNewPassword()));
        existing.setPasswordChanged(true);
        userRepository.save(existing);

        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
}
