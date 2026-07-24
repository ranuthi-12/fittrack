package com.fittrack.backend.service;

import com.fittrack.backend.dto.MembershipResponse;
import com.fittrack.backend.model.Membership;
import com.fittrack.backend.model.Notification;
import com.fittrack.backend.model.User;
import com.fittrack.backend.repository.MembershipRepository;
import com.fittrack.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MembershipService {

    private final MembershipRepository membershipRepository;
    private final NotificationRepository notificationRepository;

    public MembershipResponse getMyMembership(User user) {
        Membership m = membershipRepository
                .findTopByUserOrderByCreatedAtDesc(user)
                .orElseThrow(() -> new RuntimeException("No membership found"));
        return toResponse(m);
    }

    public List<MembershipResponse> getPaymentHistory(User user) {
        return membershipRepository.findByUser(user)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public MembershipResponse renewMembership(User user, String planType) {
        Membership.PlanType type = Membership.PlanType.valueOf(planType);
        LocalDate start = LocalDate.now();
        LocalDate end = switch (type) {
            case MONTHLY   -> start.plusMonths(1);
            case QUARTERLY -> start.plusMonths(3);
            case ANNUAL    -> start.plusYears(1);
        };
        BigDecimal amount = switch (type) {
            case MONTHLY   -> new BigDecimal("2500");
            case QUARTERLY -> new BigDecimal("6500");
            case ANNUAL    -> new BigDecimal("22000");
        };

        Membership membership = Membership.builder()
                .user(user).planType(type)
                .startDate(start).endDate(end)
                .amountPaid(amount).status(Membership.Status.ACTIVE)
                .build();
        membershipRepository.save(membership);

        // Send notification
        notificationRepository.save(Notification.builder()
                .user(user).type(Notification.NotificationType.PAYMENT)
                .title("Payment confirmed")
                .message("Your payment of Rs. " + amount + " for " + type + " plan has been confirmed.")
                .build());

        return toResponse(membership);
    }

    private MembershipResponse toResponse(Membership m) {
        long daysRemaining = Math.max(0, ChronoUnit.DAYS.between(LocalDate.now(), m.getEndDate()));
        long daysTotal     = ChronoUnit.DAYS.between(m.getStartDate(), m.getEndDate());
        return MembershipResponse.builder()
                .id(m.getId())
                .planType(m.getPlanType().name())
                .startDate(m.getStartDate())
                .endDate(m.getEndDate())
                .amountPaid(m.getAmountPaid())
                .status(m.getStatus().name())
                .daysRemaining(daysRemaining)
                .daysTotal(daysTotal)
                .build();
    }
}
