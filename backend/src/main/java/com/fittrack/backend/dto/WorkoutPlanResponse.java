package com.fittrack.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data @Builder
public class WorkoutPlanResponse {
    private Long id;
    private String planName;
    private String trainerName;
    private String assignedDate;
    private List<DayResponse> days;

    @Data @Builder
    public static class DayResponse {
        private Long id;
        private String dayName;
        private String focus;
        private List<ExerciseResponse> exercises;
    }

    @Data @Builder
    public static class ExerciseResponse {
        private Long id;
        private String exerciseName;
        private Integer sets;
        private Integer reps;
        private Integer durationMin;
    }
}
