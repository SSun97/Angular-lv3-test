import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from 'src/app/data.models';

@Component({
  selector: 'app-auto-filter-dropdown',
  templateUrl: './auto-filter-dropdown.component.html',
  styleUrls: ['./auto-filter-dropdown.component.css']
})
export class AutoFilterDropdownComponent implements OnInit {

  // @Input() itemList: string[] = [
  //   "USA",
  //   "UK",
  //   "Canada",
  //   "India",
  //   "France",
  //   "Germany",
  //   "Australia"
  // ]; // Can be countries or any other category
  selectedValue: string | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() itemList = [] as any[];
  @Output() itemSelected: EventEmitter<Category> = new EventEmitter();
  @Output() valueChange = new EventEmitter<string>();

  searchText = '';
  filteredItems: Category[] = [];
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
  selectCategory(category: Category): void {
    this.searchText = category.name;
    this.selectedValue = category.id?.toString() + ',' + category.name;
    this.valueChange.emit(this.selectedValue);
    this.filteredItems = [];
  }
}
