/*
  Configuration class for handling Cross-Origin Resource Sharing (CORS).
  It allows the React frontend to communicate with the Spring Boot backend.
 */
package com.himalaya.hiketracker.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        
        // Apply CORS rules to all backend endpoints.
        registry.addMapping("/**")
                // Allow requests from the React frontend running on port 5173.
                .allowedOrigins("http://localhost:5173")
                // Specify the HTTP methods allowed for cross-origin requests.
                .allowedMethods(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
                // Allow all request headers.
                .allowedHeaders("*");
    }
}
