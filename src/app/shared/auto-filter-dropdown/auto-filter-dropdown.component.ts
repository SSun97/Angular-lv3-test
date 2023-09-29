import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-auto-filter-dropdown',
  templateUrl: './auto-filter-dropdown.component.html',
  styleUrls: ['./auto-filter-dropdown.component.css']
})
export class AutoFilterDropdownComponent implements OnInit {

  @Input() itemList: string[] = [
    "USA",
    "UK",
    "Canada",
    "India",
    "France",
    "Germany",
    "Australia"
  ]; // Can be countries or any other category
  searchText: string = '';
  filteredItems: string[] = [];
  isHovering: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.filteredItems = [...this.itemList];
  }

  filterItems(): void {
    const searchValue = this.searchText.toLowerCase();
    this.filteredItems = this.itemList.filter(item => item.toLowerCase().includes(searchValue));
  }

  highlightText(text: string): string {
    const re = new RegExp(this.searchText, 'gi');
    return text.replace(re, (match) => `<b>${match}</b>`);
  }

  selectCategory(category: string): void {
    this.searchText = category;
    this.filteredItems = [];
  }
}
