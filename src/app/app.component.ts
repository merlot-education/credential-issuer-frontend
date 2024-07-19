/*
 *  Copyright 2024 Dataport. All rights reserved. Developed as part of the MERLOT project.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { HostListener } from "@angular/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  email: string = `user${Math.floor(
    Math.random() * 100000
  ).toString()}@merlot.dev`;
  firstName: string = 'Testing';
  middleName: string = 'dataport';
  lastName: string = 'Tester';
  gender: string = 'M';
  birthDate: string = '1969-04-20';
  subjectDid: string = 'https://auth-server.gxfs.dev';

  connectionId = '';
  invitationUrl = '';

  // this is only used for the polling
  connectionStatus = '';

  showForm = true;

  credentialId = '';

  credentialState = '';

  organization = '';
  organizations: string[] = [];
  organizationMap = new Map();

  roleType = 'OrgLegRep';

  qrcodeDimension: number;

  constructor(private http: HttpClient) {
    this.qrcodeDimension = 512;
    this.onResize();
   }

   @HostListener('window:resize', ['$event'])
   onResize(event?) {
      this.qrcodeDimension = Math.min(512, window.innerWidth*0.8);
   }

  ngOnInit(): void {
    this.http
      .post<any>(environment.invitationUrlApi, {})
      .subscribe((response) => {
        console.log(response);
        if (
          'data' in response &&
          'connection' in response.data &&
          'id' in response.data.connection &&
          'invitationUrl' in response.data
        ) {
          this.connectionId = response.data.connection.id;
          this.invitationUrl = response.data.invitationUrl;

          console.log(this.connectionId);
          console.log(this.invitationUrl);
        } else {
          alert('Error: The response does not contain the expected property!');
        }
      });

    this.http.get<any>(environment.orgasAPI, {}).subscribe((response) => {
      console.log(response);

      response.content.forEach((element: any) => {
        let credentials = element.selfDescription.verifiableCredential;
        if (Array.isArray(credentials)) {
          for (let vc of credentials) {
            if (!Array.isArray(vc.credentialSubject) && vc.credentialSubject.type === "merlot:MerlotLegalParticipant") {
              let organizationName = vc.credentialSubject['merlot:legalName'];
              this.organizations.push(organizationName);
              this.organizationMap.set(organizationName, vc.credentialSubject['id'])
            }
          }
        } else {
          let organizationName = credentials.credentialSubject['gax-trust-framework:legalName']["@value"];
          this.organizations.push(organizationName);
          this.organizationMap.set(organizationName, credentials.credentialSubject['@id'])
        }
        
      });

      this.organization = this.organizations[0];
    });
  }

  onSubmit() {
    // check if the required form fields are set
    if (
      this.email === '' &&
      this.firstName === '' &&
      this.lastName === '' &&
      this.birthDate === ''
    ) {
      alert('Please fill out all required fields!');
      return;
    }

    this.showForm = false;
    this.pollForVerification();
  }

  pollForVerification() {
    const url = `${environment.connectionApi}/${this.connectionId}`;

    const poll$ = interval(500);
    poll$
      .pipe(takeWhile(() => this.connectionStatus !== 'trusted'))
      .subscribe(() => {
        this.http.get(url).subscribe((response: any) => {
          console.log(response);
          if (
            'data' in response &&
            'records' in response.data &&
            'status' in response.data.records
          ) {
            this.connectionStatus = response.data.records.status;

            if (response.data.records.status === 'trusted') {
              this.issueCredential();
            }
          }
        });
      });
  }

  issueCredential() {
    let obj = {
      connectionId: this.connectionId,
      credentialDefinitionId: environment.credentialDefinitionId,
      comment: 'Merlot Login',
      attributes: [
        {
          name: 'Vorname',
          value: this.firstName,
        },
        {
          name: 'Nachname',
          value: this.lastName,
        },
        {
          name: 'Organisation',
          value: this.organization,
        },
        {
          name: 'Role',
          value: this.roleType,
        },
        {
          name: 'ID',
          value: this.email,
        },
        {
          name: 'subjectDID',
          value: 'SOMEDID27433983',
        },
        {
          name: 'issuerDID',
          value:  this.organizationMap.get(this.organization),
        },

        {
          name: 'iss',
          value: 'tim@merlot.dev',
        },
        {
          name: 'sub',
          value: this.email,
        },
        {
          name: 'auth_time',
          value: new Date().toISOString(),
        },
      ],
      autoAcceptCredential: 'always',
    };

    console.log(obj);

    this.http
      .post<any>(environment.createCredentialApi, obj)
      .subscribe((response) => {
        console.log(response);
        if ('data' in response && 'id' in response.data) {
          this.credentialId = response.data.id;

          // start polling for connection status
          this.pollForIssuance();
        } else {
          alert('Error: The response does not contain the expected property!');
        }
      });

    // ,"iss": mail von tim: ,"sub": different mail,"auth_time": js time as string
  }

  pollForIssuance() {
    const url = `${environment.credentialApi}/${this.credentialId}`;

    const poll$ = interval(500);
    poll$
      .pipe(takeWhile(() => this.credentialState !== 'credential-issued'))
      .subscribe(() => {
        this.http.get(url).subscribe((response: any) => {
          console.log(response);
          if ('data' in response && 'state' in response.data) {
            this.credentialState = response.data.state;
          }
        });
      });
  }
}
