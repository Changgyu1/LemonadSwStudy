package lm.swith.studyroom.model;



import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StudyRoomNotice {
	private Long notice_no;
	private Long post_no;
	private Long user_no;
	private String nickname;
	private String notice_title;
	private String notice_content;
	private String notice_password;
	private Date notice_post_date;
	

}