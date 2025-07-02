import axios from 'axios';

export class EnvService {
	static async get() {
		const { data } = await axios.get(`/api/env`);
		return data;
	}
} 