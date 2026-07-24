package com.fittrack.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data @Builder
public class MembershipResponse {
    private Long id;
    private String planType;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal amountPaid;
    private String status;
    private Long daysRemaining;
    private Long daysTotal;
}
