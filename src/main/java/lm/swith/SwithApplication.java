package lm.swith;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class SwithApplication {

	public static void main(String[] args) {
		SpringApplication.run(SwithApplication.class, args);
	}
	
	@Configuration
	public class WebMvcConfig implements WebMvcConfigurer {
		@Override
		public void addCorsMappings(CorsRegistry registry) {
			registry
			.addMapping("/**")
			//.allowedOriginPatterns("http://localhost:3000")
			.allowedOriginPatterns("http://lemonadswith.store:8080")
			.allowedMethods("OPTIONS", "GET", "POST", "PUT", "DELETE")
			.allowCredentials(true).maxAge(3600);
		}
	}
	

}
