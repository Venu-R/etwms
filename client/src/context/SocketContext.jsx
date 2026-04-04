import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import useAppStore from '../store/useAppStore';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const addNotification = useAppStore((s) => s.addNotification);
  const updateTaskInStore = useAppStore((s) => s.updateTaskInStore);

  useEffect(() => {
    if (!isAuthenticated || !token) return undefined;

    socketRef.current = io('http://localhost:5000', {
      query: { token },
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => {
      setConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      setConnected(false);
    });

    socketRef.current.on('task:assigned', (payload) => {
      toast(`New task assigned: ${payload.title}`, { icon: '📋' });
      addNotification({ type: 'task:assigned', ...payload, timestamp: new Date() });
    });

    socketRef.current.on('task:updated', (payload) => {
      updateTaskInStore(payload.taskId, { status: payload.status });
      addNotification({ type: 'task:updated', ...payload, timestamp: new Date() });
    });

    socketRef.current.on('task:commented', (payload) => {
      addNotification({ type: 'task:commented', ...payload, timestamp: new Date() });
    });

    socketRef.current.on('project:closed', (payload) => {
      toast(`Project closed: ${payload.title}`, { icon: '✅' });
      addNotification({ type: 'project:closed', ...payload, timestamp: new Date() });
    });

    socketRef.current.on('notification:new', (payload) => {
      toast(payload.message);
      addNotification({ ...payload, timestamp: new Date() });
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, token, addNotification, updateTaskInStore]);

  const joinProject = (projectId) => socketRef.current?.emit('join:project', projectId);
  const leaveProject = (projectId) => socketRef.current?.emit('leave:project', projectId);
  const joinTeam = (teamId) => socketRef.current?.emit('join:team', teamId);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected, joinProject, leaveProject, joinTeam }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
