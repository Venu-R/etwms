import { createContext, useContext, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'
import useAppStore from '../store/useAppStore'

const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth()
  const socketRef = useRef(null)

  const addNotification = useAppStore((s) => s.addNotification)
  const updateTaskInStore = useAppStore((s) => s.updateTaskInStore)

  useEffect(() => {
    if (!isAuthenticated) return

    socketRef.current = io('http://localhost:5000', {
      query: { token },
    })

    socketRef.current.on('task:assigned', (data) => {
      toast(`New task: ${data.title}`)
      addNotification(data)
    })

    socketRef.current.on('task:updated', (data) => {
      updateTaskInStore(data.taskId, { status: data.status })
    })

    return () => socketRef.current?.disconnect()
  }, [isAuthenticated])

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)