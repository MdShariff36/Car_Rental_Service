package com.autoprime.dto;

public class RegisterRequest {
    private String name;
    private String email;
    private String phone;
    private String password;
    private String license;
    private String address;
    private String role; // "USER" or "HOST"

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getLicense() { return license; }
    public void setLicense(String license) { this.license = license; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}