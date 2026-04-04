import { useEffect, useState } from 'react'
import { adminDashboardApi } from '../../api'
import Spinner from '../../components/common/Spinner'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { logout } = useAuth()

  useEffect(() => {
    adminDashboardApi()
      .then(res => setData(res.data.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <button onClick={logout} className="text-red-500">Logout</button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card label="Users" value={data.userCount} />
        <Card label="Teams" value={data.teamCount} />
        <Card label="Projects" value={data.projectCount} />
        <Card label="Tasks" value={data.taskCount} />
      </div>

      <div className="flex gap-3">
        <button onClick={() => navigate('/admin/users')} className="btn">
          Manage Users
        </button>
        <button onClick={() => navigate('/admin/teams')} className="btn">
          Manage Teams
        </button>
      </div>
    </div>
  )
}

function Card({ label, value }) {
  return (
    <div className="bg-white border p-4 rounded">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  )
}