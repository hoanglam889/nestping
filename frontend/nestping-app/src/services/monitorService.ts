import apiClient from "./apiClient.ts";

export const getAllMonitors = async() => {
    const response =  await apiClient.get('/monitors');
    return response.data;
}

export const getMonitorById = async(id: string ) => {
    const response = await apiClient.get(`/monitors/${id}`);
    return response.data;
}

export const createMonitor = async(data: any) => {
    const response = await apiClient.post(`/monitors`, data);
    return response.data;
}

export const updateMonitor = async(id: string, data: any) => {
    const response = await apiClient.patch(`/monitors/${id}`, data);
    return response.data;
}

export const deleteMonitor = async(id:string) => {
    const response = await apiClient.delete(`/monitors/${id}`);
    return response.data;
}

export const togglePauseMonitor = async (id: string) => {
    const response = await apiClient.patch(`/monitors/${id}/toggle-pause`);
    return response.data;
}