// @ts-nocheck
import { Timestamp } from 'firebase/firestore';

/** True if value is a Firestore Timestamp (or compatible). */
export function isFirestoreTimestamp(value) {
	if (!value || typeof value !== 'object') return false;
	return typeof value.toDate === 'function' && typeof value.seconds === 'number';
}

/**
 * Calendar date in local timezone → Firestore Timestamp (local midnight).
 * @param {string} ymd - YYYY-MM-DD
 */
export function dateInputStringToTimestamp(ymd) {
	if (!ymd || typeof ymd !== 'string') return null;
	const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(ymd.trim());
	if (!m) return null;
	const y = Number(m[1]);
	const mo = Number(m[2]) - 1;
	const day = Number(m[3]);
	const d = new Date(y, mo, day);
	if (Number.isNaN(d.getTime())) return null;
	return Timestamp.fromDate(d);
}

/**
 * @param {Timestamp | null | undefined} ts
 * @returns {string} YYYY-MM-DD for &lt;input type="date"&gt;, or ''
 */
export function timestampToDateInputValue(ts) {
	if (!ts || !isFirestoreTimestamp(ts)) return '';
	const d = ts.toDate();
	const y = d.getFullYear();
	const mo = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${y}-${mo}-${day}`;
}

/**
 * @param {Timestamp | null | undefined} ts
 * @returns {string} Short display date for UI
 */
export function formatTimestampDate(ts) {
	if (!ts || !isFirestoreTimestamp(ts)) return '';
	return timestampToDateInputValue(ts);
}

/**
 * Coerce legacy or mixed Firestore values to Timestamp | null.
 * @returns {{ timestamp: Timestamp | null, wasLegacy: boolean }}
 */
export function coerceToTimestamp(value) {
	if (value === undefined || value === null || value === '' || value === 'null') {
		return { timestamp: null, wasLegacy: typeof value === 'string' };
	}
	if (isFirestoreTimestamp(value)) {
		return { timestamp: value, wasLegacy: false };
	}
	if (value instanceof Date) {
		return { timestamp: Timestamp.fromDate(value), wasLegacy: true };
	}
	if (typeof value === 'string') {
		const fromYmd = dateInputStringToTimestamp(value);
		if (fromYmd) return { timestamp: fromYmd, wasLegacy: true };
		const parsed = new Date(value);
		if (!Number.isNaN(parsed.getTime())) {
			return { timestamp: Timestamp.fromDate(parsed), wasLegacy: true };
		}
		return { timestamp: null, wasLegacy: true };
	}
	return { timestamp: null, wasLegacy: false };
}

/**
 * Local calendar start for a Timestamp (for comparisons).
 * @returns {Date}
 */
export function timestampToLocalDayStart(ts) {
	if (!ts || !isFirestoreTimestamp(ts)) return null;
	const d = ts.toDate();
	return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * Todo due date as Timestamp (preferred) or legacy string — for filters / notifications.
 * @returns {Date | null} Local calendar day start for comparison, or null if no due date.
 */
export function dueValueToLocalDayStart(value) {
	if (value === undefined || value === null || value === '' || value === 'null') return null;
	if (isFirestoreTimestamp(value)) {
		const d = value.toDate();
		return new Date(d.getFullYear(), d.getMonth(), d.getDate());
	}
	if (typeof value === 'string') {
		const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
		if (m) {
			const day = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
			return Number.isNaN(day.getTime()) ? null : day;
		}
	}
	return null;
}
