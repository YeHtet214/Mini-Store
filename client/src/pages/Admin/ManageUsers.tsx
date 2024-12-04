import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useUser } from "../../context/UserContextProvider";
import * as UserServices from "../../services/User.service";
import { User } from "../../types/types";
import { PencilIcon, PlusIcon, Search, TrashIcon, XIcon } from "lucide-react";

interface InputUserFormProps {
    type: "create" | "update";
    handleUserAction: (user: User) => void;
    user: User | null;
    closeModal: () => void;
}

const initialUser = {
  name: "",
  email: "",
  password: "",
  role: ""
}

const InputUserForm = ({ type, closeModal, handleUserAction, user }: InputUserFormProps) => {
    const [ userData, setUserData ] = useState<User>(user || initialUser);

    useEffect(() => console.log("User: ", user), [])

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { value, name } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleUserAction(userData);
        setUserData({ name: '', email: '', password: '', role: '' });
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative overflow-hidden">
          <div className="bg-gray-500 p-6">
            <h2 className="text-2xl font-bold text-white">
              { type === "create" 
                  ? <span>Enter New User Data</span>
                  : <span>Update User</span>
              }
            </h2>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
              aria-label="Close"
            >
              <XIcon size={24} />
            </button>
          </div>
          <form className="p-6 space-y-4" onSubmit={(e) => handleSubmit(e)}>
            <div>
              <label htmlFor="user-name" className="block text-sm font-medium text-gray-700 mb-1">
                User Name
              </label>
              <input
                type="text"
                id="user-name"
                name="name"
                value={userData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Doe"
                required={type === "create"}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="john@example.com"
                required={type === "create"}
              />
            </div>
              { type === "create" && (
                  <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                      </label>
                      <input
                          type="password"
                          id="password"
                          name="password"
                          value={userData.password}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="••••••••"
                          required={type === "create"}
                      />
                  </div>
              )}
              <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                  </label>
                  <select
                      id="role"
                      name="role"
                      value={userData.role}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required={type === "create"}
                  >
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
              </select>
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                { type === "create" ? "Add User" : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )   
}

const ManageUsers = () => {
    const { users, deleteUser, addUser, updateUser } = useUser();
    const [ currentUsers, setCurrentUsers ] = useState<User[]>(users);
    const [ currentUser, setCurrentUser ] = useState<User | null>(null);
    const [ isModalOpen, setIsModalOpen ] = useState<boolean>(false);
    const [ searchTerm, setSearchTerm ] = useState("");
    const [ inputFormType, setInputFormType ] = useState<"create" | "update">();

    useEffect(() => {
      setCurrentUsers(users)
    }, [users])

    useEffect(() => {
        const filteredUsers = users.filter(user => {
            return user.email?.includes(searchTerm) ||
                    user.name?.includes(searchTerm) ||
                    user.role?.includes(searchTerm) ||
                    String(user.user_id)?.includes(searchTerm) ? user : null
        });
        setCurrentUsers(filteredUsers);
    }, [searchTerm])

    const handleAddUser = async (newUser: User) => {
        if ( !newUser || (!newUser.name || !newUser.email || !newUser.password || !newUser.role) ) return;
        const createdUser = await UserServices.createNewUser(newUser);
        if (createdUser) addUser(createdUser);
        setIsModalOpen(false);
    }

    const handleUpdateUser = async (userData: User) => {
        if (userData.email || userData.name || userData.password || userData.role) {
            const updatedUser = await UserServices.updateUser(userData);
            if (updateUser) updateUser(updatedUser);
          closeModal();
        }
    }

    const handleUserDelete = async (user_id: number | undefined) => {
        if (!user_id) return;
        await UserServices.deleteUser(user_id);
        deleteUser(user_id);
    }

    const openModal = (type: "create" | "update", id?: number) => {
        setIsModalOpen(true)
        setInputFormType(type);
        if (type === "update" && id) setCurrentUser(() => currentUsers.find(user => user.user_id === id) || null);
    }

    const closeModal = () => {
      setIsModalOpen(false);
      setCurrentUser(null);
    }

    document.addEventListener('keydown', event => {
        if (event.key === "Escape") closeModal();
    })

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">User Management</h1>
            <div className="flex gap-4">
                <div className="relative flex-grow">
                    <input
                    type="text"
                    placeholder="Search orders..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
                <button
                    onClick={() => openModal("create")}
                    className="flex-end bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 mb-6 rounded inline-flex items-center"
                >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add User
                </button>
            </div>
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full leading-normal">
                <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Id
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    { currentUsers?.map(user => (
                        <tr key={user.user_id}>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {user.user_id}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {user.name}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {user.email}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {user.role?.toUpperCase()}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <button
                                    onClick={() => openModal("update", user.user_id)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                >
                                    <PencilIcon className="w-5 h-5" />
                                </button>

                                
                                { user.email !== "yhtet1934@gmail.com" && ( /* To avoid deleting all the users, which make impossible to login again into admin dashboard */
                                    <button 
                                        onClick={() => handleUserDelete(Number(user.user_id))}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            { (isModalOpen && inputFormType) && <InputUserForm type={inputFormType} user={currentUser} handleUserAction={(data) => inputFormType === "create" ? handleAddUser(data) : handleUpdateUser(data)} closeModal={() => closeModal()} /> }
        </div>
        
    )
}

export default ManageUsers;

