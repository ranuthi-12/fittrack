package com.fittrack.backend.controller;

import com.fittrack.backend.model.User;
import com.fittrack.backend.repository.ProgressLogRepository;
import com.fittrack.backend.repository.TrainerRepository;
import com.fittrack.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final UserRepository userRepository;
    private final TrainerRepository trainerRepository;
    private final ProgressLogRepository progressLogRepository;

    @GetMapping("/landing-stats")
    public ResponseEntity<Map<String, Object>> getLandingStats() {
        long totalMembers = userRepository.countByRole(User.Role.MEMBER);
        long activeTrainers = trainerRepository.count();
        long totalWorkouts = progressLogRepository.count();

        return ResponseEntity.ok(Map.of(
                "totalMembers", totalMembers > 0 ? totalMembers : 200,
                "activeTrainers", activeTrainers > 0 ? activeTrainers : 6,
                "totalWorkouts", totalWorkouts > 0 ? totalWorkouts : 1500,
                "satisfactionRate", "99%"
        ));
    }
}
