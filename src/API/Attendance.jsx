import { server } from "./Server";
import axios from "axios";

export const updateAttendanceStatus = async (attendanceId, attendanceStatus, accessToken) => {
    try {
        const response = await axios.put(
            `${server}/submission/updateAttendance/${attendanceId}`,
            { attendanceStatus },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
