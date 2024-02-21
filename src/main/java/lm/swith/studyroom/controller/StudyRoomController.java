package lm.swith.studyroom.controller;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;

import javax.imageio.ImageIO;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lm.swith.main.model.StudyApplication;
import lm.swith.main.model.StudyPost;
import lm.swith.main.service.StudyPostService;
import lm.swith.studyroom.model.MessageRequestDto;
import lm.swith.studyroom.model.StudyMoment;
import lm.swith.studyroom.model.StudyRoomNotice;
import lm.swith.studyroom.model.Todo;
import lm.swith.studyroom.service.StudyRoomService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/studyRoom")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://lemonadswith.store:8080")
public class StudyRoomController {
	private final StudyRoomService studyRoomService;
	private final StudyPostService studyPostService;
	// StudyRoomNotice
	@PostMapping("/create/StudyNotice/{post_no}") // INSERT
	public ResponseEntity<?> createStudyRoomNotice(@PathVariable Long post_no, @RequestBody StudyRoomNotice notice) {

		System.out.println("getPost_no : " + notice.getPost_no());
		System.out.println("getUser_no : " + notice.getUser_no());
		System.out.println("getNotice_title : " + notice.getNotice_title());
		System.out.println("getNotice_content : " + notice.getNotice_content());
		System.out.println("getNotice_password : " + notice.getNotice_password());
		studyRoomService.createStudyRoomNotice(notice);
		return ResponseEntity.ok(studyRoomService);
	}

	@GetMapping("/select/StudyNotice/{post_no}")
	public ResponseEntity<List<StudyRoomNotice>> findByStudyRoomNotice(@PathVariable Long post_no) {
		System.out.println(post_no);
		 List<StudyRoomNotice> notice = studyRoomService.findByStudyNoticeWithNickname(post_no);
		 if (!notice.isEmpty()) {
		return ResponseEntity.ok(notice);
		 }else {
			 return ResponseEntity.noContent().build();
		 }
	}

	@PostMapping("/delete/StudyNotice/{post_no}")
	public ResponseEntity<?> deleteStudyRoomNotice(@PathVariable Long post_no, @RequestBody StudyRoomNotice notice) {
		
		 System.out.println("getPost_no : " + post_no);
		 System.out.println("getUser_no : " + notice.getUser_no());
		 
		 System.out.println("getNotice_title : " + notice.getNotice_title());
		 System.out.println("getNotice_content : " + notice.getNotice_content());
		 System.out.println("getNotice_post_date : " + notice.getNotice_post_date());
		 System.out.println("getNotice_password : " + notice.getNotice_password());
		 System.out.println("Notice_no : " + notice.getNotice_no());
		
		studyRoomService.deleteStudyRoomNotice(notice.getNotice_no(), notice.getNotice_password());
		return ResponseEntity.ok(notice);
	}

	// Study Moment
	@PostMapping("/create/StudyMoment/{post_no}") // INSERT
	public ResponseEntity<?> createStudyMoment(@PathVariable Long post_no, @RequestParam(value = "img", required = false) MultipartFile img,  @RequestBody StudyMoment studyMoment) throws IOException {
		{
	    	System.out.println("img" + studyMoment.getImg());
	    	System.out.println("=====");

				// resource 폴더에 경로를 읽는다
	        	System.out.println("null아님");
	        	String imageData = studyMoment.getImg().split(",")[1];
		        byte[] imageBytes = Base64.getDecoder().decode(imageData);//디코딩해서 blob 형태로 다시 넣어줌
		        
		     // BufferedImage로 이미지 읽기
		        ByteArrayInputStream bis = new ByteArrayInputStream(imageBytes);
		        BufferedImage originalImage = ImageIO.read(bis);
		        bis.close();

		        // 이미지 크기 조절 (예: 가로 100px로 조절)
		        int newWidth = 500;
		        int newHeight = (int) (originalImage.getHeight() * (1.0 * newWidth / originalImage.getWidth()));
		        BufferedImage resizedImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_ARGB);
		        resizedImage.getGraphics().drawImage(originalImage, 0, 0, newWidth, newHeight, null);

		        // 압축된 이미지를 Base64로 인코딩
		        ByteArrayOutputStream bos = new ByteArrayOutputStream();
		        ImageIO.write(resizedImage, "png", bos);
		        byte[] compressedImageBytes = bos.toByteArray();
		        bos.close();
		        studyMoment.setMoment_picture(compressedImageBytes);
	
	        
			
		studyRoomService.createStudyMoment(studyMoment);
		return ResponseEntity.ok("Success");
		}
		
	}//select
	@GetMapping("/select/StudyMoment/{post_no}")
	public ResponseEntity<?> findByStudyMoment(@PathVariable Long post_no) {
		
		List<StudyMoment> moment = studyRoomService.findByStudyMoment(post_no);
		
		if (!moment.isEmpty()) {
				return ResponseEntity.ok(moment);
				 }else {
					 return ResponseEntity.noContent().build();
				 }
	
	}
	//delete
	@PostMapping("/delete/StudyMoment/{post_no}")
	public ResponseEntity<?> deleteStudyMoment(@PathVariable Long post_no, @RequestBody StudyMoment moment){
		studyRoomService.deleteStudyMoment(moment.getMoment_no(), moment.getUser_no());
		return ResponseEntity.ok(moment);
	}
	
	
////Calendar &TodoList
	//TodoList Insert
	@PostMapping("/create/Todo/{post_no}")
	public ResponseEntity<Todo> createTodoList(@PathVariable Long post_no, @RequestBody Todo todo){
		studyRoomService.createTodoList(todo);
		return ResponseEntity.ok(todo);
	}
	
	//Select TodoList
	@GetMapping("/get/Todo/{post_no}/{todo_date}")
	public ResponseEntity<List<Todo>> getTodoList(@PathVariable Long post_no, @PathVariable Date todo_date){
		System.out.println(todo_date + " 날짜");
		List<Todo> todo = studyRoomService.getTodoList(post_no, todo_date);
		System.out.println(todo.toArray());
		 if (!todo.isEmpty()) {
				return ResponseEntity.ok(todo);
				 }else {
					 return ResponseEntity.noContent().build();
				 }
	}
	//Update TodoList
	@PostMapping("/update/Todo/{post_no}/{id}")
	public ResponseEntity<?>updateTodoList(@PathVariable Long post_no, @PathVariable Long id, @RequestParam Date todo_date, @RequestParam String todo_list){
		studyRoomService.updateTodoList(post_no,id,todo_date,todo_list);
		return ResponseEntity.ok("update Todo List Success");
	}
	
	//Delete TodoList
	@PostMapping("/studyRoom/delete/Todo/{post_no}/{id}")
	public ResponseEntity<?> deleteTodoList(@PathVariable Long post_no, @PathVariable Long id, @RequestParam Date params){
		studyRoomService.deleteTodoList(post_no, id, params);
		return ResponseEntity.ok("delete success");
	}
	
	// 채팅 SELECT
	@GetMapping("/post/{post_no}")
	public ResponseEntity<List<MessageRequestDto>> getInitialMessages(@PathVariable Long post_no) {
		System.out.println("성공적으로 불러옴!");
	    List<MessageRequestDto> initialMessages = studyRoomService.getMessagesByPostNo(post_no);
	    return ResponseEntity.ok(initialMessages);
	}
	
	//participants
	@GetMapping("/Participant/{post_no}")
	public ResponseEntity<List<StudyApplication>> getParticipantStudyRoom(@PathVariable Long post_no){
		List<StudyApplication> studyApplications = studyRoomService.StudyRoomParticipant(post_no);
		if (!studyApplications.isEmpty()) {
			return ResponseEntity.ok(studyApplications);
		}else {
			return ResponseEntity.noContent().build();
		}
	}
	
	//studyRoom Title select
	@GetMapping ("/create/Title/{post_no}")
	public ResponseEntity <StudyPost> getStudyRoomTitle(@PathVariable Long post_no){
		 StudyPost studyPost = studyRoomService.getStudyRoomTitle(post_no);
		return ResponseEntity.ok(studyPost);
	}
	//studyroom title update
	@PostMapping("/update/Title/{post_no}")
	public ResponseEntity <?> updateStudyRoomTitle(@PathVariable Long post_no, @RequestParam Long user_no, @RequestParam String study_title ){
		 System.out.println("getPost_no : " + post_no);
		 System.out.println("user no : " + user_no);
		studyRoomService.updateStudyRoomTitle(post_no, user_no, study_title);
		System.out.println("Success");
		return ResponseEntity.ok("Success");
	}
	@GetMapping("/RoomEnd") // 종료된 스터디룸 조회
	public ResponseEntity<?> selectStudyRoomEnd() {
		System.out.println("이건?");
		List<StudyPost> RoomEndInfo = studyRoomService.selectStudyRoomEnd();
		LocalDateTime now2 = LocalDateTime.now();
		LocalDate now = now2.toLocalDate();
		System.out.println("이건됨?");
		for (StudyPost post : RoomEndInfo) {
			if(post.getStudyroomend() != null) {
				System.out.println(post.getStudyroomend() + " : getStudyroomend");
				LocalDateTime roomEndDateTime = LocalDateTime.parse(post.getStudyroomend(), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
				LocalDate roomEnd = roomEndDateTime.toLocalDate();
				System.out.println(roomEnd + " : roomEnd 형식 출력보자");
				System.out.println(now + " : now 형식 출력보자");
			int comparison = roomEnd.compareTo(now);
			System.out.println(now + " : now");
			System.out.println(comparison + " : comparison");
			if (comparison == 0) {
				System.out.println("실행안되냐고 실행전?" + post.getPost_no());
				studyRoomService.deleteStudyRoomByPostNo(post.getPost_no());
			
				System.out.println("실행안되냐고?" + post.getPost_no());
				studyPostService.deleteStudyPost(post.getPost_no());
			}
			}
		}
		return ResponseEntity.ok("ok");
	}
	
	
	

}