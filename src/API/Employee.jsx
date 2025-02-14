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
    },
    
    updateEmployee: async (employeeData) => {
        try {
            // Ensure status is set to "selected" before sending the request
            const updatedData = {
                ...employeeData,
                status: "selected" // Set status to "selected"
            };

            const response = await axios.put(`${server}/submission/update_employee`, updatedData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating employee:', error);
            throw error;
        }
    }
};
