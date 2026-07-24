package com.fittrack.backend.repository;

import com.fittrack.backend.model.Membership;
import com.fittrack.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MembershipRepository extends JpaRepository<Membership, Long> {
    Optional<Membership> findTopByUserOrderByCreatedAtDesc(User user);
    List<Membership> findByUser(User user);
    List<Membership> findByStatus(Membership.Status status);
    List<Membership> findByEndDateBeforeAndStatus(LocalDate date, Membership.Status status);
}
