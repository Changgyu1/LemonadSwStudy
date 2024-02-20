package lm.swith.user.token;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lm.swith.user.model.SwithUser;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class TokenProvider {
	 private static final String SECRET_KEY = "Lemonade12fas2SwithsacacStudy";

	    // AccessToken 생성
	    public String createAccessToken(SwithUser swithUser) {
	        // 현재 시간을 기준으로 1일 후의 만료 시간을 설정
	        Date expiryDate = Date.from(Instant.now().plus(8, ChronoUnit.HOURS));

	        return Jwts.builder()
	                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
	                .setSubject(swithUser.getEmail())
	                .setIssuer("Lemonade Swith")
	                .setIssuedAt(new Date())
	                .setExpiration(expiryDate)
	                .compact();
	    }

	    // RefreshToken 생성
	    public String createRefreshToken() {
	        // 현재 시간을 기준으로 7일 후의 만료 시간을 설정 (예시로 7일, 실제 사용에 따라 조절)
	        Date expiryDate = Date.from(Instant.now().plus(7, ChronoUnit.DAYS));

	        return Jwts.builder()
	                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
	                .setExpiration(expiryDate)
	                .compact();
	    }

	    // AccessToken 검증 및 사용자 이메일 추출
	    public String validateAndGetUserEmail(String accessToken) {
	        try {
	            Claims claimsJws = Jwts.parser()
	                    .setSigningKey(SECRET_KEY)
	                    .parseClaimsJws(accessToken)
	                    .getBody();
	            // 여기서 필요한 유효성 검사를 수행할 수 있습니다.

	            return claimsJws.getSubject();
	        } catch (Exception e) {
	            // 토큰이 유효하지 않은 경우 등의 예외 처리
	            throw new RuntimeException("유효하지 않은 토큰입니다.", e);
	        }
	    }
}
