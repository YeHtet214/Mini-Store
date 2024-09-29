import { ChangeEvent, FormEvent, useState } from "react";
import { useUser } from "../../context/UserContextProvider";
import * as UserServices from "../../services/User.service";
import { User } from "../../types/types";
import { XMarkIcon } from "@heroicons/react/24/outline";

const ManageUsers = () => {
    const { users, deleteUser, addUser } = useUser();
    const [ toggleUserInput, setToggleUserInput ] = useState<boolean>(false);
    const [ newUser, setNewUser ] = useState<User>({ name: '', email: '', password: '', role: 'user'});

    const handleAddUser = async (e: FormEvent) => {
        e.preventDefault();
        if ( !newUser || (!newUser.name || !newUser.email || !newUser.password || !newUser.role) ) return;
        const createdUser = await UserServices.createNewUser(newUser);
        addUser(createdUser);
        setNewUser({ name: '', email: '', password: '', role: 'user'});
        setToggleUserInput(false);
    }

    const handleUserInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value} as User));
    }

    const hanldeUserDelete = async (user_id: number) => {
        const deletedUser = await UserServices.deleteUser(user_id);
        console.log("Deleted User: ", deletedUser);
        deleteUser(user_id);
    }

    return (
        <div>
            <h1>User Management</h1>
            <button onClick={() => setToggleUserInput(true)}>Add User</button>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                { users?.map(user => (
                    <tr key={user.user_id}>
                        <td>{user.user_id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        { user.email !== "yhtet1934@gmail.com" && (
                            <td>
                                <button onClick={() => hanldeUserDelete(Number(user.user_id))}>Delete</button>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>

            { toggleUserInput && (
                <form className="relative" onSubmit={handleAddUser}>
                    <XMarkIcon className="w-6 absolute top-0 right-0 text-red-500 cursor-pointer" onClick={() => setToggleUserInput(false)}/>
                    <input type="text" name="name" placeholder="User Name..." value={newUser?.name} onChange={handleUserInputChange} required />
                    <input type="email" name="email" placeholder="Email..." value={newUser?.email} onChange={handleUserInputChange}  required />
                    <input type="password" name="password" placeholder="Password..." value={newUser?.password} onChange={handleUserInputChange}  required />
                    <select name="role" value={newUser?.role} onChange={handleUserInputChange}>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                    <button type="submit">Add</button>
                </form>
            )}
        </div>
        
    )
}

export default ManageUsers;

