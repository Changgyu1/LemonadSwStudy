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
import lm.swith.main.model.StudyPost;

@Service
public class AlarmService {
	
	@Autowired
	private AlarmMapper alarmMapper;
	
	@Autowired
	private StudyPostMapper studyPostMapper;
	
	
	public void InsertAlarm(Alarm alarm) {
		alarmMapper.insertAlarm(alarm);
	}
	
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
	
	// 알람 삭제
	public void deleteAlarm(Long alarm_no) {
		alarmMapper.deleteAlarm(alarm_no);
	}
	
}