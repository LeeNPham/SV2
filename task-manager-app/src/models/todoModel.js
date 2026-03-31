// @ts-nocheck
import { Timestamp } from 'firebase/firestore';
import {
	coerceToTimestamp,
	dateInputStringToTimestamp,
	isFirestoreTimestamp
} from '$lib/firebase/timestampFields.js';

/**
 * Build Firestore payload for a new todo. Dates are Firestore Timestamps (or null when no due date).
 */
export const createTodoPayload = (uid, input = {}) => {
	const dueRaw = input.due_date;
	let due_date = null;
	if (dueRaw && String(dueRaw) !== 'null' && String(dueRaw).trim() !== '') {
		if (isFirestoreTimestamp(dueRaw)) {
			due_date = dueRaw;
		} else if (typeof dueRaw === 'string') {
			due_date = dateInputStringToTimestamp(dueRaw);
		}
	}
	return {
		title: (input.title ?? '').trim(),
		description: input.description ?? '',
		category: input.category ?? 'All',
		completion: false,
		userId: uid,
		create_date: Timestamp.now(),
		due_date
	};
};

/**
 * Normalize todo document from Firestore. Dates are Timestamp | null in memory.
 * @returns {{ todo: object, migrationPatch: Record<string, unknown> | null }}
 */
export function normalizeTodoWithMigration(id, data = {}) {
	const title = data.title ?? '';
	const description = data.description ?? '';
	const category = data.category ?? 'All';
	const completion = Boolean(data.completion);
	const userId = data.userId ?? '';

	const c = coerceToTimestamp(data.create_date);
	let create_date = c.timestamp;
	let createNeedsPersist = c.wasLegacy;
	if (!create_date) {
		create_date = Timestamp.now();
		createNeedsPersist = true;
	}

	const hasDueField = Object.prototype.hasOwnProperty.call(data, 'due_date');
	const d = coerceToTimestamp(data.due_date);
	const due_date = d.timestamp;
	const dueNeedsPersist = hasDueField && d.wasLegacy;

	const migrationPatch = {};
	if (createNeedsPersist) migrationPatch.create_date = create_date;
	if (dueNeedsPersist) migrationPatch.due_date = due_date;

	const migrationPatchClean =
		Object.keys(migrationPatch).length > 0 ? migrationPatch : null;

	return {
		todo: {
			id,
			title,
			description,
			category,
			completion,
			userId,
			create_date,
			due_date
		},
		migrationPatch: migrationPatchClean
	};
}

export const normalizeTodo = (id, data = {}) => normalizeTodoWithMigration(id, data).todo;
