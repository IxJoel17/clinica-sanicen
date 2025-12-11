package com.utp.clinicasanicen_be.exception;

import java.time.LocalDateTime;
import java.util.Map;

public class ValidationErrorResponse extends ErrorResponse {
    private Map<String, String> validationErrors;
    
    public ValidationErrorResponse(int status, String message, String path, LocalDateTime timestamp, Map<String, String> validationErrors) {
        super(status, message, path, timestamp);
        this.validationErrors = validationErrors;
    }
    
    public Map<String, String> getValidationErrors() {
        return validationErrors;
    }
}

