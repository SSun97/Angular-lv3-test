import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DropdownItem } from 'src/app/data.models';

@Component({
  selector: 'app-auto-filter-dropdown',
  templateUrl: './auto-filter-dropdown.component.html',
  styleUrls: ['./auto-filter-dropdown.component.css']
})
export class AutoFilterDropdownComponent<T extends DropdownItem> implements OnInit {
  selectedValue: string | null = null;
  @Input() itemList: T[] = [];
  @Output() itemSelected: EventEmitter<T> = new EventEmitter();
  @Output() valueChange = new EventEmitter<string>();

  searchText = '';
  filteredItems: T[] = [];
  isHovering = false;

  ngOnInit(): void {
    this.filteredItems = [...this.itemList];
  }

  filterItems(): void {
    const searchValue = this.searchText.toLowerCase();
    this.filteredItems = this.itemList.filter(item => item.name.toLowerCase().includes(searchValue));
  }

  highlightText(text: string): string {
    const re = new RegExp(this.searchText, 'gi');
    return text.replace(re, (match) => `<b>${match}</b>`);
  }
  selectCategory(category: T): void {
    this.searchText = category.name;
    this.selectedValue = category.id?.toString() + ',' + category.name;
    this.valueChange.emit(this.selectedValue);
    this.filteredItems = [];
  }
}
