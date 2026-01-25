package com.autoprime.dto;

import com.autoprime.model.Role;

public class UserDTO {
    
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String licenseNumber;
    private String address;
    private Role role;
    
    // Constructors
    public UserDTO() {}
    
    public UserDTO(Long id, String name, String email, String phone, 
                   String licenseNumber, String address, Role role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.licenseNumber = licenseNumber;
        this.address = address;
        this.role = role;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { 
        this.licenseNumber = licenseNumber; 
    }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}