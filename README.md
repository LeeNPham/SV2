
### Tickets:
* [ ] Set up Validation
* [ ] Set up Notification ping, occurs only once during login
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
* [x] Set up stores values such that client can house their own data for offline use
  * [x] username
  * [x] userdescription
  * [x] categories
  * [x] todos

* [x] turn categories page categories into component cards to house the data, link to their items, and allow the user to edit them from there, if not, then route them to the main page with their list of todos
* [x] Set up APIGateway to allow for todos and category creation/deletion to be afixed to a users account, usage will be by reference only which might take more time but less calls in case we want to load balance the servers instead of housing them all on one array within the db system, look into creating client side js functions we can call to within routes
* [x] After every update or action is completed, make sure to console.log the action that occured. updates, deletes, creations, so on
* [x] BUG, currently users are unable to create a new category/new todos list because its returning an empty array, return an empty array as the value if null
  * [x] was due to backend defaulting values on updates
* [ ] display wrong username and password if it doesnt match on login


* [x] set up forgot password
* [x] implement refresh tokens { min: 30- "no activity,logs out", max: 240-"constant activity, forced logout" }
  * [x] Consider the user, do i want my most recent refresh token to occur during their latest activity or do i want it to occur every half hour, it's easier to track just fetch pings from the user, so we should instead have refresh tokens be derived from their ussage during such time, up to the max. currently, our max is at 30 minutes
