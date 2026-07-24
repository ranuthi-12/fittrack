package com.fittrack.backend.repository;

import com.fittrack.backend.model.Trainer;
import com.fittrack.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TrainerRepository extends JpaRepository<Trainer, Long> {
    Optional<Trainer> findByUser(User user);
    Optional<Trainer> findByUserId(Long userId);
}
