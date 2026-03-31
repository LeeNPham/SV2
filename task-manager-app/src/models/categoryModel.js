// @ts-nocheck
import { Timestamp } from 'firebase/firestore';
import { coerceToTimestamp } from '$lib/firebase/timestampFields.js';

export const createCategoryPayload = (uid, input = {}) => ({
	title: (input.title ?? '').trim(),
	description: input.description ?? '',
	userId: uid,
	create_date: Timestamp.now()
});

/**
 * @returns {{ category: object, migrationPatch: Record<string, unknown> | null }}
 */
export function normalizeCategoryWithMigration(id, data = {}) {
	const title = data.title ?? '';
	const description = data.description ?? '';
	const userId = data.userId ?? '';

	const c = coerceToTimestamp(data.create_date);
	let create_date = c.timestamp;
	let createNeedsPersist = c.wasLegacy;
	if (!create_date) {
		create_date = Timestamp.now();
		createNeedsPersist = true;
	}

	const migrationPatch = createNeedsPersist ? { create_date } : null;

	return {
		category: {
			id,
			title,
			description,
			userId,
			create_date
		},
		migrationPatch
	};
}

export const normalizeCategory = (id, data = {}) => normalizeCategoryWithMigration(id, data).category;
