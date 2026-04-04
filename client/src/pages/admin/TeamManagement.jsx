import { useEffect, useState } from 'react'
import { getTeamsApi, createTeamApi, getUsersApi } from '../../api'
import Spinner from '../../components/common/Spinner'

export default function TeamManagement() {
  const [teams, setTeams] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({ name: '', managerId: '' })

  const fetch = async () => {
    const [t, u] = await Promise.all([getTeamsApi(), getUsersApi()])
    setTeams(t.data.data.teams)
    setUsers(u.data.data.users)
    setLoading(false)
  }

  useEffect(fetch, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    await createTeamApi(form)
    fetch()
  }

  if (loading) return <Spinner />

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Teams</h1>

      <form onSubmit={handleCreate} className="mb-4">
        <input
          placeholder="Team name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <select
          onChange={(e) => setForm({ ...form, managerId: e.target.value })}
        >
          <option>Select Manager</option>
          {users.filter(u => u.role === 'manager').map(u => (
            <option key={u._id} value={u._id}>{u.name}</option>
          ))}
        </select>

        <button>Create</button>
      </form>

      {teams.map(t => (
        <div key={t._id}>
          {t.name} — {t.memberIds.length} members
        </div>
      ))}
    </div>
  )
}