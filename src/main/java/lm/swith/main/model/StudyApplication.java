package lm.swith.main.model;

import lombok.*;

@Getter @Setter
public class StudyApplication { // 스터디 신청 현황 테이블
	private Long post_no;
	private Long user_no;
	private String nickname;
	private String status;
	private int max_study_applicants;
	private int accepted_applicants;
	private byte[] user_profile;//profile img
	private String img;
	
}