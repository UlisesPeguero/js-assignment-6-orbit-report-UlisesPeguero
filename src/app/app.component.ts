import { Component } from '@angular/core';
import { Satellite } from './satellite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'orbit-report';

  sourceList: Satellite[];
  displayList: Satellite[];
  listTypes: string[];

  searchFields = ['name', 'type', 'orbitType'];

	constructor() {
		this.sourceList = [];
    this.displayList = [];
    this.listTypes = [];
		let satellitesUrl = 'https://handlers.education.launchcode.org/static/satellites.json';

		window.fetch(satellitesUrl).then(function (response) {
			response.json().then(function (data) {

				let fetchedSatellites = data.satellites;
				// loop over satellites
				for(let i=0; i < fetchedSatellites.length; i++) {
					// create a Satellite object
					let satellite = new Satellite(fetchedSatellites[i].name, fetchedSatellites[i].type, fetchedSatellites[i].launchDate, fetchedSatellites[i].orbitType, fetchedSatellites[i].operational);
					// add the new Satellite object to sourceList
          this.sourceList.push(satellite);
          // create type list
          if (!this.listTypes.includes(satellite.type)) this.listTypes.push(satellite.type);
				 }

				 // make a copy of the sourceList to be shown to the user
				 this.displayList = this.sourceList.slice(0);

			}.bind(this));
		}.bind(this));

	}

	search(searchTerm: string): void {
		let matchingSatellites: Satellite[] = [];
    searchTerm = searchTerm.toLowerCase();
    for (let item of this.sourceList) {
      for (let field of this.searchFields) {
        let value = item[field].toLowerCase();
        if (value.indexOf(searchTerm) !== -1 && !matchingSatellites.includes(item)) {
          matchingSatellites.push(item);
        }
      }
    }
		// assign this.displayList to be the array of matching satellites
		// this will cause Angular to re-make the table, but now only containing matches
		this.displayList = matchingSatellites;
	}


}
