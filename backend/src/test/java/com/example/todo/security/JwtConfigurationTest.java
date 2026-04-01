package com.example.todo.security;

import com.example.todo.TodoApplication;
import org.junit.jupiter.api.Test;
import org.springframework.boot.builder.SpringApplicationBuilder;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtConfigurationTest {

    @Test
    void application_fails_to_start_when_jwt_secret_missing() {
        assertThatThrownBy(() -> {
            try (var ignored = new SpringApplicationBuilder(TodoApplication.class)
                .properties(
                    "spring.config.location=file:src/main/resources/application.yml",
                    "server.port=0",
                    "spring.main.banner-mode=off"
                )
                .run()) {
                // Context should fail before this point when JWT secret is mandatory.
            }
        }).isInstanceOf(Exception.class);
    }
}
