package com.fittrack.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "trainer")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Trainer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 100)
    private String specialization;

    @Column(name = "member_count")
    private Integer memberCount = 0;

    @Column(name = "joined_date")
    private LocalDate joinedDate;
}
