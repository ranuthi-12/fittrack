package com.fittrack.backend.config;

import com.fittrack.backend.security.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .headers(headers -> headers.frameOptions(frame -> frame.disable()))
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/auth/**", "/api/public/**", "/h2-console/**", "/api/exercises/**", "/error").permitAll()
                // Member & Shared endpoints
                .requestMatchers("/api/user/**").hasAnyRole("MEMBER", "TRAINER", "ADMIN")
                .requestMatchers("/api/member/**").hasRole("MEMBER")
                .requestMatchers("/api/membership/**").hasAnyRole("MEMBER", "ADMIN")
                .requestMatchers("/api/workout/**").hasAnyRole("MEMBER", "TRAINER")
                .requestMatchers("/api/progress/**").hasAnyRole("MEMBER", "TRAINER")
                .requestMatchers("/api/notifications/**").hasAnyRole("MEMBER", "TRAINER", "ADMIN")
                .requestMatchers("/api/attendance/**").hasAnyRole("MEMBER", "TRAINER", "ADMIN")
                .requestMatchers("/api/chat/**").hasAnyRole("MEMBER", "TRAINER", "ADMIN")
                // Trainer endpoints
                .requestMatchers("/api/trainer/**").hasAnyRole("TRAINER", "ADMIN")
                // Admin endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
