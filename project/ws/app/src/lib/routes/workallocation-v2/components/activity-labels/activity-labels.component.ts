import { Component } from '@angular/core'
import { CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'

@Component({
  selector: 'ws-app-activity-labels',
  templateUrl: './activity-labels.component.html',
  styleUrls: ['./activity-labels.component.scss'],
})
export class ActivityLabelsComponent {
  labels = [1];
  groups: number[] = [];
  drop(event: CdkDragDrop<number[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex)
    }
  }

  /** Predicate function that only allows even numbers to be dropped into a list. */
  evenPredicate(item: CdkDrag<number>) {
    // return item.data % 2 === 0
    if (item) {
      return true
    }
    return false
  }

  /** Predicate function that doesn't allow items to be dropped into a list. */
  noReturnPredicate() {
    return true
  }
  addNewLabel() {
    this.labels.push(this.labels[this.labels.length - 1] + 1)
  }
  addNewGroup() {
    if (this.groups.length > 0) {
      this.groups.push(this.groups[this.groups.length - 1] + 1)
    } else {
      this.groups.push(100)
    }
  }
}
