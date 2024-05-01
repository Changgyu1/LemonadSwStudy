package lm.swith.user.controller;


import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.List;

import javax.imageio.ImageIO;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import lm.swith.main.model.Likes;
import lm.swith.main.model.StudyApplication;
import lm.swith.user.Service.KakaoService;
import lm.swith.user.Service.MailService;
import lm.swith.user.Service.UserService;
import lm.swith.user.common.MsgEntity;
import lm.swith.user.model.ResponseDTO;
import lm.swith.user.model.SwithDTO;
import lm.swith.user.model.SwithUser;
import lm.swith.user.token.TokenProvider;
import lombok.RequiredArgsConstructor;

//@RestController
@Controller
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:8080")
//@CrossOrigin(origins = "http://lemonadswith.store:8080")
public class RegisterController {
	private final KakaoService kakaoService;
	private final UserService userService;
	private final MailService mailService;
	private final JavaMailSender javaMailSender;
	private final TokenProvider tokenProvider;
	private final PasswordEncoder passwordEncoder;
	
	
	// -- user_no 로 유저정보 가져오기
	@GetMapping("/info/{user_no}")
	public ResponseEntity<?> findByUserNo(@PathVariable Long user_no) {
	    SwithUser user = userService.findByUserNo(user_no);

	    if (user != null) {
	        return ResponseEntity.ok(user);
	    } else {
	        return ResponseEntity.notFound().build();
	    }
	}
	
	
	// -------- 토큰 발급 --------
	@PostMapping("/signin")
	public ResponseEntity<?> authenticate(@RequestBody SwithUser swithUser) {
		SwithUser user = userService.getByCredentials(swithUser.getEmail(), swithUser.getPassword(), passwordEncoder);
		// 사용자의 id, pwd 일치할 경우

	    if (user != null) {
	        if ("FALSE".equals(user.getSignout())) { // signout status
	            // 토큰 생성
	            final String token = tokenProvider.createAccessToken(user);
	            final SwithDTO responseUserDTO = SwithDTO.builder()
	                    .email(user.getEmail())
	                    .user_no(user.getUser_no())
	                    .username(user.getUsername())
	                    .useraddress(user.getUseraddress())
	                    .nickname(user.getNickname())
	                    .token(token) // 반환된 토큰 적용
	                    .build();
	            return ResponseEntity.ok(responseUserDTO);
			} else if("TRUE".equals(user.getSignout())) { // 회원 탈퇴했을경우
				return ResponseEntity.ok("Withdrawal");
			}
			}  else {
				return ResponseEntity.ok("Error");
			}
	    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("UnknownError");
		
	}

	@GetMapping("/userinfo")
	public ResponseEntity<?> getUserInfo() {
        // 현재 인증된 사용자의 정보를 가져오는 로직
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
     // 사용자가 인증되었는지 확인
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
            String userEmail = authentication.getName();
            // MyBatis를 이용하여 사용자 정보를 조회
            SwithUser user = userService.getUserByEmail(userEmail);
            byte[] profile_img = user.getUser_profile();

            if (profile_img != null && profile_img.length > 0) {
                // blob형태를 base64로 인코딩해주는 코드
                String imageBase64 = Base64.getEncoder().encodeToString(profile_img);

                String cutString = imageBase64.substring(imageBase64.indexOf("data:image/jpeg;base64") + "data:image/jpeg;base64".length());
                String imageUrl = "data:image/jpeg;base64,/" + cutString;
                user.setPassword(null);// 조회할 때 패스워드 안나오게 하려고 null값을 준다.
                user.setImg(imageUrl);// 단순 출력용 blob을 string형태로 출력하기 위함

                return ResponseEntity.ok(user);
            } else {
                // 사용자 정보나 프로필 이미지가 없을 경우에 대한 처리
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } else {
            // 사용자가 인증되지 않았을 경우에 대한 처리
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
	
	
	
	  @GetMapping("/")
	  public String MailPage(){
	      return "/";
	  }
	  
	  @ResponseBody
	  @PostMapping("/mail")
	  public ResponseEntity<String> MailSend(@RequestBody SwithUser swithUser){
	  	// MailService 객체 생성 
	  	MailService mailService = new MailService(javaMailSender);//send mail 
	    //comparing email
	  	SwithUser user = userService.getUserByEmail(swithUser.getEmail()); 
	  
	  	//넣은 값이 db에 존재하는지, 넣은 값이 null이 아닌 
	  	if(user != null && user.getEmail() != null) { //find해서 값이 존재하면 거부, null이면 
	  		String exists = "exists";
	  		 return ResponseEntity.ok(exists);
	     
	  	 }else {
	  		int number = mailService.sendMail(swithUser.getEmail());
		     String num = "" + number;
		     return ResponseEntity.ok(num);
	  	 }
	  }
	  
	  @ResponseBody
	  @PostMapping("/findPassword")
	  public ResponseEntity<String> findPassword(@RequestBody SwithUser swithUser){
		  MailService mailService = new MailService(javaMailSender);
		  int number = mailService.sendMail(swithUser.getEmail());
		     String num = "" + number;
		     return ResponseEntity.ok(num);
	  }
	  
	  //email(아이디)찾기
	  @PostMapping("/ExistEmail")
	  public ResponseEntity<String> checkEmail(@RequestBody SwithUser swithUser){
		  SwithUser user = userService.getUserByEmail(swithUser.getEmail());
		  //값이 db에 존재하는지 아닌지
		  if(user != null && user.getEmail()==null) { // 존재한다면
			  String existsEmail = "existsEmail";
			  return ResponseEntity.ok(existsEmail);
		  }else {
			  String None = "none";
			  return ResponseEntity.ok(None);
		  }
	  }
	  //닉네임 중복 체크 
	  @PostMapping("/nickname")
	  public ResponseEntity<String> checkNickname(@RequestBody SwithUser swithUser){
	  	
	  	SwithUser user = userService.getUserByNickname(swithUser.getNickname()); 
	  	
	  	//넣은 값이 db에 존재하는지, 넣은 값이 null이 아닌 
	  	if(user != null && user.getNickname() == null) { //find해서 값이 존재하면 거부, null이면 
	  		String existsNick = "existsNick";
	  		 return ResponseEntity.ok(existsNick);
	  	 }else {
	  		String newNickname = "new";
	  		 return ResponseEntity.ok(newNickname);
	  	 }
	  }
	  
	  @GetMapping("/register")
	  public String showRegisterForm(Model model) {
		  model.addAttribute("users",new SwithUser());
		  return "register";
	  }
	/*@GetMapping("/register")
	public List<SwithUser> findUsersAll() {
		return userService.findUsersAll();
	}
	*/	
	    @PostMapping("/register")
	    public ResponseEntity<SwithUser> registerUser(
	        @RequestParam(value = "img", required = false) MultipartFile img, // img 받아오게 해주는 부분
	        @RequestBody SwithUser swithUser
	    ) throws IOException {
	        if (swithUser.getImg() != null && !swithUser.getImg().isEmpty()) {
				// resource 폴더에 경로를 읽는다
	        	String imageData = swithUser.getImg().split(",")[1];
		        byte[] imageBytes = Base64.getDecoder().decode(imageData);//디코딩해서 blob 형태로 다시 넣어줌
		        
		     // BufferedImage로 이미지 읽기
		        ByteArrayInputStream bis = new ByteArrayInputStream(imageBytes);
		        BufferedImage originalImage = ImageIO.read(bis);
		        bis.close();

		        // 이미지 크기 조절 (예: 가로 100px로 조절)
		        int newWidth = 500;
		        int newHeight = (int) (originalImage.getHeight() * (1.0 * newWidth / originalImage.getWidth()));
		        BufferedImage resizedImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_ARGB);
		        resizedImage.getGraphics().drawImage(originalImage, 0, 0, newWidth, newHeight, null);

		        // 압축된 이미지를 Base64로 인코딩
		        ByteArrayOutputStream bos = new ByteArrayOutputStream();
		        ImageIO.write(resizedImage, "png", bos);
		        byte[] compressedImageBytes = bos.toByteArray();
		        bos.close();
		        swithUser.setUser_profile(compressedImageBytes);
			} else {
				ClassPathResource defaultImageResource = new ClassPathResource("img/girl.png");
				byte[] defaultImageBytes = StreamUtils.copyToByteArray(defaultImageResource.getInputStream());
				swithUser.setUser_profile(defaultImageBytes);//디코딩해서 blob 형태로 다시 넣어줌
				
			}

	        
	        
			SwithUser createUser = userService.signUpUser(swithUser);
			return ResponseEntity.ok(createUser);
		}
	
		
	//update 하은이 파트 
	    
	    //update user profile
	    @PostMapping("/updateUserProfile")
	    public ResponseEntity<String> updateUserProfile(@RequestBody SwithUser swithUser) throws IOException{
	     	
	    	 if (swithUser.getImg() != null && !swithUser.getImg().isEmpty()) {
	 			// resource 폴더에 경로를 읽는다
	         	String imageData = swithUser.getImg().split(",")[1];
	 	        byte[] imageBytes = Base64.getDecoder().decode(imageData);//디코딩해서 blob 형태로 다시 넣어줌
	 	        
	 	     // BufferedImage로 이미지 읽기
	 	        ByteArrayInputStream bis = new ByteArrayInputStream(imageBytes);
	 	        BufferedImage originalImage = ImageIO.read(bis);
	 	        bis.close();

	 	        // 이미지 크기 조절 (예: 가로 100px로 조절)
	 	        int newWidth = 500;
	 	        int newHeight = (int) (originalImage.getHeight() * (1.0 * newWidth / originalImage.getWidth()));
	 	        BufferedImage resizedImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_ARGB);
	 	        resizedImage.getGraphics().drawImage(originalImage, 0, 0, newWidth, newHeight, null);

	 	        // 압축된 이미지를 Base64로 인코딩
	 	        ByteArrayOutputStream bos = new ByteArrayOutputStream();
	 	        ImageIO.write(resizedImage, "png", bos);
	 	        byte[] compressedImageBytes = bos.toByteArray();
	 	        bos.close();
	 	        swithUser.setUser_profile(compressedImageBytes);
	 		} else {
	 			swithUser.setUser_profile(swithUser.getUser_profile());
	 		}
	     	userService.updateUserProfile(swithUser);
	     	return ResponseEntity.ok("User updated successfully");
	    }
	   
    	//update user info
	    @PostMapping("/updateUser")
	    public ResponseEntity<String> updateUser(@RequestBody SwithUser swithUser) {
	    	
	    	userService.updateUser(swithUser);
	        return ResponseEntity.ok("User updated successfully");

	    }
	    
	    //update user password
	    @PostMapping("/updatePassword")
	    public ResponseEntity<String> updatePassword(@RequestBody SwithUser swithUser){
	    	
	    	
	    	userService.updatePassword(swithUser);
	        return ResponseEntity.ok("User's password updated successfully");
	    }
	    
//delete User 관련
	    @PostMapping("/deleteUser")
	    public ResponseEntity<String> deleteUser(@RequestBody SwithUser swithUser){
	    	userService.deleteUser(swithUser);
	    	return ResponseEntity.ok("Delete User hold");
	    }
	    
	    @PostMapping("/deleteLikes")
	    public ResponseEntity<?> deleteUserLikes(@RequestBody Likes likes){
	    	userService.deleteUserLikes(likes);
	    	return ResponseEntity.ok("Delete User's Like");
	    }
	    @PostMapping("/deleteApplication")
	    public ResponseEntity<String> deleteUserApplication(@RequestBody StudyApplication studyApplication){
	    	userService.deleteUserApplication(studyApplication);
	    	return ResponseEntity.ok("Delete User's StudyPost Application");
	    }
	    
	    @GetMapping("/selectDeleteUser")
	    public ResponseEntity<List<SwithUser>> selectDeleteUserList(){
	    	List<SwithUser> user = userService.selectDeleteUserList();
	    	if(!user.isEmpty()) {
	    		return ResponseEntity.ok(user);
	    	}else {
	    		return ResponseEntity.noContent().build();
	    	}
	    }
	    
	    @PostMapping("deleteAdmin/{user_no}")
	    public ResponseEntity<String> deleteAdmin(@PathVariable Long user_no ,@RequestBody SwithUser swithUser){
	    	swithUser.setUser_no(user_no);
	    	userService.deleteAdmin(swithUser);
	    	return ResponseEntity.ok("Delete User");
	    }
	    
	    
	//카카오 
	@GetMapping("/kakao/callback")
    public String callback(HttpServletRequest request,
                           @RequestParam(required = false) String password,
                           @RequestParam(required = false) String userName, 
                           @RequestParam(required = false) byte[] userProfile,
                           @RequestParam(required = false) String userAddress,
                           @RequestParam(required = false) String userIntroduction,
                           @RequestParam(required = false) String user_role,
                           Model model) throws Exception {

        SwithUser kakaoInfo = kakaoService.getKakaoInfo(request.getParameter("code"), password,userName, userProfile,userAddress,userIntroduction,user_role );
        model.addAttribute("kakaoInfo", kakaoInfo);
        return "kakaoRegister";
    }
    @PostMapping("/kakaoregister")
    public ResponseEntity<MsgEntity> registerUser(@RequestParam String email,
									    		  @RequestParam String password,
										          @RequestParam String userName,
										          @RequestParam String nickname,
										          @RequestParam byte[] userProfile,
										          @RequestParam String userAddress, 
												  @RequestParam String userIntroduction, 
												  @RequestParam String user_role
												  ) {
        SwithUser swithUser = SwithUser.builder()
        		.email(email)
        		.password(password)
                .username(userName)
                .nickname(nickname)
                .user_profile(userProfile)
                .useraddress(userAddress)
                .user_introduction(userIntroduction)
                .user_role(user_role)
                .build();

        SwithUser registeredUser = userService.signUpUser(swithUser);
        
        
        return ResponseEntity.ok()
                .body(new MsgEntity("Success", registeredUser));
       
        /* String redirectUrl = request.getContextPath() + "/";
        MsgEntity responseMsg = new MsgEntity("Success", registeredUser, redirectUrl);

        return ResponseEntity.ok()
                .body(responseMsg);
                */
    }
}
