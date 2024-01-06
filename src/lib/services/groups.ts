import { writable } from 'svelte/store';
import axios from './axios';
export class GroupService {
	constructor() {}

	static index() {
		return axios.get(`/groups`);
	}
}
