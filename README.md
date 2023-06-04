For search results, display title of search results, include fuzzy search using fuze to also look at description details, display as dropdown list that opens up details for the specific task

Think a little more on how we want notifications sent

look into userbase to provide auth, consider firebase if demosize allows for cheaper deployment

update models in fastapi to allow for utilization with user accounts

set up a loading screen while async calls are initiated to grab todos

consider functionality to determine consistency graph
upon completion of a todo, log the todo id and use count of boolean completion values for day to mark day
create graph based on week and month based results
have the height of the graph reference the total amount of todos left divided by the days within either the week or month based graph

clock good for 50% completed, poor for 33% not completed, amazing for 88% and above, done for 100%
