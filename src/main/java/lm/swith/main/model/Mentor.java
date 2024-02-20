package lm.swith.main.model;

import lombok.*;

@Getter @Setter
public class Mentor {
	private Long mentor_no;
	private Long user_no;
	private Long post_no;
	private int max_mentor_applicants;
	private int mentor_join_member;
	private String mentor_status;
}