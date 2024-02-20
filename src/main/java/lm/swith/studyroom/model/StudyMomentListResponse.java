package lm.swith.studyroom.model;

import java.util.List;

import lombok.*;
@Getter
@Setter
public class StudyMomentListResponse {
	private List<StudyMoment> moment;

    public StudyMomentListResponse(List<StudyMoment> moments) {
        this.moment = moment;
    }
}
