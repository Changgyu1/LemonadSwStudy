package lm.swith.user.Service;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import lm.swith.user.mapper.UsersMapper;
import lm.swith.user.model.SwithUser;




@Service
public class KakaoService {
	@Autowired
	private UsersMapper usersMapper;
	
		// Value를 썼기 때문에 각 값을 변수에 넣어 보관하겠다는 의미
				@Value("${kakao.client.id}") // Spring으로 import
				private String KAKAO_CLIENT_ID;
				
				@Value("${kakao.client.secret}")
				private String KAKAO_CLIENT_SECRET;	
				@Value("${kakao.redirect.url}")
				private String KAKAO_REDIRECT_URL;
				
				// 카카오 자체에서 인증으로 들어가는 공식 주소
				private final static String KAKAO_AUTH_URI ="https://kauth.kakao.com";

			    private final static String KAKAO_API_URI="https://kapi.kakao.com";
				
				private final UsersMapper usersmapper;
				public KakaoService(UsersMapper usersmapper) {
					this.usersmapper = usersmapper;
				}
				

				
				public String getKakaoLogin() {
					return KAKAO_AUTH_URI + "/oauth/authorize?client_id=" + KAKAO_CLIENT_ID + "&redirect_uri=" + KAKAO_REDIRECT_URL + "&response_type=code"; // 카카오 개발자 공식문서에 적혀있는 주소임
				}
				
				public SwithUser getKakaoInfo(String code, String password, String userName, byte[] userProfile, String userAddress, String userIntroduction, String role) throws Exception {
				        
					if(code == null) throw new Exception("존재하는 인증코드가 없습니다.");
					
					// 로그인이 허용된 토큰이 들어갈 공간
					String accessToken="";

					try {
						HttpHeaders headers = new HttpHeaders(); // Spring으로 import
						headers.add("Content-type", "application/x-www-form-urlencoded");
						MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
						params.add("grant_type", "authorization_code");
						params.add("client_id", KAKAO_CLIENT_ID);
						params.add("client_secret", KAKAO_CLIENT_SECRET);
						params.add("code", code);
						params.add("redirect_uri", KAKAO_REDIRECT_URL);
						

						RestTemplate restTemplate = new RestTemplate();
			            HttpEntity<MultiValueMap<String, String>> httpEntity = new HttpEntity<>(params, headers);

						ResponseEntity<String> response = restTemplate.exchange(KAKAO_AUTH_URI + "/oauth/token", HttpMethod.POST, httpEntity, String.class);

						JSONParser jsonParser = new JSONParser();
						JSONObject jsonObject = (JSONObject) jsonParser.parse(response.getBody());
						System.out.println("jsonObject" + jsonObject);
						accessToken = (String) jsonObject.get("access_token");
						System.out.println("accessToken" + accessToken);

					} catch(Exception e) {
						throw new Exception("api를 불러오지 못했습니다.");
					}
					
					return getUserInfoWithToken(accessToken,password, userName,userProfile,userAddress, userIntroduction,role);
				}
				
				// 회사에서 카카오로부터 로그인 할 수 있도록 허용받은 받은 로그인 허용 토큰을 사용하여 카카오 API에서 사용자 정보를 가져오는 메서드 (개인 사용자가 아님)
				private SwithUser getUserInfoWithToken(String accessToken, String password, String userName, byte[] userProfile, String userAddress, String userIntroduction, String role) throws Exception {
					// 토큰용 HTTPHeader 생성
					HttpHeaders headers = new HttpHeaders();
					// Bearer : Http 요청에서 인증할 때 특정 형태로 변환하여 토큰 타입을 나타내는 것
					headers.add("Authorization", "Bearer " + accessToken);
					headers.add("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
					
					// 내용을 담아놓을 template 생성
					RestTemplate rt = new RestTemplate();
					HttpEntity<MultiValueMap<String, String>> httpEntity = new HttpEntity<>(headers);
					
					ResponseEntity<String> response = rt.exchange(KAKAO_API_URI + "/v2/user/me", HttpMethod.POST, httpEntity, String.class);

					// Response 데이터 가져오기
					JSONParser jsonParser = new JSONParser();
					JSONObject jsonObject =(JSONObject) jsonParser.parse(response.getBody());
					JSONObject account = (JSONObject) jsonObject.get("kakao_account");
					JSONObject profile = (JSONObject) account.get("profile");
					
					long user_no = (long) jsonObject.get("user_no");
					String email = String.valueOf(account.get("email"));
					String nickname = String.valueOf(profile.get("nickname"));
					
			
				
				return SwithUser.builder()
						.user_no(user_no)
		                .email(email)
		                .password(password)
		                .username(userName)
		                .nickname(nickname)
		                .user_profile(userProfile)
		                .useraddress(userAddress) 
		                .user_introduction(userIntroduction)
		                .user_role(role)
		                .build();
		    }
				   public SwithUser signUpUser(SwithUser swithUser)  {
				    	SwithUser user = new SwithUser();
				    	user.setEmail(swithUser.getEmail());
						user.setPassword(swithUser.getPassword());
						user.setUsername(swithUser.getUsername());
						user.setNickname(swithUser.getNickname());
						user.setUser_profile(swithUser.getUser_profile());
						user.setUseraddress(swithUser.getUseraddress());
						user.setUser_introduction(swithUser.getUser_introduction());
						user.setUser_role(swithUser.getUser_role());
						
						usersMapper.insertUser(swithUser);
						return user;
						
				    }
				// 데이터베이스에 저장하는 메서드 생성
				
				
			
		}

	
	
	
	/*
    @Value("${kakao.client.id}")
    private String KAKAO_CLIENT_ID;

    @Value("${kakao.client.secret}")
    private String KAKAO_CLIENT_SECRET;

    @Value("${kakao.redirect.url}")
    private String KAKAO_REDIRECT_URL;

    private final static String KAKAO_AUTH_URI = "https://kauth.kakao.com";

    private final static String KAKAO_API_URI = "https://kapi.kakao.com";

    

    public String getKakaoLogin() {
        return KAKAO_AUTH_URI + "/oauth/authorize"
                + "?client_id=" + KAKAO_CLIENT_ID
                + "&redirect_uri=" + KAKAO_REDIRECT_URL
                + "&response_type=code";
    }

    public SwithUser getKakaoInfo(String code, String password, String userName, String userProfile, String userAddress, String userIntroduction, String role) throws Exception {
        if (code == null) throw new Exception("API를 불러오지 못했습니다.");

        String accessToken = "";
        String refreshToken="";
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-type", "application/x-www-form-urlencoded");

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "authorization_code");
            params.add("client_id", KAKAO_CLIENT_ID);
            params.add("client_secret", KAKAO_CLIENT_SECRET);
            params.add("code", code);
            params.add("redirect_uri", KAKAO_REDIRECT_URL);

            RestTemplate restTemplate = new RestTemplate();
            HttpEntity<MultiValueMap<String, String>> httpEntity = new HttpEntity<>(params, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    KAKAO_AUTH_URI + "/oauth/token",
                    HttpMethod.POST,
                    httpEntity,
                    String.class
            );
            System.out.println("Kakao API Token Response: " + response.getBody());
            JSONParser jsonParser = new JSONParser();
            JSONObject jsonObj = (JSONObject) jsonParser.parse(response.getBody());

            accessToken = (String) jsonObj.get("access_token");
            refreshToken = (String) jsonObj.get("refresh_token");

        } catch (Exception e) {
        	 throw new Exception("카카오 API 호출 실패: " + e.getMessage());
            
        }

        return getUserInfoWithToken(accessToken,password, userName,userProfile,userAddress, userIntroduction,role);
    }

    private SwithUser getUserInfoWithToken(String accessToken, String password, String userName, String userProfile, String userAddress, String userIntroduction, String role) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");

        RestTemplate rt = new RestTemplate();
        HttpEntity<MultiValueMap<String, String>> httpEntity = new HttpEntity<>(headers);
        ResponseEntity<String> response = rt.exchange(
                KAKAO_API_URI + "/v2/user/me",
                HttpMethod.POST,
                httpEntity,
                String.class
        );

        JSONParser jsonParser = new JSONParser();
        JSONObject jsonObj = (JSONObject) jsonParser.parse(response.getBody());
        JSONObject account = (JSONObject) jsonObj.get("kakao_account");
        JSONObject profile = (JSONObject) account.get("profile");

        Object userNOObject = jsonObj.get("userNO");
        long userNO = userNOObject != null ? ((Number) userNOObject).longValue() : 0;
        String email = String.valueOf(account.get("email"));
        String nickname = String.valueOf(profile.get("nickname"));

   
        
        
        
        
        
        return SwithUser.builder()
                .userNO(userNO)
                .email(email)
                .password(password)
                .userName(userName)
                .nickname(nickname)
                .userProfile(userProfile)
                .userAddress(userAddress) 
                .userIntroduction(userIntroduction)
                .role(role)
                .build();
    }

    public SwithUser signUpUser(SwithUser swithUser)  {
    	SwithUser user = new SwithUser();
    	user.setEmail(swithUser.getEmail());
		user.setPassword(swithUser.getPassword());
		user.setUserName(swithUser.getUserName());
		user.setNickname(swithUser.getNickname());
		user.setUserProfile(swithUser.getUserProfile());
		user.setUserAddress(swithUser.getUserAddress());
		user.setUserIntroduction(swithUser.getUserIntroduction());
		user.setRole(swithUser.getRole());
		
		usersMapper.insertUser(swithUser);
		return user;
		
    }
    
    
}
*/