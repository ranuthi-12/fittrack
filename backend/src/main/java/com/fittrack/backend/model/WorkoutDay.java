package com.fittrack.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "workout_day")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WorkoutDay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private WorkoutPlan plan;

    @Enumerated(EnumType.STRING)
    @Column(name = "day_name", nullable = false)
    private DayName dayName;

    @Column(length = 100)
    private String focus;

    @JsonIgnore
    @OneToMany(mappedBy = "day", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Exercise> exercises;

    public enum DayName {
        Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
    }
}
