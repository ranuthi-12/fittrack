package com.fittrack.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "exercise")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "day_id", nullable = true)
    @JsonIgnore
    private WorkoutDay day;

    @Column(name = "exercise_name", nullable = false, length = 100)
    private String exerciseName;

    private Integer sets;
    private Integer reps;

    @Column(name = "duration_min")
    private Integer durationMin;

    @Column(length = 50)
    private String category;

    @Column(length = 50)
    private String level;

    @Column(length = 100)
    private String equipment;

    @Column(length = 255)
    private String muscles;

    @Column(length = 1000)
    private String instructions;

    @Column(length = 100)
    private String recommended;

    @Column(name = "video_thumbnail", length = 500)
    private String videoThumbnail;
}
