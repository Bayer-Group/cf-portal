# Cloud Foundry Portal

The CloudFoundry Portal UI provides basic CF application troubleshooting details useful to a LV1 support team.  Although other CF UI's exist ([admin-ui](https://github.com/cloudfoundry-incubator/admin-ui)) they require user authentication and management due to their administratative read/write capabilites.  CF portal is meant to be used in conjunction with these UI's to provide read only summary statistics eliminating the need to manage Org and Space accounting and providing the right level of detail for a novice CF user. This portal was written in the javascript frontend framework [Vuejs](https://vuejs.org/) and tested on [Version 272](https://apidocs.cloudfoundry.org/272/). It relies partially on the [cf-client](https://www.npmjs.com/package/cf-client) node package.

## Requirements

* uaa admin client to acccess logs and events
* a cf admin to make the api calls
* optionally a AWS service user that has permission to write to a CloudWatch log stream

## Setup 

### Creating the Uaa User
Since the application talks to the cloud controller to get its information, it needs a admin level account to work correctly.  You can either use the default admin account, or create one specifically for this application.  If you choose the later option, install the [uaac cli](https://github.com/cloudfoundry/cf-uaac) and create the account as follows:
```
uaac target https://uaa.yourcompany.com
uaac token client get admin
uaac client update admin --authorities "clients.write clients.read uaa.admin scim.read scim.write"
uaac token delete
uaac token client get admin
uaac user add --emails cfapi@fake.com -p password
	**specify username as “cfapi” when prompted
uaac member add cloud_controller.admin cfapi
```

### User Configuration
To configure the application for your enviornment, set the following enviornment variables to reflect the username and password of the admin account you created as well as the api url for your cloudfoundry installation
```
  USER: "cfapi"
  PASSWORD: "password"
  URL: "https://api.company.com"
```

### Update Frequency
The application periodically pulls the cf api to enumerate the information it needs and stores it in a local cache.  This suffices for our use case since there is no information which cannot be easily re-created with an application restart.  Calls to the cf-portal UI will hit the local cache, and the home page will show the last successfull cache refresh in the top left hand corner. The cache is refreshed every *180s* and is always hit after application start for the aggregrate information (apps+orgs+spaces) as well as the orgs and spaces calls.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Rest API
For programatic access, the following rest endpoints are exposed and in most cases mirrors the cf api:

1.  /rest/apps - json output of information captured on the homepage 
2.  /rest/apps/all - gets all apps contained in cloudfoundry. Warning: This json can be a few MB's in size! 
3.  /rest/apps/:guid/summary - summary of an app by guid
4.  /rest/apps/:guid/stats - provides stats for an app
5.  /rest/apps/:guid  - detail information on an app
6.  /rest/apps/:guid/overview - provides app overview
7.  /rest/spaces - provides a list of spaces
8.  /rest/orgs - provides a list of orgs
