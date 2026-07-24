package com.fittrack.backend.controller;

import com.fittrack.backend.dto.AssignPlanRequest;
import com.fittrack.backend.dto.WorkoutPlanResponse;
import com.fittrack.backend.model.User;
import com.fittrack.backend.service.WorkoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/workout")
@RequiredArgsConstructor
public class WorkoutController {

    private final WorkoutService workoutService;

    // GET /api/workout/my-plan  (member)
    @GetMapping("/my-plan")
    public ResponseEntity<WorkoutPlanResponse> getMyPlan(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(workoutService.getMyPlan(user));
    }

    // POST /api/workout/assign  (trainer)
    @PostMapping("/assign")
    public ResponseEntity<WorkoutPlanResponse> assignPlan(
            @AuthenticationPrincipal User trainer,
            @RequestBody AssignPlanRequest req) {
        return ResponseEntity.ok(workoutService.assignPlan(trainer, req));
    }

    // GET /api/workout/member/{memberId}  (trainer)
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<WorkoutPlanResponse>> getMemberPlans(@PathVariable Long memberId) {
        return ResponseEntity.ok(workoutService.getPlansForMember(memberId));
    }
}
