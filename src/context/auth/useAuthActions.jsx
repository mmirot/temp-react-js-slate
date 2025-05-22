import { useState } from 'react';
import { supabase, checkConnection } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function useAuthActions() {
  const navigate = useNavigate();

  const signIn = async (email, password) => {
    try {
      // Check connection first
      const connectionOk = await checkConnection();
      if (!connectionOk) {
        toast.error('Cannot sign in - No connection to Supabase. Please check your connection.');
        return { success: false, error: 'No connection to Supabase' };
      }
      
      console.log('AuthContext - Attempting sign in:', email);
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      console.log('AuthContext - Sign in successful');
      return { success: true, data };
    } catch (error) {
      console.error('AuthContext - Sign in error:', error.message);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email, password) => {
    try {
      // Check connection first
      const connectionOk = await checkConnection();
      if (!connectionOk) {
        toast.error('Cannot sign up - No connection to Supabase. Please check your connection.');
        return { success: false, error: 'No connection to Supabase' };
      }
      
      console.log('AuthContext - Attempting sign up:', email);
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      console.log('AuthContext - Sign up successful');
      toast.success('Signup successful! Please check your email for verification.');
      return { success: true, data };
    } catch (error) {
      console.error('AuthContext - Sign up error:', error.message);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      console.log('AuthContext - Attempting sign out');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log('AuthContext - Sign out successful');
    } catch (error) {
      console.error('AuthContext - Sign out error:', error.message);
      toast.error(error.message);
    }
  };

  return {
    signIn,
    signUp,
    signOut
  };
}
