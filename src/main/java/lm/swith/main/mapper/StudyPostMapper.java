package lm.swith.main.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import lm.swith.main.model.Cafes;
import lm.swith.main.model.Comments;
import lm.swith.main.model.Likes;
import lm.swith.main.model.PostTechStacks;
import lm.swith.main.model.Skill;
import lm.swith.main.model.StudyApplication;
import lm.swith.main.model.StudyPost;
import lm.swith.user.model.SwithUser;

@Mapper
public interface StudyPostMapper {
	
	//Main Part =============================================================================
	// 스터디 목록
	List<StudyPost> getAllStudyPostWithSkills();
	
	// 스터디 조건 검색
	List<StudyPost> getStudiesBySelect(Map<String, Object> params);
	
	
	// 스터디 제목+내용 검색
	List<StudyPost> getStudiesByKeyword(String keyword);
	
	
	// 스터디 등록
    void insertStudyPost(StudyPost studyPost);
    void insertPostTechStacks(PostTechStacks postTechStacks);
   
    void insertSkill(List<Skill> skill);
    void insertStudyApplication(StudyApplication studyApplication);

	// 카페 목록
	List<Cafes> getAllCafes(String bplcnm, String sitewhladdr, String x, String y);

	// 스터디 게시글 작성 내 카페 검색
	List<Cafes> searchCafes(String keyword);
	
	// 마감 기한 지난 스터디 목록
	List<StudyPost> findExpiredStudyStatus();
		
	// 마감 기한 지난 스터디 상태 업데이트
	void updateStudyStatus();
	
	// Study Likes==================================================================================================================================================
		// 스터디 찜
		void addLikes (Likes likes);
		
		//스터디 찜 목록
		List<Likes> getLikesList();
		
		// 스터디 찜 목록
		List<Likes> isLiked (@Param("post_no") Long post_no, @Param("user_no") Long user_no);
		
		// 스터디 찜 삭제
		void deleteLikes (@Param("post_no") Long post_no, @Param("user_no") Long user_no);
		
		// 스터디 찜 삭제(post_no)기준
		void deleteLikesByPostNo(Long post_no);
		// 스터디 찜 카운트
		int likesCount(Long post_no);
	

	// My page Part=================================================================================================================================================
		// 마이페이지 내가 쓴 게시물 목록 OK
		List<StudyPost> getOwnStudiesWithUserNo(@Param("user_no") Long user_no);
		
		// 마이페이지 찜한 게시물 목록
		List<StudyPost> getAllStudiesWithLikes(@Param("user_no") Long user_no);
		
		// 내가 참여한 스터디 목록 OK
		List<StudyPost> getAllStudiesWithUserNo(@Param("user_no") Long user_no);
		
		

	// Detail Part==================================================================================================================================================
		// 스터디 상세 페이지 OK
		StudyPost getStudyPostByPostNo(@Param("post_no") Long post_no);
		
		// 스터디 수정
		
				void deletePostTechStacksUpdate(PostTechStacks postTechStacks);
//				void updateSkill(List<Skill> skill);
//				void upadateStudyApplication(StudyApplication studyApplication);
				void deletePostLikes(@Param("post_no") Long post_no);
//				void insertPostTechStacksUpdate(PostTechStacks postTechStacks);
//				void updateStudyPostUser(@Param("user_no") Long user_no);
				void updateStudyPost (StudyPost studyPost);
				void studyApplicationUpdate(Long user_no, Long post_no, int max_study_applicants);
		

		
		// 스터디 삭제 OK
		void deleteStudyPost (@Param("post_no") Long post_no);
		// 스터디방 삭제를 위한 삭제OK(자동삭제)
		void deleteStudyPostEnd(Long post_no);
		
		// 스터디에 달린 모든 댓글 삭제
		void deleteComments(@Param("post_no") Long post_no);
		
		// 스터디 모든 지원자들 삭제
		void deleteStudyApplication(@Param("post_no") Long post_no);
		
		// 스터디 기술스텍 삭제
		void deletePostTechStacks(@Param("post_no") Long post_no);

	
	
		

	// Study Application Part======================================================================================================================================
		// 스터디 신청
		void addUsersByPostNo (Long post_no, Long user_no);
		
		// 스터디 신청 목록 OK
		List<StudyApplication> getAllApplicantsByPostNo(Long post_no);
		
	    // 스터디 승인 인원 카운트
	    int getAcceptedApplicants (Long post_no);

	    // 스터디 최대 인원 조회
	    int getMaxApplicants(Long post_no);
	    
		// 스터디 승인
		void acceptApplicant (@Param("post_no") Long post_no, @Param("user_no") Long user_no);
		
		// 스터디 거절
		void deleteApplicant (@Param("post_no") Long post_no, @Param("user_no") Long user_no);
		
		// 스터디 확정 멤버
		List<StudyApplication> getAllMembersByPostNo(@Param("post_no") Long post_no);
		
		// 내가 참여한 스터디 목록 OK
		List<StudyApplication> getAllApplicantsByPostNoStudyRoom(Long user_no);



	// Comment Part
		// 댓글 등록
		void insertComment (Comments comments);
		
		// 댓글 목록
		List<Comments> getCommentsByPostNo(@Param("post_no") Long post_no);
		
		// 댓글 수정
		void updateComment (Long post_no, Long user_no , Long comment_no, String comment_content);
		
		// 댓글 삭제
		void deleteComment(@Param("post_no") Long post_no, @Param("user_no") Long user_no, @Param("comment_no") Long comment_no);


		// 메인페이지 댓글 갯수
		List<Comments> getCommentList();
		
	// Profile Part================================================================================================================================================
		// 유저 프로필 확인 OK
		SwithUser getUserByUserNo (@Param("user_no") Long user_no);
		
		
	// Admin part =================================================================================================================================================
		// 닉네임으로 게시글 검색
		List<StudyPost> getStudiesByNickname(String nickname);
		
		// 닉네임으로 댓글 검색
		List<Comments> getCommentsByNickname(String nickname);
		
		// 유저 리스트
		List<SwithUser> getAllUserList(String nickname);
		
		// 유저 삭제		
		void deleteUserComment(@Param("user_no") Long user_no);
		void deleteUserStudyApplication(@Param("user_no") Long user_no);
		void deleteUserPostTechStacks(@Param("user_no") Long user_no);
		void deleteUserLikes(@Param("user_no") Long user_no);
		void deleteUserMoment(@Param("user_no") Long user_no);
		void deleteUserRoomNotice(@Param("user_no") Long user_no);
//		void deleteUserMystudiesByUserNo(@Param("user_no") Long user_no);
		void deleteUserStudyPost(@Param("user_no") Long user_no);
		void deleteUser(@Param("user_no") Long user_no);
		
		
		
		// 게시글 작성자의 user_no 찾기
		StudyPost selectUserNoByPostNo(Long post_no);
		
		// 알람(찜한사람)
		List<Likes> alarmLikeInfo(Long post_no);
		
		// 스터디방 종료날짜 선언
		void updateStudyRoomEnd(Long post_no, String studyroomend);
		// 스터디방 종료날짜 조회
		List<StudyPost> selectStudyRoomEnd();
	
	}

