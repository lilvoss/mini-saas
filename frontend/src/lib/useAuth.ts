import { useMutation, useQuery } from '@tanstack/react-query';
import * as api from './api';
import { useState } from 'react';

type RegisterData = {
  fullName: string;
  email: string;
  password: string;
};

type LoginData = {
  email: string;
  password: string;
};

type AuthResponse = {
  token: string;
  user: {
    id: string;
    email: string;
  };
};

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
  );

  const registerMutation = useMutation<AuthResponse, Error, RegisterData>({
    mutationFn: async ({ fullName, email, password }) => {
      console.log('[register] → Envoi de la requête', { fullName, email });
      try {
        const data = await api.register(fullName, email, password);
        console.log('[register] ✓ Réponse reçue', data);
        return data;
      } catch (err) {
        console.error('[register] ✗ Erreur', err);
        throw err;
      }
    },
    onSuccess: (data) => {
      console.log('[register] onSuccess — token reçu', data.token);
      setToken(data.token);
      localStorage.setItem('token', data.token);
    },
    onError: (error) => {
      console.error('[register] onError —', error.message);
    },
  });

  const loginMutation = useMutation<AuthResponse, Error, LoginData>({
    mutationFn: async ({ email, password }) => {
      console.log('[login] → Envoi de la requête', { email });
      try {
        const data = await api.login(email, password);
        console.log('[login] ✓ Réponse reçue', data);
        return data;
      } catch (err) {
        console.error('[login] ✗ Erreur', err);
        throw err;
      }
    },
    onSuccess: (data) => {
      console.log('[login] onSuccess — token reçu', data.token);
      setToken(data.token);
      localStorage.setItem('token', data.token);
    },
    onError: (error) => {
      console.error('[login] onError —', error.message);
    },
  });

  const profileQuery = useQuery({
    queryKey: ['profile', token],
    queryFn: async () => {
      if (!token) throw new Error('No token provided');
      console.log('[profile] → Récupération du profil');
      const data = await api.getProfile(token);
      console.log('[profile] ✓ Profil reçu', data);
      return data;
    },
    enabled: !!token,
  });

  const logout = () => {
    console.log('[logout] Déconnexion');
    setToken(null);
    localStorage.removeItem('token');
  };

  return { token, registerMutation, loginMutation, profileQuery, logout };
};