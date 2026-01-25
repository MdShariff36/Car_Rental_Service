// ValidationUtil.java
package com.autoprime.util;

import java.util.regex.Pattern;

public class ValidationUtil {
    
    private static final Pattern EMAIL_PATTERN = 
        Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    
    private static final Pattern PHONE_PATTERN = 
        Pattern.compile("^[0-9]{10}$");
    
    private static final Pattern LICENSE_PATTERN = 
        Pattern.compile("^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,13}$");
    
    public static boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        return EMAIL_PATTERN.matcher(email).matches();
    }
    
    public static boolean isValidPhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            return false;
        }
        return PHONE_PATTERN.matcher(phone.replaceAll("[\\s-]", "")).matches();
    }
    
    public static boolean isValidLicense(String license) {
        if (license == null || license.trim().isEmpty()) {
            return false;
        }
        return LICENSE_PATTERN.matcher(license.replaceAll("[\\s-]", "")).matches();
    }
    
    public static boolean isValidPassword(String password) {
        return password != null && password.length() >= 6;
    }
    
    public static boolean isValidName(String name) {
        return name != null && !name.trim().isEmpty() && name.length() >= 2;
    }
}

