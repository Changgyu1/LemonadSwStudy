package lm.swith.studyroom.model;



import java.sql.Date;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StudyMoment {
	private Long moment_no;
	private Long post_no;
	private Long user_no;
	private byte[] moment_picture;
	private String img;
	private String moment_title;
	private String nickname;
	private Date moment_post_date;
	
}


