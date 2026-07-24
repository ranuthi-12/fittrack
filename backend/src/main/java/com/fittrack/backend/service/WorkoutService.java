package com.fittrack.backend.service;

import com.fittrack.backend.dto.AssignPlanRequest;
import com.fittrack.backend.dto.WorkoutPlanResponse;
import com.fittrack.backend.model.*;
import com.fittrack.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkoutService {

    private final WorkoutPlanRepository workoutPlanRepository;
    private final UserRepository userRepository;
    private final TrainerRepository trainerRepository;
    private final NotificationRepository notificationRepository;

    public WorkoutPlanResponse getMyPlan(User member) {
        WorkoutPlan plan = workoutPlanRepository
                .findTopByMemberOrderByCreatedAtDesc(member)
                .orElseThrow(() -> new RuntimeException("No workout plan found"));
        return toResponse(plan);
    }

    @Transactional
    public WorkoutPlanResponse assignPlan(User trainerUser, AssignPlanRequest req) {
        Trainer trainer = trainerRepository.findByUser(trainerUser)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));

        User member = userRepository.findById(req.getMemberId())
                .orElseThrow(() -> new RuntimeException("Member not found"));

        WorkoutPlan plan = WorkoutPlan.builder()
                .trainer(trainer).member(member)
                .planName(req.getPlanName()).build();

        List<WorkoutDay> days = req.getDays().stream().map(dayReq -> {
            WorkoutDay day = WorkoutDay.builder()
                    .plan(plan)
                    .dayName(WorkoutDay.DayName.valueOf(dayReq.getDayName()))
                    .focus(dayReq.getFocus()).build();

            List<Exercise> exercises = dayReq.getExercises().stream().map(exReq ->
                    Exercise.builder().day(day)
                            .exerciseName(exReq.getExerciseName())
                            .sets(exReq.getSets()).reps(exReq.getReps())
                            .durationMin(exReq.getDurationMin()).build()
            ).collect(Collectors.toList());

            day.setExercises(exercises);
            return day;
        }).collect(Collectors.toList());

        plan.setDays(days);
        WorkoutPlan saved = workoutPlanRepository.save(plan);

        // Notify member
        notificationRepository.save(Notification.builder()
                .user(member).type(Notification.NotificationType.WORKOUT_ASSIGNED)
                .title("New workout plan assigned")
                .message(trainerUser.getFirstName() + " has assigned you a new plan: " + req.getPlanName())
                .build());

        return toResponse(saved);
    }

    public List<WorkoutPlanResponse> getPlansForMember(Long memberId) {
        User member = userRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        return workoutPlanRepository.findByMember(member)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private WorkoutPlanResponse toResponse(WorkoutPlan plan) {
        List<WorkoutPlanResponse.DayResponse> days = plan.getDays() == null ? List.of() :
                plan.getDays().stream().map(day -> {
                    List<WorkoutPlanResponse.ExerciseResponse> exercises = day.getExercises() == null ? List.of() :
                            day.getExercises().stream().map(ex ->
                                    WorkoutPlanResponse.ExerciseResponse.builder()
                                            .id(ex.getId()).exerciseName(ex.getExerciseName())
                                            .sets(ex.getSets()).reps(ex.getReps())
                                            .durationMin(ex.getDurationMin()).build()
                            ).collect(Collectors.toList());
                    return WorkoutPlanResponse.DayResponse.builder()
                            .id(day.getId()).dayName(day.getDayName().name())
                            .focus(day.getFocus()).exercises(exercises).build();
                }).collect(Collectors.toList());

        return WorkoutPlanResponse.builder()
                .id(plan.getId()).planName(plan.getPlanName())
                .trainerName(plan.getTrainer().getUser().getFirstName() + " " + plan.getTrainer().getUser().getLastName())
                .assignedDate(plan.getCreatedAt() != null ? plan.getCreatedAt().toLocalDate().toString() : "")
                .days(days).build();
    }
}
