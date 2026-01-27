package com.cranberry.marketplace.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;

@Configuration
public class OllamaConfig {

    @Value("${ai.ollama.baseUrl:http://localhost:11434}")
    private String ollamaBaseUrl;

    @Value("${ai.ollama.timeout:60000}")
    private int timeout;

    @Bean
    public WebClient ollamaWebClient() {
        return WebClient.builder()
                .baseUrl(ollamaBaseUrl)
                .build();
    }

    public String getOllamaBaseUrl() {
        return ollamaBaseUrl;
    }

    public Duration getTimeout() {
        return Duration.ofMillis(timeout);
    }
}
