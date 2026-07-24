package com.fittrack.backend.service;

import com.fittrack.backend.dto.*;
import com.fittrack.backend.model.*;
import com.fittrack.backend.repository.*;
import com.fittrack.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create user
        User user = User.builder()
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(User.Role.MEMBER)
                .passwordChanged(true)
                .build();
        user = userRepository.save(user);

        // Create membership
        Membership.PlanType planType = Membership.PlanType.valueOf(
                req.getPlan() != null ? req.getPlan() : "MONTHLY"
        );
        LocalDate start = LocalDate.now();
        LocalDate end = switch (planType) {
            case MONTHLY   -> start.plusMonths(1);
            case QUARTERLY -> start.plusMonths(3);
            case ANNUAL    -> start.plusYears(1);
        };
        BigDecimal amount = switch (planType) {
            case MONTHLY   -> new BigDecimal("2500");
            case QUARTERLY -> new BigDecimal("6500");
            case ANNUAL    -> new BigDecimal("22000");
        };

        Membership membership = Membership.builder()
                .user(user)
                .planType(planType)
                .startDate(start)
                .endDate(end)
                .amountPaid(amount)
                .status(Membership.Status.ACTIVE)
                .build();
        membershipRepository.save(membership);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return buildAuthResponse(user, token);
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return buildAuthResponse(user, token);
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .userId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .passwordChanged(user.getPasswordChanged())
                .build();
    }
}
