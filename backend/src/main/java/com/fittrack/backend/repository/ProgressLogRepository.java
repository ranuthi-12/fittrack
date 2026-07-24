package com.fittrack.backend.repository;

import com.fittrack.backend.model.ProgressLog;
import com.fittrack.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;

public interface ProgressLogRepository extends JpaRepository<ProgressLog, Long> {
    List<ProgressLog> findByMember(User member);
    List<ProgressLog> findByMemberAndLoggedDate(User member, LocalDate date);

    @Query("SELECT COUNT(DISTINCT p.loggedDate) FROM ProgressLog p WHERE p.member = :member AND p.loggedDate >= :startDate")
    long countDistinctWorkoutDays(User member, LocalDate startDate);

    List<ProgressLog> findByMemberAndLoggedDateBetween(User member, LocalDate start, LocalDate end);
}
