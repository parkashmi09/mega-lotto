/**
 * Single socket instance – connect with optional token, used by useLogin and others.
 */

import io from 'socket.io-client';
import { SOCKET_URL } from '@/constants';
import storage from '@/utils/storage';
import { Event } from '@/utils/eventEmitter';

const DEVELOPMENT = import.meta.env.DEV ?? true;

let socket = null;

export function connect(token) {
  socket = io(SOCKET_URL, {
    secure: true,
    withCredentials: false,
    query: {
      auth_token: token ?? undefined,
      user_key: storage.getKey('key') ?? undefined,
    },
  });

  socket.on('connect', () => {
    Event.emit('connect');
  });

  socket.on('disconnect', () => {
    Event.emit('disconnect');
  });

  return socket;
}

if (!DEVELOPMENT) {
  if (storage.getKey('mthfk') === null) {
    connect(storage.getKey('token'));
  }
} else {
  connect(storage.getKey('token'));
}

export function getSocket() {
  return socket;
}

export function isSocketConnected() {
  return Boolean(socket?.connected);
}

export function disconnect() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export default socket;
