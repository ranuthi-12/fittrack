package com.fittrack.backend.dto;

import lombok.Data;

@Data
public class AddTrainerRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String specialization;
    private String password;
}
