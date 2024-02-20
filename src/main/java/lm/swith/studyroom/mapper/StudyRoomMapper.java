package lm.swith.studyroom.mapper;

import java.sql.Date;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import lm.swith.main.model.StudyPost;
import lm.swith.studyroom.model.MessageRequestDto;
import lm.swith.studyroom.model.StudyMoment;
import lm.swith.studyroom.model.StudyRoomNotice;
import lm.swith.studyroom.model.Todo;

@Mapper
public interface StudyRoomMapper {
//  StudyRoomNotice Mapper 
	// INSERT
	void createStudyRoomNotice(StudyRoomNotice studyRoomNotice);
	
	// SELECT
	List<StudyRoomNotice> findByStudyNoticeWithNickname(Long post_no);
	
	//DELETE
	void deleteStudyRoomNotice(Long notice_no, String notice_password);
	
	
// StudyMoment Mapper
	// INSERT
	void createStudyMoment(StudyMoment studyMoment);
	
	// SELECT
	List<StudyMoment> findByStudyMoment(Long post_no); //생각해보기
	
	//DELETE
	void deleteStudyMoment(Long moment_no, Long user_no);//생각해보기
	
	
// Chatting
	
	void insertMessage(MessageRequestDto chatMessage);

	List<MessageRequestDto> selectMessagesByPostNo(Long post_no);
    
	//calendar & TodoList
	void createTodoList(Todo todo); //insert
	List<Todo> getTodoList(Long post_no, Date todo_date); // select
	void updateTodoList(Long post_no,Long id,Date todo_date, String todo_list);//update
	void deleteTodoList(Long post_no, Long id, Date todo_date);//delete
	

//title
	//SELECT
	StudyPost getStudyRoomTitle(Long post_no);
	
	//UPDATE
	void updateStudyRoomTitle(Long post_no,Long user_no, String study_title); //update는 void나 int형식으로 반환해야함

// StudyRoom 종료 후 스터디 방 삭제를 위한 DELETE
		void deleteMessagePostNo(Long post_no);
		void deleteTodoListPostNo(Long post_no);
		void deleteStudyMomentPostNo(Long post_no);
		void deleteStudyRoomNoticeByPostNo(Long post_no);
		
		

}



	
	
	
