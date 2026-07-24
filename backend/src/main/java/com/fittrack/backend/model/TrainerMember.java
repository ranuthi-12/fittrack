package com.fittrack.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "trainer_member")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TrainerMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id", nullable = false)
    private Trainer trainer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private User member;

    @Column(name = "assigned_date")
    private LocalDate assignedDate;

    @PrePersist
    public void prePersist() {
        if (this.assignedDate == null) this.assignedDate = LocalDate.now();
    }
}
