package lm.swith.main.model;

import lombok.*;

@Getter @Setter
public class Users {
	private Long user_no;
	private String email;
	private String nickname;
	private String password;
	private String username;
	private byte[] user_profile;
	private String useraddress;
	private String user_introduction;
	private String user_role;
}