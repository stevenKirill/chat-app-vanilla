class ChatUsers {
    constructor() {
        this.users = [];
    }

    addUser(user) {
        this.users.push(user);
        this.logger();
    };

    deleteUser(currUserId) {
        this.users = this.users.filter(user => user.id !== currUserId);
        this.logger();
    };

    getRoomUsers(room) {
        const users =  this.users.filter(user => user.room === room);
        return users;
    };

    getCurrentUser(id) {
        const foundUser = this.users.find(user => user.id === id);
        if (foundUser) {
            return foundUser
        } else {
            return 'User was not found'
        };
    }

    logger() {
        console.log(this.users)
    }
};

const chatUsers = new ChatUsers();
module.exports = chatUsers;