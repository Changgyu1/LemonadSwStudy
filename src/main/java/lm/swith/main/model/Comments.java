package lm.swith.main.model;

import java.sql.Date;

import lm.swith.user.model.SwithUser;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Comments {
	private Long comment_no;
	private Long user_no;
	private Long post_no;
	private byte[] user_profile;
	private String nickname;
	private String comment_content;
	private Date comment_post_time;
	
	private SwithUser user;

}