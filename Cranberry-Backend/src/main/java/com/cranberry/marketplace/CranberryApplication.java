package com.cranberry.marketplace;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CranberryApplication {
    public static void main(String[] args) {
        // Load .env file
        try {
            io.github.cdimascio.dotenv.Dotenv dotenv = io.github.cdimascio.dotenv.Dotenv.configure()
                .ignoreIfMissing()
                .load();
            dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
        } catch (Exception e) {
            System.err.println("Note: Could not load .env file. Using system environment variables instead.");
        }
        
        SpringApplication.run(CranberryApplication.class, args);
    }
}
