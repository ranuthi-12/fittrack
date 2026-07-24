package com.fittrack.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class AssignPlanRequest {
    private Long memberId;
    private String planName;
    private List<DayRequest> days;

    @Data
    public static class DayRequest {
        private String dayName;
        private String focus;
        private List<ExerciseRequest> exercises;
    }

    @Data
    public static class ExerciseRequest {
        private String exerciseName;
        private Integer sets;
        private Integer reps;
        private Integer durationMin;
    }
}
