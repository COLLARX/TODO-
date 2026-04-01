package com.example.todo.auth;

import com.example.todo.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthMapper authMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(AuthMapper authMapper, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.authMapper = authMapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public void register(RegisterRequest request) {
        String username = request.username().trim();
        if (authMapper.findByUsername(username) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "username already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        authMapper.insertUser(user);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = authMapper.findByUsername(request.username().trim());
        if (user == null || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "invalid credentials");
        }
        return new LoginResponse(jwtService.issue(user.getId(), user.getUsername()));
    }
}
