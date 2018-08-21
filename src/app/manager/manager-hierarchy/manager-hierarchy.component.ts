import { Component, OnInit } from '@angular/core';
import { DrakeStoreService } from '../../../../node_modules/@swimlane/ngx-dnd';

@Component({
  selector: 'app-manager-hierarchy',
  templateUrl: './manager-hierarchy.component.html',
  styleUrls: ['./manager-hierarchy.component.css']
})
export class ManagerHierarchyComponent implements OnInit {

  complex_object
  isActiveLink = 'manager'
  currentIndex = 0;
  showHide = true;
  managers =
    [
      {
        "label": "Sales Manager 1",
        "id": 0,
        "children": []
      },
      {
        "label": "Sales Manager 2",
        "id": 1,
        "children": []
      },
      {
        "label": "Sales Manager 3",
        "id": 2,
        "children": []
      }
    ]

  targetItems = [
    {
      "label": "Sales Manager 4",
      "id": 4,
      "children": [
        {
          "label": "Sales Associate 4",
          "id": 4
        }
      ]
    }
  ]

  associates =
    [
      {
        "label": "Sales Associate 1",
        "id": 5,
      },
      {
        "label": "Sales Associate 2",
        "id": 6,
      },
      {
        "label": "Sales Associate 3",
        "id": 7,
      }
    ]


  constructor(private drakeStore: DrakeStoreService) { }

  ngOnInit() {

    const local_complex_object = localStorage.getItem('currentUser')
    this.complex_object = JSON.parse(local_complex_object);



  }

  isCollapsed(i) {
    this.currentIndex = i;
  }

  public mainDrop(event) {
    console.log(event);
  }

  public builderDrop(event, index) {
    console.log(event);
    console.log(index);

    console.log(this.targetItems);

    let titemsList = this.targetItems[index];

    for (let item of titemsList.children)

      if (event.value.id == item.id) {
        alert("already exists");
        (this.drakeStore as any).drake.cancel(true);
      }

  }

}
