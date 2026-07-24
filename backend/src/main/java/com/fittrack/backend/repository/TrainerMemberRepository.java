package com.fittrack.backend.repository;

import com.fittrack.backend.model.Trainer;
import com.fittrack.backend.model.TrainerMember;
import com.fittrack.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TrainerMemberRepository extends JpaRepository<TrainerMember, Long> {
    List<TrainerMember> findByTrainer(Trainer trainer);
    Optional<TrainerMember> findByMember(User member);
    boolean existsByTrainerAndMember(Trainer trainer, User member);
}
