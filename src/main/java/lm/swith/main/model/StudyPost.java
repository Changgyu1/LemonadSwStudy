package lm.swith.main.model;


import java.sql.Timestamp;
import java.util.List;

import lm.swith.user.model.SwithUser;
import lombok.Getter;
import lombok.Setter;


@Getter @Setter
public class StudyPost { 
	private Long post_no;
	private Long user_no;
	private Long comment_no;
	private String nickname;
	private byte[] user_profile;
	private String study_title;
	private String study_content;
	private String study_method; // 스터디 방식 (오프라인/온라인/온.오프라인)
	private String recruit_type; // 모집 타입 (스터디/프로젝트/멘토멘티)
	private String study_period; // 스터디 기간
	private String study_start; // 스터디 시작일
	private String recruit_deadline; // 스터디 모집 마감일
	private String study_status; // 스터디 상태 (활성화 O /비활성화 X)
	private String study_location; // 스터디 진행 구역
	private String first_study; // 스터디 첫 모임 장소
	private Timestamp study_post_time; // 스터디 게시글 입력일
	// 스터디 게시글 ===================== 여기까지 Study_Post 테이블 칼럼
	
    private int mentor_count; // mentor에서 status가 '승인'인 user count
    private int mentee_count; // mentee에서 status가 '승인'인 user count
    private int application_count; // study_application에서 status가 '승인'인 user count
    private int max_study_applicants;
    private int likes_count; // likes count
    private List<Long> skills; // 스터디 내 기술들 담을 곳
    private List<PostTechStacks> postTechStacks; 
    
    private Long skill_no;
    private String study_likes;
    private String skill_name; // join 했을 때 skill 이름 받을 곳
    private String skill_img; // join 했을 때 skill img 받을 곳
	
	private List<Skill> studyPostWithSkills; // 같은 post_no 와 함께있는 skill_no 리스트로 저장
	private List<Comments> comments; // 댓글들 담을 곳
	
	private SwithUser user; // 유저 테이블
	private Likes likes; // 찜 테이블
	
    private Mentor mentor; // 멘토 테이블
    private Mentee mentee; // 멘티 테이블
    private StudyApplication studyApplication; // 스터디 참가 현황 테이블
    
    private String studyroomend;
    
}