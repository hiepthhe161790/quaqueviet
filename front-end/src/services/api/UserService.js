import { api } from '../index';

class UserService {
    async addUser(email, password, fullName, address, phoneNumber) {
        const result = await api.post(`/user/register`, { email, password, fullName, address, phoneNumber });
        return result.data;
    }

    async getPaginatedUsers(page, pageSize, keywords, sortBy) {
        const response = await api.get('/user/get-paginated-users', {
            params: {
                page,
                pageSize,
                keywords,
                sortBy
            }
        });
        return response.data;
    }

    async getAllDeletedUsers() {
        const result = await api.get(`/user/get-deleted-users`);
        return result.data;
    }

    async softDeleteUser(userId) {
        const result = await api.delete(`/user/soft-delete/${userId}`);
        return result.data;
    }

    async recoverSoftDeletedUser(userId) {
        const result = await api.patch(`/user/recover-soft-deleted/${userId}`);
        return result.data;
    }

    async updateUser(userId, email, fullName, address, phoneNumber, role, isVerified) {
        const result = await api.put(`/user/update/${userId}`, { email, fullName, address, phoneNumber, role, isVerified });
        return result.data;
    }

}

export default new UserService();
