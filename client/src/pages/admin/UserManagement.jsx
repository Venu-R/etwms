import { useEffect, useState } from 'react'
import { getUsersApi, updateUserApi } from '../../api'
import Spinner from '../../components/common/Spinner'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = () => {
    getUsersApi()
      .then(res => setUsers(res.data.data.users))
      .finally(() => setLoading(false))
  }

  useEffect(fetchUsers, [])

  const toggle = async (user) => {
    await updateUserApi(user._id, { isActive: !user.isActive })
    fetchUsers()
  }

  if (loading) return <Spinner />

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Users</h1>

      <table className="w-full text-sm">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => toggle(u)}>
                  {u.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}