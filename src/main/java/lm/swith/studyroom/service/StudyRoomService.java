package lm.swith.studyroom.service;

import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lm.swith.main.mapper.StudyPostMapper;
import lm.swith.main.model.StudyApplication;
import lm.swith.main.model.StudyPost;
import lm.swith.studyroom.mapper.StudyRoomMapper;
import lm.swith.studyroom.model.MessageRequestDto;
import lm.swith.studyroom.model.StudyMoment;
import lm.swith.studyroom.model.StudyRoomNotice;
import lm.swith.studyroom.model.Todo;

@Service
public class StudyRoomService {
	
	@Autowired
	private StudyRoomMapper studyRoomMapper;
	@Autowired
	private StudyPostMapper studyPostMapper;
	
	// SELECT STUDYROOM Participant 
		public List<StudyApplication> StudyRoomParticipant(Long post_no){
			 return studyPostMapper.getAllApplicantsByPostNoStudyRoom(post_no);
	    }
		
	// StudyMomnet Service
	public void createStudyMoment(StudyMoment studyMoment) {
		studyRoomMapper.createStudyMoment(studyMoment);
	}
	
	public  List<StudyMoment> findByStudyMoment(Long post_no) {
		return studyRoomMapper.findByStudyMoment(post_no);
	}
	public void deleteStudyMoment(Long moment_no, Long user_no) {
		studyRoomMapper.deleteStudyMoment(moment_no, user_no);
	}
	 // 스터디방 종료날짜 조회
    public List<StudyPost> selectStudyRoomEnd() {
    	return studyPostMapper.selectStudyRoomEnd();
    }
    
	// StudyRoom 종료 후 스터디 방 삭제를 위한 DELETE
	public void deleteStudyRoomByPostNo(Long post_no) {
		// StudyRoom 종료 후 스터디 방 삭제를 위한 DELETE
		studyRoomMapper.deleteMessagePostNo(post_no);
		//studyRoomMapper.deleteTodoListPostNo(post_no);
		studyRoomMapper.deleteStudyMomentPostNo(post_no);
		studyRoomMapper.deleteStudyRoomNoticeByPostNo(post_no);
	}
	
	
	
	
	// StudyRoomNotice Service
	public void createStudyRoomNotice(StudyRoomNotice studyRoomNotice) {
		studyRoomMapper.createStudyRoomNotice(studyRoomNotice);
	}
	public List<StudyRoomNotice> findByStudyNoticeWithNickname(Long post_no){
		return studyRoomMapper.findByStudyNoticeWithNickname(post_no);
	}
	public void deleteStudyRoomNotice(Long notice_no, String notice_password) {
		studyRoomMapper.deleteStudyRoomNotice(notice_no, notice_password);
	}
	
	//Calendar, Todo
    public void createTodoList(Todo todo) {
    	studyRoomMapper.createTodoList(todo);
    }
    
    public List<Todo> getTodoList(Long post_no, Date todo_date){
    	return studyRoomMapper.getTodoList(post_no, todo_date);
    }
    
    public void updateTodoList(Long post_no,Long id, Date todo_date, String todo_list) {
    	studyRoomMapper.updateTodoList(post_no,id,todo_date,todo_list);
    }
    
    public void deleteTodoList(Long post_no, Long id, Date todo_date) {
    	studyRoomMapper.deleteTodoList(post_no, id, todo_date);
    }
	
//Chatting
	@Transactional // INSERT
	public void saveChatMessage(MessageRequestDto chatmessage) {
		System.out.println("실행되었나요? Service");
		studyRoomMapper.insertMessage(chatmessage);
	}
	
	// 채팅목록 (post_no)기준
    public List<MessageRequestDto> getMessagesByPostNo(Long post_no) {
        return studyRoomMapper.selectMessagesByPostNo(post_no);
    }
    
 //title
    public StudyPost getStudyRoomTitle(Long post_no) {
    	return studyRoomMapper.getStudyRoomTitle(post_no);
    }
    public void updateStudyRoomTitle(Long post_no, Long user_no, String study_title) {
    	studyRoomMapper.updateStudyRoomTitle(post_no, user_no,study_title);
    }
    
}