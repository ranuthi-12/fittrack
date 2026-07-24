package com.fittrack.backend.repository;

import com.fittrack.backend.model.Exercise;
import com.fittrack.backend.model.WorkoutDay;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    List<Exercise> findByDay(WorkoutDay day);
    List<Exercise> findByCategoryIgnoreCase(String category);
    List<Exercise> findByExerciseNameContainingIgnoreCaseOrMusclesContainingIgnoreCase(String nameQuery, String muscleQuery);
    Optional<Exercise> findFirstByExerciseNameIgnoreCase(String exerciseName);
}
