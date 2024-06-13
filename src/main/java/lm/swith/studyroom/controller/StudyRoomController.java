package lm.swith.studyroom.controller;

import java.io.IOException;
import java.sql.Date;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
//@CrossOrigin(origins = "http://localhost:8080")
@CrossOrigin(origins = "http://lemonadswith.store:8080")
public class StudyRoomController {
    private final StudyRoomService studyRoomService;
    private final StudyPostService studyPostService;

    @PostMapping("/create/StudyNotice/{post_no}")
    public ResponseEntity<?> createStudyRoomNotice(@PathVariable Long post_no, @RequestBody StudyRoomNotice notice) {
        studyRoomService.createStudyRoomNotice(notice);
        return ResponseEntity.ok("Study room notice created successfully");
    }

    @GetMapping("/select/StudyNotice/{post_no}")
    public ResponseEntity<List<StudyRoomNotice>> findByStudyRoomNotice(@PathVariable Long post_no) {
        List<StudyRoomNotice> notices = studyRoomService.findByStudyNoticeWithNickname(post_no);
        return notices.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(notices);
    }

    @PostMapping("/delete/StudyNotice/{post_no}")
    public ResponseEntity<?> deleteStudyRoomNotice(@PathVariable Long post_no, @RequestBody StudyRoomNotice notice) {
        studyRoomService.deleteStudyRoomNotice(notice.getNotice_no(), notice.getNotice_password());
        return ResponseEntity.ok("Study room notice deleted successfully");
    }

    @PostMapping("/create/StudyMoment/{post_no}")
    public ResponseEntity<?> createStudyMoment(@PathVariable Long post_no, @RequestBody StudyMoment studyMoment) throws IOException {
        studyRoomService.createStudyMoment(studyMoment);
        return ResponseEntity.ok("Study moment created successfully");
    }

    @GetMapping("/select/StudyMoment/{post_no}")
    public ResponseEntity<?> findByStudyMoment(@PathVariable Long post_no) {
        List<StudyMoment> moments = studyRoomService.findByStudyMoment(post_no);
        return moments.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(moments);
    }

    @PostMapping("/delete/StudyMoment/{post_no}")
    public ResponseEntity<?> deleteStudyMoment(@PathVariable Long post_no, @RequestBody StudyMoment moment) {
        studyRoomService.deleteStudyMoment(moment.getMoment_no(), moment.getUser_no());
        return ResponseEntity.ok("Study moment deleted successfully");
    }

    @PostMapping("/create/Todo/{post_no}")
    public ResponseEntity<Todo> createTodoList(@PathVariable Long post_no, @RequestBody Todo todo) {
        studyRoomService.createTodoList(todo);
        return ResponseEntity.ok(todo);
    }

    @GetMapping("/get/Todo/{post_no}/{todo_date}")
    public ResponseEntity<List<Todo>> getTodoList(@PathVariable Long post_no, @PathVariable Date todo_date) {
        List<Todo> todoList = studyRoomService.getTodoList(post_no, todo_date);
        return todoList.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(todoList);
    }

    @PostMapping("/update/Todo/{post_no}/{id}")
    public ResponseEntity<?> updateTodoList(@PathVariable Long post_no, @PathVariable Long id, @RequestParam Date todo_date, @RequestParam String todo_list) {
        studyRoomService.updateTodoList(post_no, id, todo_date, todo_list);
        return ResponseEntity.ok("Todo list updated successfully");
    }

    @PostMapping("/studyRoom/delete/Todo/{post_no}/{id}")
    public ResponseEntity<?> deleteTodoList(@PathVariable Long post_no, @PathVariable Long id, @RequestParam Date todo_date) {
        studyRoomService.deleteTodoList(post_no, id, todo_date);
        return ResponseEntity.ok("Todo list deleted successfully");
    }

    @GetMapping("/post/{post_no}")
    public ResponseEntity<List<MessageRequestDto>> getInitialMessages(@PathVariable Long post_no) {
        List<MessageRequestDto> initialMessages = studyRoomService.getMessagesByPostNo(post_no);
        return ResponseEntity.ok(initialMessages);
    }

    @GetMapping("/Participant/{post_no}")
    public ResponseEntity<List<StudyApplication>> getParticipantStudyRoom(@PathVariable Long post_no) {
        List<StudyApplication> studyApplications = studyRoomService.StudyRoomParticipant(post_no);
        return studyApplications.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(studyApplications);
    }

    @GetMapping("/create/Title/{post_no}")
    public ResponseEntity<StudyPost> getStudyRoomTitle(@PathVariable Long post_no) {
        StudyPost studyPost = studyRoomService.getStudyRoomTitle(post_no);
        return ResponseEntity.ok(studyPost);
    }

    @PostMapping("/update/Title/{post_no}")
    public ResponseEntity<?> updateStudyRoomTitle(@PathVariable Long post_no, @RequestParam Long user_no, @RequestParam String study_title) {
        studyRoomService.updateStudyRoomTitle(post_no, user_no, study_title);
        return ResponseEntity.ok("Study room title updated successfully");
    }

    @GetMapping("/RoomEnd")
    public ResponseEntity<?> selectStudyRoomEnd() {
        studyRoomService.handleStudyRoomEnd();
        return ResponseEntity.ok("Processed study room end");
    }
}
