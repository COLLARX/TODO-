package com.example.todo.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long expirationSeconds;

    public JwtService(@Value("${app.jwt.secret}") String secret, @Value("${app.jwt.expiration-seconds}") long expirationSeconds) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationSeconds = expirationSeconds;
    }

    public String issue(Long userId, String username) {
        Instant now = Instant.now();
        return Jwts.builder()
            .subject(username)
            .claim("userId", userId)
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plusSeconds(expirationSeconds)))
            .signWith(secretKey)
            .compact();
    }

    public Long extractUserId(String token) {
        Claims claims = Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
        Object userId = claims.get("userId");
        if (userId instanceof Integer intValue) {
            return intValue.longValue();
        }
        if (userId instanceof Long longValue) {
            return longValue;
        }
        throw new IllegalArgumentException("token missing userId");
    }
}
