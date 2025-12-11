package com.utp.clinicasanicen_be.exception;

import java.time.LocalDateTime;

public class ErrorResponse {
    private int status;
    private String message;
    private String path;
    private LocalDateTime timestamp;
    
    public ErrorResponse(int status, String message, String path, LocalDateTime timestamp) {
        this.status = status;
        this.message = message;
        this.path = path;
        this.timestamp = timestamp;
    }
    
    public int getStatus() {
        return status;
    }
    
    public String getMessage() {
        return message;
    }
    
    public String getPath() {
        return path;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}

