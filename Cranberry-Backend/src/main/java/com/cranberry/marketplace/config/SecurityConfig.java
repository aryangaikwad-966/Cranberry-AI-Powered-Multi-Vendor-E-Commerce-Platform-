package com.cranberry.marketplace.config;

import com.cranberry.marketplace.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CorsConfigurationSource corsConfigurationSource;

    public SecurityConfig(CorsConfigurationSource corsConfigurationSource) {
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers("/api/ai/chat", "/api/ai/search", "/api/ai/recommend/**", 
                                        "/api/ai/health").permitAll()
                        .requestMatchers("/error").permitAll()
                        // Payment config is public (just returns key)
                        .requestMatchers(HttpMethod.GET, "/api/payments/config").permitAll()
                        // Product management - vendors only
                        .requestMatchers(HttpMethod.POST, "/api/products/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/products/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**").authenticated()
                        // Cart & Wishlist - authenticated users
                        .requestMatchers("/api/cart/**").authenticated()
                        .requestMatchers("/api/wishlist/**").authenticated()
                        // Orders - authenticated users
                        .requestMatchers("/api/orders/**").authenticated()
                        // Payments - authenticated users
                        .requestMatchers("/api/payments/**").authenticated()
                        // User profile - authenticated users
                        .requestMatchers("/api/users/**").authenticated()
                        // Vendor endpoints
                        .requestMatchers("/api/vendor/dashboard").authenticated()
                        .requestMatchers("/api/vendor/products").authenticated()
                        .requestMatchers("/api/vendor/orders").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/vendor/**").permitAll()
                        .requestMatchers("/api/vendor/**").authenticated()
                        // Admin endpoints
                        .requestMatchers("/api/admin/**").authenticated()
                        // AI admin endpoints
                        .requestMatchers("/api/ai/admin/**").authenticated()
                        .requestMatchers("/api/ai/price-suggest").authenticated()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(new JwtFilter(),
                        org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}