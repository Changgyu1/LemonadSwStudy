package lm.swith.alarm.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lm.swith.alarm.model.Alarm;
import lm.swith.alarm.service.AlarmService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:8080")
@CrossOrigin(origins = "http://lemonadswith.store:8080")
public class AlarmController {
	private final AlarmService alarmService;
	
	
	@GetMapping("/alarm_List/{user_no}")
	public ResponseEntity<?> getAlarmByUserNo(@PathVariable("user_no") Long user_no){
		List<Alarm> alarm = alarmService.getAlarmByUserNo(user_no);
		return ResponseEntity.ok(alarm);		
	}
	

	// 알람 삭제
	@PostMapping("/alarmDelete/{alarm_no}")
	public ResponseEntity<?> deleteAlarm(@PathVariable("alarm_no") Long alarm_no){
		System.out.println(alarm_no + "알람 번호 확인");
		alarmService.deleteAlarm(alarm_no);
		return ResponseEntity.ok("success");
	}
}