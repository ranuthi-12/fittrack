package com.fittrack.backend.controller;

import com.fittrack.backend.dto.ProgressLogRequest;
import com.fittrack.backend.model.*;
import com.fittrack.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressLogRepository progressLogRepository;
    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;

    // POST /api/progress/log
    @PostMapping("/log")
    public ResponseEntity<?> logProgress(
            @AuthenticationPrincipal User user,
            @RequestBody ProgressLogRequest req) {
        Exercise exercise = exerciseRepository.findById(req.getExerciseId())
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        ProgressLog log = ProgressLog.builder()
                .member(user).exercise(exercise)
                .weightKg(req.getWeightKg()).repsDone(req.getRepsDone())
                .loggedDate(req.getLoggedDate() != null ? req.getLoggedDate() : LocalDate.now())
                .build();
        progressLogRepository.save(log);
        return ResponseEntity.ok(Map.of("message", "Workout logged successfully"));
    }

    // GET /api/progress/stats
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(@AuthenticationPrincipal User user) {
        LocalDate startOfMonth = YearMonth.now().atDay(1);
        long workoutsThisMonth = progressLogRepository.countDistinctWorkoutDays(user, startOfMonth);
        long totalWorkouts = progressLogRepository.countDistinctWorkoutDays(user, LocalDate.of(2000, 1, 1));

        long planned = 12; // placeholder
        long completionRate = planned > 0 ? (workoutsThisMonth * 100 / planned) : 0;

        return ResponseEntity.ok(Map.of(
                "workoutsThisMonth", workoutsThisMonth,
                "completionRate", Math.min(100, completionRate),
                "totalWorkouts", totalWorkouts
        ));
    }

    // GET /api/progress/my
    @GetMapping("/my")
    public ResponseEntity<List<ProgressLog>> getMyProgress(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(progressLogRepository.findByMember(user));
    }

    // GET /api/progress/member/{memberId}  (trainer)
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<ProgressLog>> getMemberProgress(@PathVariable Long memberId) {
        User member = userRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        return ResponseEntity.ok(progressLogRepository.findByMember(member));
    }
}
