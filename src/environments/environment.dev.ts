/*
 *  Copyright 2023-2024 Dataport AöR
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

export const environment = {
  production: false,
  orgasAPI: 'https://api.dev.merlot-education.eu/organisations/?page=0&size=50',
  // invitationUrlApi: 'http://213.165.77.158:3003/v1/invitation-url?alias=trust',
  // invitationUrlApi: 'https://secure-routes.jumpy.dev/invitation-url.php',
  // invitationUrlApi:
  //   'https://ocm.dev.merlot-education.eu/connection/v1/invitation-url?alias=trust',
  invitationUrlApi:
    'https://ocm.dev.merlot-education.eu/connection/v1/invitation-url?alias=trust',
  // connectionApi: 'http://213.165.77.158:3003/v1/connections',
  // connectionApi: 'https://secure-routes.jumpy.dev/connections.php',
  // connectionApi:
  //   'https://ocm.dev.merlot-education.eu/connection/v1/connections',
  connectionApi:
    'https://ocm.dev.merlot-education.eu/connection/v1/connections',
  // createCredentialApi: 'http://213.165.77.158:3005/v1/create-offer-credential',
  // createCredentialApi:
  //   'https://secure-routes.jumpy.dev/create-offer-credential.php',
  createCredentialApi:
    'https://ocm.dev.merlot-education.eu/attestation/v1/create-offer-credential',
  // 'https://ocm.dev.merlot-education.eu/credential/v1/create-offer-credential',
  // credentialApi: 'http://213.165.77.158:3005/v1/credential',
  // credentialApi: 'https://secure-routes.jumpy.dev/credential.php',
  credentialApi:
    'https://ocm.dev.merlot-education.eu/attestation/v1/credential',
  // credentialDefinitionId:
  //   '7KuDTpQh3GJ7Gp6kErpWvM:3:CL:90163:MerlotFederationLoginLongerWith240',
  credentialDefinitionId:
    'K8j8nFTijJTCsFwrRNE3Df:3:CL:1047693:MerlotLoginDev150724',
};
