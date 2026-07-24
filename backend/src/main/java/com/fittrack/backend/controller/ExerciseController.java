package com.fittrack.backend.controller;

import com.fittrack.backend.model.Exercise;
import com.fittrack.backend.repository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseRepository exerciseRepository;

    // GET /api/exercises
    @GetMapping
    public ResponseEntity<List<Exercise>> getExercises(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {

        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(exerciseRepository
                    .findByExerciseNameContainingIgnoreCaseOrMusclesContainingIgnoreCase(search, search));
        }

        if (category != null && !category.trim().isEmpty() && !"All".equalsIgnoreCase(category)) {
            return ResponseEntity.ok(exerciseRepository.findByCategoryIgnoreCase(category));
        }

        return ResponseEntity.ok(exerciseRepository.findAll());
    }
}
