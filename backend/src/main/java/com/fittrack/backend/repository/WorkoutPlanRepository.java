package com.fittrack.backend.repository;

import com.fittrack.backend.model.Trainer;
import com.fittrack.backend.model.User;
import com.fittrack.backend.model.WorkoutPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WorkoutPlanRepository extends JpaRepository<WorkoutPlan, Long> {
    Optional<WorkoutPlan> findTopByMemberOrderByCreatedAtDesc(User member);
    List<WorkoutPlan> findByMember(User member);
    List<WorkoutPlan> findByTrainer(Trainer trainer);
}
