package com.cranberry.marketplace.config;

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

import com.cranberry.marketplace.security.JwtFilter;

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
                        // Allow all OPTIONS requests for CORS preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Public endpoints
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers("/api/ai/chat", "/api/ai/search", "/api/ai/recommend/**", 
                                        "/api/ai/health").permitAll()
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/api/health").permitAll()
                        // Payment config is public (just returns key)
                        .requestMatchers(HttpMethod.GET, "/api/payments/config").permitAll()
                        // Product management - vendors only
                        .requestMatchers(HttpMethod.POST, "/api/products/**").hasRole("VENDOR")
                        .requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("VENDOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("VENDOR")
                        // Cart & Wishlist - authenticated users
                        .requestMatchers("/api/cart/**").authenticated()
                        .requestMatchers("/api/wishlist/**").authenticated()
                        // Orders - authenticated users
                        .requestMatchers(HttpMethod.PUT, "/api/orders/*/status").hasRole("ADMIN")
                        .requestMatchers("/api/orders/**").authenticated()
                        // Payments - authenticated users
                        .requestMatchers("/api/payments/**").authenticated()
                        // User profile - authenticated users
                        .requestMatchers("/api/users/**").authenticated()
                        // Vendor endpoints
                        .requestMatchers("/api/vendor/dashboard").hasRole("VENDOR")
                        .requestMatchers("/api/vendor/products").hasRole("VENDOR")
                        .requestMatchers("/api/vendor/orders/**").hasRole("VENDOR")
                        .requestMatchers(HttpMethod.GET, "/api/vendor/**").permitAll()
                        .requestMatchers("/api/vendor/**").authenticated()
                        // Admin endpoints
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        // AI admin endpoints
                        .requestMatchers("/api/ai/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/ai/price-suggest").hasRole("VENDOR")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(new JwtFilter(),
                        org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
