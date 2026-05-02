package com.iot.smart_monitoring.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String password;

    @Column(columnDefinition = "LONGTEXT")
    private String profilePicture;

    private transient String confirmPassword;

    private Integer failedAttempts = 0;

    private java.time.LocalDateTime lockTime;
}
