package com.autoprime.dto;

public class AuthResponse {
    private String token;
    private String message;
    private UserDTO user;

    // Constructors
    public AuthResponse() {}

    public AuthResponse(String token, String message, UserDTO user) {
        this.token = token;
        this.message = message;
        this.user = user;
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public UserDTO getUser() { return user; }
    public void setUser(UserDTO user) { this.user = user; }
}