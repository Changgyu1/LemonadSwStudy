package lm.swith.user.config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.filter.CorsFilter;

import lm.swith.user.token.JwtAuthenticationFilter;
import lombok.extern.slf4j.Slf4j;


	@EnableWebSecurity
	@Slf4j
	@Configuration
	public class WebSecurityConfig{
		
		@Autowired
		private JwtAuthenticationFilter jwtAuthenticationFilter;
		
		@Bean
	    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		 

	        http
	        
	        .cors(cors -> cors.disable())
	        .csrf(csrf -> csrf.disable()) 
	        .httpBasic(httpHasic -> httpHasic.disable()) // token을 사용하르모 basic 인증 disable
	        .sessionManagement((session) -> session // session 기반이 아님을 선언
	                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

	        .authorizeHttpRequests(authorizeRequests -> 
	        authorizeRequests
	            .requestMatchers(new AntPathRequestMatcher("/**")).permitAll()
	    )
	            .addFilterAfter(
	        			jwtAuthenticationFilter,
	        			CorsFilter.class);
	            
	            
	        	
	             // Disable CSRF protection


	        return http.build();
	    }
		
		@Bean
		static PasswordEncoder passwordEncoder() {
			return new BCryptPasswordEncoder(); // 기본형식인 Security는 기본적으로 DelegatingPasswordEncoder를 BCryptPasswordEncoder() 형식으로 저장
		}
}
