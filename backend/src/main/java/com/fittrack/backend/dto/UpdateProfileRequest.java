package com.fittrack.backend.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String emergencyContact;
    private Boolean emailNotifs;
    private Boolean smsNotifs;
}
