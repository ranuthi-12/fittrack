package com.fittrack.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(length = 25)
    private String phone;

    @Column(name = "emergency_contact", length = 25)
    private String emergencyContact;

    @Column(name = "email_notifs")
    @Builder.Default
    private Boolean emailNotifs = true;

    @Column(name = "sms_notifs")
    @Builder.Default
    private Boolean smsNotifs = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Role role = Role.MEMBER;

    @Column(name = "password_changed")
    @Builder.Default
    private Boolean passwordChanged = false;

    @Column(name = "joined_date")
    private LocalDate joinedDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.joinedDate == null) this.joinedDate = LocalDate.now();
    }

    public enum Role { MEMBER, TRAINER, ADMIN }
}
