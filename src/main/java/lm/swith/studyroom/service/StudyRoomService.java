package lm.swith.studyroom.service;

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

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lm.swith.main.mapper.StudyPostMapper;
import lm.swith.main.model.StudyApplication;
import lm.swith.main.model.StudyPost;
import lm.swith.main.service.StudyPostService;
import lm.swith.studyroom.mapper.StudyRoomMapper;
import lm.swith.studyroom.model.MessageRequestDto;
import lm.swith.studyroom.model.StudyMoment;
import lm.swith.studyroom.model.StudyRoomNotice;
import lm.swith.studyroom.model.Todo;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudyRoomService {

    private final StudyRoomMapper studyRoomMapper;
    private final StudyPostMapper studyPostMapper;
    private final StudyPostService studyPostService;

    // 
    public List<StudyApplication> StudyRoomParticipant(Long post_no) {
        return studyPostMapper.getAllApplicantsByPostNoStudyRoom(post_no);
    }

    // Moment Insert
    public void createStudyMoment(StudyMoment studyMoment) throws IOException {
        if (studyMoment.getImg() != null && !studyMoment.getImg().isEmpty()) {
            String imageData = studyMoment.getImg().split(",")[1];
            byte[] imageBytes = Base64.getDecoder().decode(imageData);

            ByteArrayInputStream bis = new ByteArrayInputStream(imageBytes);
            BufferedImage originalImage = ImageIO.read(bis);
            bis.close();

            int newWidth = 500;
            int newHeight = (int) (originalImage.getHeight() * (1.0 * newWidth / originalImage.getWidth()));
            BufferedImage resizedImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_ARGB);
            resizedImage.getGraphics().drawImage(originalImage, 0, 0, newWidth, newHeight, null);

            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            ImageIO.write(resizedImage, "png", bos);
            byte[] compressedImageBytes = bos.toByteArray();
            bos.close();
            studyMoment.setMoment_picture(compressedImageBytes);
        }
        studyRoomMapper.createStudyMoment(studyMoment);
    }

    public List<StudyMoment> findByStudyMoment(Long post_no) {
        return studyRoomMapper.findByStudyMoment(post_no);
    }

    public void deleteStudyMoment(Long moment_no, Long user_no) {
        studyRoomMapper.deleteStudyMoment(moment_no, user_no);
    }

    public List<StudyPost> selectStudyRoomEnd() {
        return studyPostMapper.selectStudyRoomEnd();
    }

    public void deleteStudyRoomByPostNo(Long post_no) {
        studyRoomMapper.deleteMessagePostNo(post_no);
        studyRoomMapper.deleteStudyMomentPostNo(post_no);
        studyRoomMapper.deleteStudyRoomNoticeByPostNo(post_no);
    }

    public void createStudyRoomNotice(StudyRoomNotice studyRoomNotice) {
        studyRoomMapper.createStudyRoomNotice(studyRoomNotice);
    }

    public List<StudyRoomNotice> findByStudyNoticeWithNickname(Long post_no) {
        return studyRoomMapper.findByStudyNoticeWithNickname(post_no);
    }

    public void deleteStudyRoomNotice(Long notice_no, String notice_password) {
        studyRoomMapper.deleteStudyRoomNotice(notice_no, notice_password);
    }

    public void createTodoList(Todo todo) {
        studyRoomMapper.createTodoList(todo);
    }

    public List<Todo> getTodoList(Long post_no, Date todo_date) {
        return studyRoomMapper.getTodoList(post_no, todo_date);
    }

    public void updateTodoList(Long post_no, Long id, Date todo_date, String todo_list) {
        studyRoomMapper.updateTodoList(post_no, id, todo_date, todo_list);
    }

    public void deleteTodoList(Long post_no, Long id, Date todo_date) {
        studyRoomMapper.deleteTodoList(post_no, id, todo_date);
    }

    public List<MessageRequestDto> getMessagesByPostNo(Long post_no) {
        return studyRoomMapper.selectMessagesByPostNo(post_no);
    }

    public StudyPost getStudyRoomTitle(Long post_no) {
        return studyRoomMapper.getStudyRoomTitle(post_no);
    }

    public void updateStudyRoomTitle(Long post_no, Long user_no, String study_title) {
        studyRoomMapper.updateStudyRoomTitle(post_no, user_no, study_title);
    }

    public void handleStudyRoomEnd() {
        List<StudyPost> RoomEndInfo = selectStudyRoomEnd();
        LocalDateTime now2 = LocalDateTime.now();
        LocalDate now = now2.toLocalDate();
        for (StudyPost post : RoomEndInfo) {
            if (post.getStudyroomend() != null) {
                LocalDateTime roomEndDateTime = LocalDateTime.parse(post.getStudyroomend(), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                LocalDate roomEnd = roomEndDateTime.toLocalDate();
                int comparison = roomEnd.compareTo(now);
                if (comparison == 0) {
                    deleteStudyRoomByPostNo(post.getPost_no());
                    studyPostService.deleteStudyPost(post.getPost_no());
                }
            }
        }
    }
  //Chatting
  	@Transactional // INSERT
  	public void saveChatMessage(MessageRequestDto chatmessage) {
  		System.out.println("실행되었나요? Service");
  		studyRoomMapper.insertMessage(chatmessage);
  	}
  	

}
