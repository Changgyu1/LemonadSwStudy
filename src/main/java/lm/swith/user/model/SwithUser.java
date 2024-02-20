package lm.swith.user.model;
import java.sql.Blob;

import lm.swith.main.model.StudyPost;
/*
 USER_NO -> userNO
 USER_ID ->userID
 USER_PASSWORD ->password
 USER_NAME ->userName
 USER_NICKNAME->userNickname
 USER_PROFILE->userProfile
 USER_ADDRESS ->userAddress
 USER_INTRODUCTION
 USER_ROLE ->role
 * */
import lombok.*;

@Builder
@Getter
@Setter
public class SwithUser {
	private Long user_no; //sequence
	private String email; //email
	private String password;//pw
	private String username;//real name
	private String nickname;//nickname
	private byte[] user_profile;//profile img
	private String img;
	private String useraddress;//address
	private String user_introduction;//introduction
	private String user_role;// authorization(user / admin) kakao,github
	private String signout; // manage signout
	
	private StudyPost studyPost;
	
	public SwithUser() {};
	
	
	public SwithUser(Long user_no, String email, String password, String username, String nickname,
			byte[] user_profile,String img, String useraddress, String user_introduction, String user_role,String signout,StudyPost studyPost) {
				this.user_no = user_no;
				this.email = email;
				this.password = password;
				this.username = username;
				this.nickname = nickname;
				this.user_profile = user_profile;
				this.img = img;
				this.useraddress = useraddress;
				this.user_introduction = user_introduction;
				this.user_role = user_role;
				this.signout=signout;
				this.studyPost = studyPost;
		}

}
