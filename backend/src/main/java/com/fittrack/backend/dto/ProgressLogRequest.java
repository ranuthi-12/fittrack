package com.fittrack.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ProgressLogRequest {
    private Long exerciseId;
    private BigDecimal weightKg;
    private Integer repsDone;
    private LocalDate loggedDate;
}
