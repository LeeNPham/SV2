### Project Structure:
* Backend (FastAPI)
  * Todos and Categories
* Backend-Users (FastAPI)
  * Users and account validation
* Frontend (SvelteKit)
  * API Gateway + UI/UX


### UI Spec References:
![Microservices Object Reference 1](Docs\UI-Spec.JPG)
### Model References:
![Microservices Object Reference 1](Docs\Microservices-Architecture.png)

### Tickets:
* [x] Set Up Todos Backend with CRUD Functions
* [x] Set Up Categories Backend with CRUD Functions
* [x] Start up dummy frontend and develop useable components
* [x] Populate pages to allow for CRUD usage for both Todos and Categories
* [x] Set up Fuzzy Search
* [x] Set up Notifications listing
* [x] Add routing for login
* [x] add routing for registration
* [x] add routing for logout
* [x] Look into housing access token via localStorage vs cookies vs stores
* [x] Set up data to be stored in stores to more easily access identity data
* [x] Set up Users Backend with CRUD Functions
* [x] Apply validation after encrypting and saving only hashed passwords to the db
* [ ] Set up stores values such that client can house their own data for offline use
  * [x] username
  * [x] userdescription
  * [ ] categories
  * [ ] todos


* [ ] Set up Notification ping
* [ ] Set up APIGateway to allow for todos and category creation/deletion to be afixed to a users account, usage will be by reference only which might take more time but less calls in case we want to load balance the servers instead of housing them all on one array within the db system
* [ ] After every update or action is completed, make sure to console.log the action that occured. updates, deletes, creations, so on
* [ ] BUG, currently users are unable to create a new category/new todos list because its returning an empty array, return an empty array as the value if null
* [ ] display wrong username and password if it doesnt match
* [ ] set up forgot password


upon logging in, I need to initialize a user by looking at their todos and categories, grabbing a full list of all todos and categories, and adding those lists into my store, from there, everytime a value is updated, i can update my local stores to update what information to render?

upon refresh, no data is available on profile after logging in, todos and cats dont show but returning from profile does remount and render my data?

getting an undefined reading for my initialized notifications
