package lm.swith.alarm.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lm.swith.alarm.mapper.AlarmMapper;
import lm.swith.alarm.model.Alarm;
import lm.swith.main.mapper.StudyPostMapper;
import lm.swith.main.model.Likes;
import lm.swith.main.model.StudyApplication;
import lm.swith.main.model.StudyPost;
import lm.swith.user.mapper.UsersMapper;
import lm.swith.user.model.SwithUser;

@Service
public class AlarmService {
	
	@Autowired
	private AlarmMapper alarmMapper;
	
	@Autowired
	private StudyPostMapper studyPostMapper;
	
	@Autowired
	private UsersMapper userMapper;
	
	public List<Alarm> getAlarmByUserNo(Long user_no){
		return alarmMapper.getAlarmByUserNo(user_no);
	}
	
	// 찜한 사람 알람 보내주기(마감기한 7일전알람)
	public void isLikeAlarm(Long post_no) {
	    List<Likes> LikesInfo = studyPostMapper.alarmLikeInfo(post_no);
	    StudyPost postData = studyPostMapper.selectUserNoByPostNo(post_no);
	    Alarm alarm = new Alarm();

	    DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
	    DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
	    
	    for (Likes info : LikesInfo) {
	        LocalDateTime recruitDeadline = LocalDateTime.parse(postData.getRecruit_deadline(), dateTimeFormatter);
	        String formattedDate = recruitDeadline.format(dateFormatter);
	        String alarm_message = "찜하신 " + postData.getStudy_title() + "의 게시글이 " + formattedDate + " 마감됩니다.";
	        if(!alarmMapper.AlarmByData(info.getUser_no(), info.getPost_no(), alarm_message)) {
		        alarm.setPost_no(info.getPost_no());
		        alarm.setUser_no(info.getUser_no());
		        alarm.setAlarm_message(alarm_message);
		        alarmMapper.insertAlarm(alarm);
	        }    
	    }
	}
	
	// 마감기한 지난 스터디 상태 변경 시 알람 보내기
	public void sendStudyEndAlarms(List<StudyApplication> userNumber, StudyPost post) {
		Alarm alarm = new Alarm();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		String alarm_message;
		
		for (StudyApplication stap : userNumber) { 
			alarm_message = post.getStudy_title() + "의 " + post.getRecruit_deadline() + "이 지나 스터디방이 활성화 됩니다.";
			if (!alarmMapper.AlarmByData(stap.getUser_no(), post.getPost_no(), alarm_message)) {
				alarm.setPost_no(post.getPost_no()); // postNo주입
				alarm.setAlarm_message(alarm_message);
				alarm.setUser_no(stap.getUser_no()); // 신청자의 user_no 설정
				alarmMapper.insertAlarm(alarm);
			}
		}
	}
	
	// 스터디 신청 알람
	public void sendApplicationAlarm(Long post_no, Long user_no) {
		Alarm alarm = new Alarm();
	    StudyPost userNumber = studyPostMapper.selectUserNoByPostNo(post_no);
	    alarm.setUser_no(userNumber.getUser_no()); // 게시글 작성자에게 보내줌
	    alarm.setPost_no(post_no); // 어떤 게시물에 대한건지 
	    SwithUser userNickName = userMapper.findByUserNo(user_no); // 신청자의 닉네임 가져오기
	    String alarm_message = userNickName.getNickname() + "님이 참가 신청 하였습니다."; // 누가 신청했는지 메세지 설정
	    alarm.setAlarm_message(alarm_message);
	    alarmMapper.insertAlarm(alarm);
	}
	
	// 스터디 신청 상태 업데이트 알람
	public void sendApplicantsStatusUpdateAlarm(Long user_no, Long post_no, boolean accept) {
		Alarm alarm = new Alarm();
		alarm.setPost_no(post_no);
		alarm.setUser_no(user_no);
		StudyPost studyPostInfo = studyPostMapper.selectUserNoByPostNo(post_no);
		
		try {   
			if (accept) { // accept가 true라면 승인 
				studyPostMapper.acceptApplicant(post_no, user_no);
				alarm.setAlarm_message(studyPostInfo.getStudy_title() + "의 참가 신청 되었습니다.");
				alarmMapper.insertAlarm(alarm);
			} else {
				studyPostMapper.deleteApplicant(post_no, user_no);
				alarm.setAlarm_message(studyPostInfo.getStudy_title() + "의 참가 거절 되었습니다.");
				alarmMapper.insertAlarm(alarm);
			}
		} catch (Exception e) {
			throw new RuntimeException(e.getMessage());
		}
	}
	
	
	
	
	// 알람 삭제
	public void deleteAlarm(Long alarm_no) {
		alarmMapper.deleteAlarm(alarm_no);
	}
	
}