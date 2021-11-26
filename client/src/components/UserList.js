import React, { useEffect, useState } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

import { InviteIcon } from '../assets/InviteIcon';
import adduser from '../assets/add-user.png'
const ListContainer = ({ children }) => {
    return (
        <div className="user-list__container">
            <div className="user-list__header">
                <p>User</p>
                <p>Invite</p>
            </div>
            {children}
        </div>
    )
}

const UserItem = ({ user, setSelectedUsers }) => {
    const [selected, setSelected] = useState(false)
    const handleSelect = () => {
        if (selected) {
            setSelectedUsers((prevUsers) => prevUsers.filter((prevUser) => prevUser !== user.id))
        } else {
            setSelectedUsers((prevUsers) => [...prevUsers, user.id])
        }

        setSelected((prevSelected) => !prevSelected)
    }
    return (
        <div className="user-item__wrapper" onClick={handleSelect}>
            <div className="user-item__name-wrapper">
                <Avatar image={user.image} name={user.fullName || user.id} size={32} />
                <p className="user-item__name">{user.fullName || user.id}</p>
            </div>

            {selected ? <InviteIcon /> : <img src={adduser} alt="Adduser" width="20" style={{ marginRight: "10px" }}></img>}
        </div>
    )
}

const UserList = ({ setSelectedUsers }) => {
    const { client } = useChatContext();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [listEmpty, setListEmpty] = useState(false);
    const [error, setError] = useState(false);
    useEffect(() => {
        const getUsers = async () => {
            if (loading) return;

            setLoading(true);

            try {
                const response = await client.queryUsers(
                    { id: { $ne: client.userID } }, //excluding this ID by ne
                    { id: 1 }, // to sort
                    { limit: 15 } //limit of 15 users
                );

                if (response.users.length) {
                    setUsers(response.users);
                } else {
                    setListEmpty(true);
                }
            } catch (error) {
                setError(true);
            }
            setLoading(false);
        }

        if (client) getUsers()
    }, []);

    if (error) {
        <ListContainer>
            <div className="user-list_message">Please refresh & try again</div>           
        </ListContainer>

    }
    if (listEmpty) {
        <ListContainer>
            <div className="user-list_message">No users found!</div>           
        </ListContainer>

    }
    return (
        <ListContainer>
            {
                loading ?
                    <div className="user-list_message">Loading Users</div> :
                    (
                        users?.map((user, i) => (
                            <UserItem index={i} key={user.id} user={user} setSelectedUsers={setSelectedUsers} />
                        ))
                    )
            }
        </ListContainer>
    )
}

export default UserList;