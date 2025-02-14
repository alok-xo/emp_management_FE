import axios from 'axios';
import { server } from './Server';


export const employeeAPI = {
    getAllEmployees: async () => {
        try {
            const response = await axios.get(`${server}/submission/employees`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching employees:', error);
            throw error;
        }
    }
};
