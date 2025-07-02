import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export function GET() {
	return json({
		VITE_BASE_URL: process.env.VITE_BASE_URL,
		VITE_API_URL: process.env.VITE_API_URL,
		VITE_BPMN_URL: process.env.VITE_BPMN_URL,
		VITE_MINIO_URL: process.env.VITE_MINIO_URL,
		VITE_MOCK_URL: process.env.VITE_MOCK_URL,
		VITE_CAS_URL: process.env.VITE_CAS_URL,
		VITE_HSS_URL: process.env.VITE_HSS_URL,
		VITE_CCFC_URL: process.env.VITE_CCFC_URL,
		VITE_SAF_URL: process.env.VITE_SAF_URL,
		VITE_DS_URL: process.env.VITE_DS_URL,
		VITE_RRFC_URL: process.env.VITE_RRFC_URL,
		VITE_VMAFC_URL: process.env.VITE_VMAFC_URL,
		VITE_VMAFU_URL: process.env.VITE_VMAFU_URL,
		VITE_PROMETHEUS_URL: process.env.VITE_PROMETHEUS_URL,
		VITE_ACF_URL: process.env.VITE_ACF_URL,
		VITE_CKF_URL: process.env.VITE_CKF_URL,
		VITE_CJRF_URL: process.env.VITE_CJRF_URL,
		VITE_FS_URL: process.env.VITE_FS_URL,
	});
}
