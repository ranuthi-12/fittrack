package com.fittrack.backend.controller;

import com.fittrack.backend.model.*;
import com.fittrack.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.fittrack.backend.dto.MemberSummaryResponse;

@RestController
@RequestMapping("/api/trainer")
@RequiredArgsConstructor
public class TrainerController {

    private final TrainerRepository trainerRepository;
    private final TrainerMemberRepository trainerMemberRepository;
    private final ActivityLogRepository activityLogRepository;
    private final WorkoutPlanRepository workoutPlanRepository;

    @GetMapping("/my-members")
    public ResponseEntity<List<MemberSummaryResponse>> getMyMembers(@AuthenticationPrincipal User trainerUser) {
        Trainer trainer = trainerRepository.findByUser(trainerUser)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
        List<TrainerMember> assignments = trainerMemberRepository.findByTrainer(trainer);
        List<MemberSummaryResponse> members = assignments.stream()
                .map(a -> {
                    User m = a.getMember();
                    return MemberSummaryResponse.builder()
                            .id(m.getId())
                            .firstName(m.getFirstName())
                            .lastName(m.getLastName())
                            .email(m.getEmail())
                            .phone(m.getPhone())
                            .build();
                })
                .toList();
        return ResponseEntity.ok(members);
    }

    // GET /api/trainer/stats
    @GetMapping("/stats")
    public ResponseEntity<?> getStats(@AuthenticationPrincipal User trainerUser) {
        Trainer trainer = trainerRepository.findByUser(trainerUser)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
        List<TrainerMember> assignments = trainerMemberRepository.findByTrainer(trainer);
        List<WorkoutPlan> plans = workoutPlanRepository.findByTrainer(trainer);
        long membersWithPlans = plans.stream().map(p -> p.getMember().getId()).distinct().count();

        return ResponseEntity.ok(java.util.Map.of(
                "myMembers", assignments.size(),
                "plansAssigned", plans.size(),
                "pendingPlans", Math.max(0, assignments.size() - membersWithPlans)
        ));
    }

    // GET /api/trainer/activity
    @GetMapping("/activity")
    public ResponseEntity<List<ActivityLog>> getActivityFeed() {
        return ResponseEntity.ok(activityLogRepository.findAllByOrderByCreatedAtDesc());
    }
}
