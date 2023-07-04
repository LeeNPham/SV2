import { get } from 'svelte/store'
import { realm, identity } from '$lib/stores'
import CommonService from '$lib/tozny/CommonService'
import { env } from '$env/dynamic/public'
/**
 * Utility class for user related functions
 * */
class UserService {
	async addUser(data: any, registrationToken: any) {
		if (registrationToken) {
			try {
				const realmclient = get(realm)
				const password = realmclient.crypto.randomKey()
				const attributes = {
					identity_type: [data.identityType]
				}
				// User is registered
				const user = await realmclient.register(
					data.userName.toLowerCase(),
					password,
					registrationToken,
					data.email.toLowerCase(),
					data.firstName,
					data.lastName,
					1440,
					attributes
				)
				// Added to the tozflow sharing group
				await CommonService.addUserToTozFlowSharingGroup(data.userName.toLowerCase())

				if (user) {
					realmclient.initiateRecovery(data.userName, {
						template_name: 'claim_account',
						expiry_minutes: 1440
					})
				}
				return user
			} catch (e: any) {
				const message = e.message || 'Something went wrong!'
				return TypeError(message)
			}
		} else {
			const message = 'Registration token not available. Please check whether you have admin role!'
			return TypeError(message)
		}
	}
	async resetMFA(userName: string) {
		const user: any = get(identity)
		if (!user) {
			return TypeError('No User')
		}
		return user.resetIdentityMFA(userName)
	}

	async resetPassword(userName: string) {
		const realmclient = get(realm)
		return realmclient.initiateRecovery(userName, {
			template_name: 'reset_password',
			expiry_minutes: 1440
		})
	}

	async resendInvite(userName: string) {
		const realmclient = get(realm)
		return realmclient.initiateRecovery(userName, {
			template_name: 'claim_account',
			expiry_minutes: 1440
		})
	}

	async getUserDetails(username) {
		const user: any = get(identity)
		if (!user) {
			return TypeError('No User')
		}
		return user.getIdentityDetails(username)
	}

	async getRoles() {
		const user: any = get(identity)
		if (!user) {
			return TypeError('No User')
		}
		return user.storage.listAllRealmRoles(user.config.realmName)
	}

	async updateUserAttribute(id: string, attributes: Object) {
		const user: any = get(identity)
		if (!user) {
			return TypeError('No User')
		}
		return user.updateIdentityAttributes(id, attributes)
	}

	async addUserRoles(id: string, roles: Object) {
		const user: any = get(identity)
		if (!user) {
			return TypeError('No User')
		}
		return user.addRolesToIdentity(id, roles)
	}

	async removeUserRoles(id: string, roles: Object) {
		const user: any = get(identity)
		if (!user) {
			return TypeError('No User')
		}
		return user.removeRolesFromIdentity(id, roles)
	}

	async updateUserDetails(id: string, data: Object) {
		const user: any = get(identity)
		if (!user) {
			return TypeError('No User')
		}
		return user.updateIdentityDetails(id, data)
	}
}

export default new UserService()
