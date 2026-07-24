package com.fittrack.backend.controller;

import com.fittrack.backend.dto.AddTrainerRequest;
import com.fittrack.backend.model.*;
import com.fittrack.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final TrainerRepository trainerRepository;
    private final MembershipRepository membershipRepository;
    private final PasswordEncoder passwordEncoder;

    // GET /api/admin/members
    @GetMapping("/members")
    public ResponseEntity<List<User>> getAllMembers() {
        return ResponseEntity.ok(userRepository.findByRole(User.Role.MEMBER));
    }

    // POST /api/admin/members
    @PostMapping("/members")
    public ResponseEntity<User> addMember(@RequestBody User user) {
        user.setRole(User.Role.MEMBER);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return ResponseEntity.ok(userRepository.save(user));
    }

    // PUT /api/admin/members/{id}
    @PutMapping("/members/{id}")
    public ResponseEntity<User> updateMember(@PathVariable Long id, @RequestBody User updates) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        user.setFirstName(updates.getFirstName());
        user.setLastName(updates.getLastName());
        user.setPhone(updates.getPhone());
        return ResponseEntity.ok(userRepository.save(user));
    }

    // DELETE /api/admin/members/{id}
    @DeleteMapping("/members/{id}")
    public ResponseEntity<?> deleteMember(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Member deleted"));
    }

    // GET /api/admin/trainers
    @GetMapping("/trainers")
    public ResponseEntity<List<Trainer>> getAllTrainers() {
        return ResponseEntity.ok(trainerRepository.findAll());
    }

    // POST /api/admin/trainers
    @PostMapping("/trainers")
    public ResponseEntity<Trainer> addTrainer(@RequestBody AddTrainerRequest req) {
        User user = User.builder()
                .firstName(req.getFirstName()).lastName(req.getLastName())
                .email(req.getEmail()).phone(req.getPhone())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(User.Role.TRAINER).passwordChanged(false).build();
        user = userRepository.save(user);

        Trainer trainer = Trainer.builder()
                .user(user).specialization(req.getSpecialization())
                .memberCount(0).joinedDate(LocalDate.now()).build();
        return ResponseEntity.ok(trainerRepository.save(trainer));
    }

    // PUT /api/admin/trainers/{id}
    @PutMapping("/trainers/{id}")
    public ResponseEntity<Trainer> updateTrainer(@PathVariable Long id, @RequestBody AddTrainerRequest req) {
        Trainer trainer = trainerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
        trainer.setSpecialization(req.getSpecialization());
        trainer.getUser().setFirstName(req.getFirstName());
        trainer.getUser().setLastName(req.getLastName());
        userRepository.save(trainer.getUser());
        return ResponseEntity.ok(trainerRepository.save(trainer));
    }

    // DELETE /api/admin/trainers/{id}
    @DeleteMapping("/trainers/{id}")
    public ResponseEntity<?> removeTrainer(@PathVariable Long id) {
        trainerRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Trainer removed"));
    }

    // GET /api/admin/stats
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        List<User> members  = userRepository.findByRole(User.Role.MEMBER);
        List<Trainer> trainers = trainerRepository.findAll();
        List<Membership> active   = membershipRepository.findByStatus(Membership.Status.ACTIVE);
        List<Membership> expiring = membershipRepository.findByStatus(Membership.Status.EXPIRING);
        List<Membership> expired  = membershipRepository.findByStatus(Membership.Status.EXPIRED);

        double revenue = membershipRepository.findAll().stream()
                .filter(m -> m.getStatus() == Membership.Status.ACTIVE || m.getStatus() == Membership.Status.EXPIRING)
                .mapToDouble(m -> m.getAmountPaid().doubleValue()).sum();

        return ResponseEntity.ok(Map.of(
                "totalMembers",       members.size(),
                "activeTrainers",     trainers.size(),
                "activeMemberships",  active.size(),
                "expiringSoon",       expiring.size(),
                "expiredMemberships", expired.size(),
                "monthlyRevenue",     revenue
        ));
    }

    // GET /api/admin/payments
    @GetMapping("/payments")
    public ResponseEntity<List<Membership>> getAllPayments() {
        return ResponseEntity.ok(membershipRepository.findAll());
    }

    // POST /api/admin/payments
    @PostMapping("/payments")
    public ResponseEntity<Membership> recordOfflinePayment(@RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String planTypeStr = body.getOrDefault("planType", "MONTHLY").toString().toUpperCase();
        Membership.PlanType planType = Membership.PlanType.valueOf(
                planTypeStr.contains("ANNUAL") ? "ANNUAL" :
                planTypeStr.contains("QUARTER") ? "QUARTERLY" : "MONTHLY"
        );

        LocalDate start = LocalDate.now();
        LocalDate end = switch (planType) {
            case MONTHLY   -> start.plusMonths(1);
            case QUARTERLY -> start.plusMonths(3);
            case ANNUAL    -> start.plusYears(1);
        };
        BigDecimal amount = body.get("amount") != null ?
                new BigDecimal(body.get("amount").toString()) :
                switch (planType) {
                    case MONTHLY   -> new BigDecimal("2500");
                    case QUARTERLY -> new BigDecimal("6500");
                    case ANNUAL    -> new BigDecimal("22000");
                };

        Membership m = Membership.builder()
                .user(user)
                .planType(planType)
                .startDate(start)
                .endDate(end)
                .amountPaid(amount)
                .status(Membership.Status.ACTIVE)
                .build();

        return ResponseEntity.ok(membershipRepository.save(m));
    }

    // GET /api/admin/reports/new-members-per-month
    @GetMapping("/reports/new-members-per-month")
    public ResponseEntity<List<Map<String, Object>>> getNewMembersPerMonth() {
        List<User> members = userRepository.findByRole(User.Role.MEMBER);
        Map<String, Long> monthCounts = new LinkedHashMap<>();

        LocalDate now = LocalDate.now();
        for (int i = 4; i >= 0; i--) {
            String monthName = now.minusMonths(i).getMonth().name().substring(0, 3);
            monthCounts.put(monthName, 0L);
        }

        for (User u : members) {
            if (u.getJoinedDate() != null) {
                String monthName = u.getJoinedDate().getMonth().name().substring(0, 3);
                monthCounts.put(monthName, monthCounts.getOrDefault(monthName, 0L) + 1);
            } else {
                String currentMonth = now.getMonth().name().substring(0, 3);
                monthCounts.put(currentMonth, monthCounts.getOrDefault(currentMonth, 0L) + 1);
            }
        }

        List<Map<String, Object>> result = monthCounts.entrySet().stream()
                .map(e -> Map.<String, Object>of("label", e.getKey(), "value", e.getValue()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    // GET /api/admin/reports/revenue-growth
    @GetMapping("/reports/revenue-growth")
    public ResponseEntity<List<Map<String, Object>>> getRevenueGrowth() {
        List<Membership> memberships = membershipRepository.findAll();
        Map<String, Double> monthRevenue = new LinkedHashMap<>();

        LocalDate now = LocalDate.now();
        for (int i = 5; i >= 0; i--) {
            String monthName = now.minusMonths(i).getMonth().name().substring(0, 3);
            monthRevenue.put(monthName, 0.0);
        }

        for (Membership m : memberships) {
            if (m.getStartDate() != null && m.getAmountPaid() != null) {
                String monthName = m.getStartDate().getMonth().name().substring(0, 3);
                monthRevenue.put(monthName, monthRevenue.getOrDefault(monthName, 0.0) + m.getAmountPaid().doubleValue());
            }
        }

        List<Map<String, Object>> result = monthRevenue.entrySet().stream()
                .map(e -> Map.<String, Object>of("label", e.getKey(), "val", e.getValue()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
