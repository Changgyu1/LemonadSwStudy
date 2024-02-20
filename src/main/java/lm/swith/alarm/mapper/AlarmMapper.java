package lm.swith.alarm.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import lm.swith.alarm.model.Alarm;

@Mapper
public interface AlarmMapper {

	void insertAlarm(Alarm alarm); 
	
	Alarm getAlarmByUserNo(Long user_no);
	
	boolean  AlarmByData(Long user_no, Long post_no, String alarm_message);
	
	void deleteAlarm(Long alarm_no);
	
	// post_no 기준 알람 삭제
	void deleteAlarmBypost_no(Long post_no);
}