import { getRagnaClient } from '@/common/http/ragna.client';
import { defineAbilityFor } from '@/modules/ability/services/ability.service';
import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

const UserRoles = {
  ADMIN: 'admin',
} as const;

interface Team {
  id: string;
  name: string;
  description: string;
}

interface AuthUser {
  id: string;
  firstTeamId: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  totalCredits: number;
  onboardedAt: string | null;
  teams: Team[];
  roles: string[];
}

export const useAuthStore = defineStore('auth-store', () => {
  const client = getRagnaClient();
  // State
  const user = ref<AuthUser | null>(null);
  const accessToken = ref<string | null>(null);
  const accessTokenExpiresAt = ref<number | null>(null);
  const isFetchingUser = ref(false);
  const refreshAttempts = ref(0);
  const maxRefreshAttempts = ref(3);
  const dateNow = ref(Date.now());

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!accessToken.value);
  const userHasAdminRole = computed(() => !!user.value?.roles?.includes(UserRoles.ADMIN));
  const userFirstName = computed(() => user.value?.firstName || 'Guest User');
  const userFirstTeamId = computed(() => user.value?.firstTeamId || '-1');
  const userCredits = computed(() => user.value?.totalCredits || 0);
  const onboardingIsComplete = computed(() => !!user.value?.onboardedAt);
  const hasAccessToken = computed(() => !!accessToken.value);
  const getAccessTokenExpiresAt = computed(() => accessTokenExpiresAt.value);
  const accessTokenExpired = computed(
    () => !!accessTokenExpiresAt.value && accessTokenExpiresAt.value < Date.now(),
  );
  const hasRefreshToken = computed(() => {
    const token = useStorage('refreshToken', null, localStorage);
    return !!token.value;
  });

  const getAccessToken = computed(() => accessToken.value);
  const getRefreshToken = computed(() => localStorage.getItem('refreshToken'));

  // Actions
  const clearUser = () => {
    user.value = null;
    accessToken.value = null;
  };

  const clearRefreshToken = () => {
    localStorage.removeItem('refreshToken');
  };

  const setAccessToken = (token: string, expiresAt: number) => {
    accessToken.value = token;
    accessTokenExpiresAt.value = expiresAt * 1000;
  };

  const setRefreshToken = (token: string) => {
    localStorage.setItem('refreshToken', token);
  };

  const fetchUser = async () => {
    if (isFetchingUser.value) return;
    isFetchingUser.value = true;
    try {
      const data = await client.account.fetchAccountData();
      user.value = {
        id: data.id,
        firstTeamId: data.firstTeamId,
        name: data.name,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        totalCredits: data.totalCredits,
        onboardedAt: data.onboardedAt,
        teams: data.teams,
        roles: data.roles,
      };
      defineAbilityFor(user.value);
    } catch (error) {
      clearUser();
      throw error;
    } finally {
      isFetchingUser.value = false;
    }
  };

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      const { refreshToken, accessToken, accessTokenExpiresAt } = await client.auth.loginUser({
        email,
        password,
      });
      setAccessToken(accessToken, accessTokenExpiresAt);
      setRefreshToken(refreshToken);
      await fetchUser();
    } catch (error) {
      clearUser();
      throw error;
    }
  };

  const logout = async () => {
    try {
      await client.auth.logoutUser();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      clearUser();
      clearRefreshToken();
    }
  };

  const refreshAuth = async () => {
    refreshAttempts.value++;
    if (refreshAttempts.value > maxRefreshAttempts.value) {
      clearUser();
      refreshAttempts.value = 0;
      return Promise.reject(new Error('Max refresh attempts reached'));
    }
    try {
      const { refreshToken, accessToken, accessTokenExpiresAt } = await client.auth.refreshTokens();
      setAccessToken(accessToken, accessTokenExpiresAt);
      setRefreshToken(refreshToken);
      await fetchUser();
      refreshAttempts.value = 0;
    } catch (error) {
      clearUser();
      throw error;
    }
  };

  const register = async (payload: {
    name: string;
    email: string;
    password: string;
    termsAndConditions: boolean;
    invitationCode?: string;
  }) => {
    try {
      await client.auth.registerUser(payload);
      await login({
        email: payload.email,
        password: payload.password,
      });
    } catch (error) {
      throw error;
    }
  };

  const socialGoogleLogin = async (query: { code: string | undefined }) => {
    if (!query.code) {
      throw new Error('No code provided');
    }
    try {
      const data = await client.auth.googleAuth({
        code: query.code,
        scope: undefined,
        authuser: undefined,
        prompt: undefined,
      });
      setAccessToken(data.accessToken, data.accessTokenExpiresAt);
      setRefreshToken(data.refreshToken);
      await fetchUser();
    } catch (error) {
      clearUser();
      throw error;
    }
  };

  const getSession = async () => {
    try {
      await client.auth.fetchSession();
    } catch (error) {
      clearUser();
      throw error;
    }
  };

  return {
    // State
    user,
    accessToken,
    accessTokenExpiresAt,
    isFetchingUser,
    refreshAttempts,
    maxRefreshAttempts,
    dateNow,

    // Getters
    isAuthenticated,
    userHasAdminRole,
    userFirstName,
    userFirstTeamId,
    userCredits,
    onboardingIsComplete,
    hasAccessToken,
    getAccessToken,
    getAccessTokenExpiresAt,
    accessTokenExpired,
    hasRefreshToken,
    getRefreshToken,

    // Actions
    clearUser,
    clearRefreshToken,
    setAccessToken,
    setRefreshToken,
    fetchUser,
    login,
    logout,
    refreshAuth,
    register,
    socialGoogleLogin,
    getSession,
  };
});
