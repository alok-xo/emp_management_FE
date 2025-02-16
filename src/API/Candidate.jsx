import axios from 'axios';
import { server } from './Server';

export const submitCandidate = async (formData) => {
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    };

    const response = await axios.post(`${server}/submission/submit`, formData, config);
    return response.data;
};

export const getAllCandidates = async () => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    };

    const response = await axios.get(`${server}/submission/employees`, config);
    return response.data.employees;
};

export const deleteCandidate = async (candidateId) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    };

    await axios.delete(`${server}/submission/delete_employee/${candidateId}`, config);
};

export const updateCandidateStatus = async (email, status) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    };

    const response = await axios.put(`${server}/submission/update_status`, {
        email,
        status: status.toLowerCase() 
    }, config);
    return response.data;
}; 