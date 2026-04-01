package com.example.todo.security;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "app.jwt")
public record JwtProperties(
    @NotBlank(message = "app.jwt.secret must be configured")
    @Size(min = 32, message = "app.jwt.secret must be at least 32 characters")
    String secret,
    @Positive(message = "app.jwt.expiration-seconds must be positive")
    long expirationSeconds
) {
}
