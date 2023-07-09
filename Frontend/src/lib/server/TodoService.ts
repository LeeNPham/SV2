import { get } from 'svelte/store'
import { PUBLIC_BACKEND_TODOS } from '$env/static/public'

/**
 * Utility class for todo related functions
 * */
class TodoService {
	async createTodo(todoData: any) {
		const user: any = get(identity)
		if (!user) {
			return TypeError('No User')
		}
		const recordType = `tozny.flow.${uuidv4()}`
		let meta = {
			flowTodo: 'true'
		}

		const currentUTCDatetime = new Date().toLocaleString('en-US', {
			timeZone: 'UTC',
			timeZoneName: 'short'
		})

		let data = {
			name: todoData['name'],
			todo: todoData['todo'],
			createdDate: currentUTCDatetime,
			lastModifiedDate: currentUTCDatetime
		}

		try {
			return await user.storage.writeRecord(recordType, data, meta)
		} catch (e) {
			return TypeError('Writing Todo to TozStore')
		}
	}

	//original
	async createTodo1(
		category: string,
		title: string,
		description: string,
		completion: string,
		due_date: string
	) {
		try {
			const currentTime = new Date()
			const create_date = currentTime.toISOString().split('T')[0].toString()
			const newTodo = {
				category: category === 'All' ? '' : category,
				title,
				description,
				completion,
				create_date,
				due_date: due_date ? new Date(due_date).toISOString().split('T')[0].toString() : 'null'
			}
			const res = await fetch(`${PUBLIC_BACKEND_TODOS}/api/todo/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newTodo)
			})
			if (!res.ok) {
				throw new Error('Failed to create a new todo')
			}
			const data = await res.json()
			const objectId = data._id
			console.log(objectId)

			// const response = await fetch(`${PUBLIC_BACKEND_USERS}/api/user/${userId}`, {
			// 	method: 'GET', // Fetch the user's current todo list
			// 	headers: {
			// 		'Content-Type': 'application/json'
			// 	}
			// })
			// if (!response.ok) {
			// 	throw new Error('Failed to fetch user todo list')
			// }
			// const userData = await response.json()
			// const currentTodos = userData.todos || [] // Existing todos or empty array if none
			// const updatedTodos = [...currentTodos, objectId] // Append the new objectId
			// const putResponse = await fetch(`${PUBLIC_BACKEND_USERS}/api/user/${userId}`, {
			// 	method: 'PUT',
			// 	headers: {
			// 		'Content-Type': 'application/json'
			// 	},
			// 	body: JSON.stringify({
			// 		todos: updatedTodos
			// 	})
			// })
			// if (!putResponse.ok) {
			// 	throw new Error('Failed to update user todo list')
			// }
			// console.log('User todo list updated successfully')
			// console.log('Data after updating user:', userData)
			// console.log(userData.todos)
			// showNewTodoModal = false
			// ;(window as Window).location = '/home'
		} catch (error) {
			console.error('Error creating a new todo:', error)
			return {
				status: 301,
				error: new Error('Could not create a new todo')
			}
		}
	}
	//from page.ts in home

	/**
	 * Adds todos to a folder by adding each todo's information to the folder record.
	 */
	// async addTodosToFolder(todos, folderID) {
	// 	const user: any = get(identity)
	// 	if (!user) {
	// 		console.error('No user')
	// 		return TypeError('No User')
	// 	}
	// 	// Add the todo to the folder
	// 	let destination
	// 	try {
	// 		destination = await user.storage.readRecord(folderID)
	// 	} catch (e) {
	// 		console.error(e)
	// 		return TypeError('Reading record ')
	// 	}
	// 	const destTodos = JSON.parse(destination.data.todos)
	// 	for (let todo of todos) {
	// 		let todoRecord = {
	// 			recordID: todo.meta.recordId
	// 		}
	// 		destTodos.push(todoRecord)
	// 	}
	// 	destination.data.todos = JSON.stringify(destTodos)
	// 	try {
	// 		return await user.storage.updateRecord(destination)
	// 	} catch (e) {
	// 		console.error(e)
	// 		return TypeError('Updating record')
	// 	}
	// }

	// async getTodos(todoIDs: any[]) {
	// 	if (!todoIDs || todoIDs.length == 0) {
	// 		return []
	// 	}
	// 	const user: any = get(identity)
	// 	const recordIds = todoIDs.map((file) => file.recordID)
	// 	const request = new Tozny.types.Search(true, true)
	// 	// Search for records based on file record IDs
	// 	request.match({ records: recordIds })
	// 	let foundRecords
	// 	// Retry search to adjust the delay in search service indexing
	// 	let retries = 3 // TODO: make this an env variable
	// 	while (retries > 0) {
	// 		const resultQuery = await user.storage.search(request)
	// 		foundRecords = await resultQuery.next()
	// 		foundRecords = foundRecords.reduce((unique, o) => {
	// 			if (!unique.some((obj) => obj.meta.recordId === o.meta.recordId)) {
	// 				unique.push(o)
	// 			}
	// 			return unique
	// 		}, [])
	// 		if (foundRecords.length == recordIds.length) {
	// 			break
	// 		}
	// 		retries--
	// 		await new Promise((r) => setTimeout(r, 1000))
	// 	}

	// 	// We have to filter by files written to direct sharing groups.
	// 	// This is because Share files should not include files that have been written but not yet shared.
	// 	// If we searched for all Flow files the user has written, it may return files that have not been shared.
	// 	const directShareGroupIDs = await CommonService.getAllOwnedDirectSharingGroupIDs()
	// 	if (directShareGroupIDs instanceof TypeError) {
	// 		return TypeError('Getting direct shares')
	// 	}

	// 	// Get map of all group sharing groups
	// 	const groupSharingMap = await CommonService.getAllTozStoreGroupSharingGroupsAsMap()
	// 	if (groupSharingMap instanceof TypeError) {
	// 		return TypeError('Getting group shares')
	// 	}

	// 	// Get IDs for all group sharing groups
	// 	let groupShareGroupIDs: string[] = []
	// 	for (let [groupID, groupInfo] of groupSharingMap) {
	// 		groupShareGroupIDs.push(groupID)
	// 	}

	// 	let allGroupIDs = directShareGroupIDs.concat(groupShareGroupIDs)

	// 	// Get all records shared with these groups
	// 	const groupRecords = await CommonService.getRecordsSharedWithGroups(allGroupIDs)

	// 	// Get all the members of the groups
	// 	const groupMembers = await CommonService.getGroupMembers(directShareGroupIDs)

	// 	// Get a list of all the other member IDs
	// 	let usernameMap = await CommonService.getUsernameMap(groupMembers, directShareGroupIDs)

	// 	const byteSize = (str) => new Blob([str]).size

	// 	let todoList = []
	// 	for (let file of foundRecords) {
	// 		let found = todoList.find((el) => el.recordId === file.meta.recordId)
	// 		if (!found) {
	// 			let sharedTo: string[] = []
	// 			// Find what dierct sharing groups the record has been shared with
	// 			for (let groupID of directShareGroupIDs) {
	// 				if (groupRecords.has(groupID)) {
	// 					for (let record of groupRecords.get(groupID)) {
	// 						if (record.meta.recordId == file.meta.recordId) {
	// 							// Get the group member
	// 							const otherMemberID =
	// 								groupMembers.get(groupID)[0].client_id == user.storage.config.clientId
	// 									? groupMembers.get(groupID)[1].client_id
	// 									: groupMembers.get(groupID)[0].client_id
	// 							let username = usernameMap.get(otherMemberID)
	// 							let foundUser = sharedTo.find((el) => el == username)
	// 							if (!foundUser) sharedTo.push(username)
	// 						}
	// 					}
	// 				}
	// 			}

	// 			let sharedToGroupInfo: object[] = []
	// 			// Find out what flow groups the record has been shared with
	// 			for (let groupID of groupShareGroupIDs) {
	// 				if (groupRecords.has(groupID)) {
	// 					for (let record of groupRecords.get(groupID)) {
	// 						if (record.meta.recordId == file.meta.recordId) {
	// 							// Get the group group info
	// 							let found = sharedToGroupInfo.find((el) => el.groupID === groupID)
	// 							if (!found) {
	// 								let sharedToInfo = groupSharingMap?.get(groupID)
	// 								sharedToInfo.groupID = groupID
	// 								sharedToGroupInfo.push(sharedToInfo)
	// 							}
	// 						}
	// 					}
	// 				}
	// 			}

	// 			todoList.push({
	// 				recordID: file.meta.recordId,
	// 				name: file.data.name,
	// 				todo: file.data.todo,
	// 				size: byteSize(file.data.todo),
	// 				createdDate: file.data.createdDate,
	// 				version: file.meta.version,
	// 				sharedWith: sharedTo,
	// 				sharedWithGroup: sharedToGroupInfo,
	// 				type: 'todo'
	// 			})
	// 		}
	// 	}
	// 	return todoList
	// }

	// /**
	//  * Gets all todos a user owns and has shared.
	//  */
	// async getAllOwnedSharedTodos() {
	// 	const todos = await CommonService.getAllOwnedSharedRecordsOfType('flowTodo')
	// 	let sharedTodos = []
	// 	const byteSize = (str) => new Blob([str]).size
	// 	if (todos) {
	// 		for (let todo of todos) {
	// 			sharedTodos.push({
	// 				recordID: todo.record.meta.recordId,
	// 				name: todo.record.data.name,
	// 				todo: todo.record.data.todo,
	// 				size: byteSize(todo.record.data.todo),
	// 				version: todo.record.meta.version,
	// 				createdDate: todo.record.data.createdDate,
	// 				sharedTo: todo.sharedTo,
	// 				sharedToUserImg: todo.sharedToUserImg,
	// 				sharedFrom: [],
	// 				type: 'todo',
	// 				owned: true
	// 			})
	// 		}
	// 	}

	// 	let sharesByType = await CommonService.getSharesByUserType(sharedTodos)

	// 	return {
	// 		allRecords: sharedTodos,
	// 		internalRecords: sharesByType?.internalRecords,
	// 		externalRecords: sharesByType?.externalRecords
	// 	}
	// }

	// async getAllOwnedTodos(): Promise<object[] | TypeError> {
	// 	const user: any = get(identity)
	// 	if (!user) {
	// 		return TypeError('Getting user')
	// 	}
	// 	let records = await CommonService.getAllOwnedRecordsByKey('flowTodo')
	// 	if (records instanceof TypeError) {
	// 		return TypeError('Getting todos')
	// 	}
	// 	let todos: object[] = []
	// 	for (let record of records) {
	// 		let found = todos.find((el) => el.recordID === record.meta.recordId)
	// 		if (!found)
	// 			todos.push({
	// 				recordID: record.meta.recordId,
	// 				name: record.data.name,
	// 				todo: record.data.todo,
	// 				version: record.meta.version,
	// 				sharedFrom: [],
	// 				owned: true
	// 			})
	// 	}
	// 	return todos
	// }

	// async getOwnedTodos() {
	// 	const allOwnedTodos = await this.getAllOwnedTodos()
	// 	const allOwnedSharedTodos = (await this.getAllOwnedSharedTodos()).allRecords

	// 	let allTodos = []
	// 	if (allOwnedTodos) {
	// 		for (let ownedTodo of allOwnedTodos) {
	// 			let found = false
	// 			for (let sharedTodo of allOwnedSharedTodos) {
	// 				if (ownedTodo.recordID == sharedTodo.recordID) {
	// 					allTodos.push(sharedTodo)
	// 					found = true
	// 				}
	// 			}
	// 			if (!found) {
	// 				allTodos.push(ownedTodo)
	// 			}
	// 		}
	// 	}
	// 	return allTodos
	// }

	// async getReceivedTodos() {
	// 	const user: any = get(identity)
	// 	if (!user) {
	// 		return TypeError('No User')
	// 	}
	// 	try {
	// 		// includeData = true
	// 		// includeAllWriters = false (i.e., only return records the user has written)
	// 		// We cah search for all todos a user has written, because we want to return
	// 		// all written todos whether they have been shared or not.
	// 		const request = new Tozny.types.Search(true, true)
	// 		request
	// 			.match({ plain: { flowTodo: 'true' } })
	// 			.exclude({ writers: user.storage.config.clientId })
	// 		const resultQuery = await user.storage.search(request)
	// 		const records = await resultQuery.next()
	// 		let todos = []
	// 		const byteSize = (str) => new Blob([str]).size
	// 		for (let record of records) {
	// 			let found = todos.find((el) => el.recordID === record.meta.recordId)
	// 			let userInfo = await user.searchRealmIdentitiesByClientID([record.meta.writerId])
	// 			const sender = userInfo.searched_identities_information[0].realm_username
	// 			const senderImg = await CommonService.getProfileImage(record.meta.writerId)
	// 			if (!found)
	// 				todos.push({
	// 					recordID: record.meta.recordId,
	// 					name: record.data.name,
	// 					todo: record.data.todo,
	// 					sharedFrom: sender,
	// 					sharedFromUserImg: senderImg,
	// 					createdDate: record.data.createdDate,
	// 					size: byteSize(record.data.todo),
	// 					type: 'todo',
	// 					sharedTo: [],
	// 					version: record.meta.version
	// 				})
	// 		}
	// 		return todos
	// 	} catch (e) {
	// 		return TypeError('Getting todos received')
	// 	}
	// }

	// /**
	//  * Shares a todo into a shared group with the recipient.
	//  */
	// async shareTodo(recordID: string, recipientUsername: string) {
	// 	return await CommonService.shareRecord(recordID, recipientUsername)
	// }

	// async unshareTodo(recordID: string, identitiesToUnshareWith: string[]) {
	// 	return await CommonService.unshareRecordFromIdentities(recordID, identitiesToUnshareWith)
	// }

	// /**
	//  * Deletes a record and revokes it
	//  */
	// async deleteTodo(recordID: string, version: string, folderID: string) {
	// 	// Get User
	// 	const user: any = get(identity)
	// 	if (!user) {
	// 		return TypeError('No User')
	// 	}

	// 	let UnsharedFromGroups: boolean | TypeError = false

	// 	UnsharedFromGroups = await CommonService.unShareRecordFromAllUsers(recordID)

	// 	if (UnsharedFromGroups instanceof TypeError) {
	// 		return TypeError('Removing shares')
	// 	}

	// 	let err = await this.removeTodofromTozStoreAndFolder(recordID, version, folderID)
	// 	if (err instanceof TypeError) {
	// 		return TypeError('Deleting Todo')
	// 	}
	// }

	// // TODO move to CommonService.ts
	// async removeTodofromTozStoreAndFolder(recordID: string, version: string, folderID: string) {
	// 	const user: any = get(identity)
	// 	if (!user) {
	// 		return TypeError('Fetching logged in user')
	// 	}
	// 	// Delete todo from TozStore
	// 	try {
	// 		await user.storage.deleteRecord(recordID, version)
	// 	} catch (e) {
	// 		return TypeError('Deleting Record from TozStore')
	// 	}

	// 	// Delete todo from Folder
	// 	try {
	// 		this.removeTodoFromFolder(recordID, folderID)
	// 	} catch (e) {
	// 		return TypeError('Removing file from folder')
	// 	}
	// 	return
	// }

	// async removeTodoFromFolder(todoID: string, folderID: string) {
	// 	// Get user
	// 	const user: any = get(identity)
	// 	if (!user) {
	// 		console.error('No user')
	// 		return TypeError('No User')
	// 	}
	// 	// Grab Folder that the todo is in
	// 	let destination
	// 	try {
	// 		destination = await user.storage.readRecord(folderID)
	// 	} catch (e) {
	// 		console.error(e)
	// 		return TypeError('Error reading record from TozStore')
	// 	}
	// 	// Parse the Todos
	// 	const destTodos = JSON.parse(destination.data.todos)
	// 	let removedTodoList = destTodos.filter((todo: any) => todo.recordID != todoID)
	// 	destination.data.todos = JSON.stringify(removedTodoList)
	// 	try {
	// 		return await user.storage.updateRecord(destination)
	// 	} catch (e) {
	// 		console.error(e)
	// 		return TypeError('Error updating record from TozStore')
	// 	}
	// }
}

export default new TodoService()
