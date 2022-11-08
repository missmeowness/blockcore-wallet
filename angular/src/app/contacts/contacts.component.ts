import { Component, OnInit } from '@angular/core';
import { Contact } from 'src/shared';
import { ContactStore } from 'src/shared/store/contacts-store';
import { UIState } from '../services';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
})
export class ContactsComponent implements OnInit {
  public items: any[];
  public contacts: Contact[];

  constructor(private uiState: UIState, private contactStore: ContactStore) {
    this.uiState.title = 'Address Book';
    this.uiState.showBackButton = true;
    this.uiState.goBackHome = true;
  }

  async ngOnInit(): Promise<void> {
    this.items = [{ID:5, name:'Sondre'}, {ID:1, name:'Lu'}];
    this.contacts = this.contactStore.all().sort((a, b) => (a.name > b.name ? 1 : -1));
  
  }

  deleteContacts() {
    alert('Are you sure you want to delete all your contacts?');
  }
}
