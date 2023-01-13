import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { QuizRoutingModule } from './quiz-routing.module'
import { QuizStoreService } from './services/store.service'
import { OpenPlainCkEditorComponent } from './shared/components/open-plain-ck-editor/open-plain-ck-editor.component'
import { QuizQusetionsComponent } from './components/quiz/quiz-questions/quiz-questions.component'
import { StarRatingQuestionComponent } from './components/star-rating-question/star-rating-question.component'
import { TextareaQuestionComponent } from './components/textarea-question/textarea-question.component'
import { RomanConvertPipe } from './shared/roman-convert.pipe'
// import { QuestionEditorSidenavComponent } from './shared/components/question-editor-sidenav/question-editor-sidenav.component'
import { QuestionEditorComponent } from './components/question-editor/question-editor.component'
import { FillUpsEditorComponent } from './components/fill-ups-editor/fill-ups-editor.component'
import { MultipleChoiceQuestionComponent } from './components/multiple-choice-question/multiple-choice-question.component'
import { MatchTheFollowingComponent } from './components/match-the-following/match-the-following.component'
import { QuizComponent } from './components/quiz/quiz.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import {
  MatIconModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatGridListModule, MatStepperModule,
  MatTabsModule, MatButtonModule, MatButtonToggleModule, MatCardModule, MatMenuModule, MatCheckboxModule,
  MatSidenavModule, MatAutocompleteModule, MatDialogModule, MatTooltipModule, MatExpansionModule, MatListModule,
  MatSnackBarModule, MatSelectModule, MatChipsModule, MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule,
  MatSlideToggleModule, MatTreeModule, MatRadioModule, MatProgressBarModule,
} from '@angular/material'
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component'

@NgModule({
  declarations: [
    QuizComponent,
    QuizQusetionsComponent,
    QuestionEditorComponent,
    MatchTheFollowingComponent,
    MultipleChoiceQuestionComponent,
    FillUpsEditorComponent,
    // QuestionEditorSidenavComponent,
    OpenPlainCkEditorComponent,
    RomanConvertPipe,
    StarRatingQuestionComponent,
    TextareaQuestionComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatStepperModule,
    MatTabsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatMenuModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatTooltipModule,
    MatExpansionModule,
    MatListModule,
    MatSnackBarModule,
    MatSelectModule,
    MatChipsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatTreeModule,
    MatRadioModule,
    MatProgressBarModule,
    // SharedModule,
    DragDropModule,
    QuizRoutingModule,
  ],
  providers: [QuizStoreService],
  entryComponents: [ConfirmDialogComponent],
  exports: [
    QuizComponent,
    QuizQusetionsComponent,
    MultipleChoiceQuestionComponent,
    FillUpsEditorComponent,
    MatchTheFollowingComponent,
    StarRatingQuestionComponent,
    TextareaQuestionComponent,
  ],
})
export class QuizModule { }
