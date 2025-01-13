import { useAccountService } from '@/composables/services/useAccountService';
import { useAuthService } from '@/composables/services/useAuthService';
import { defineAbilityFor } from '@/services/ability.service';
import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';

enum UserRoles {
  ADMIN = 'admin',
  // Additional roles...
}

interface Team {
  id: string;
  name: string;
  description: string;
}

interface AuthUser {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  onboardedAt: string | null;
  credit: any;
  teams: Team[];
  roles: string[];
  firstTeamId: string;
  totalCredits: number;
}

interface IAuthState {
  user: AuthUser | null;
  accessToken: string | null;
  accessTokenExpiresAt: number | null;
  isFetchingUser: boolean;
  refreshAttempts: number;
  maxRefreshAttempts: number;
  dateNow: number;
}

export const useAuthStore = defineStore('auth-store', {
  state: (): IAuthState => ({
    user: null,
    accessToken: null,
    accessTokenExpiresAt: null,
    isFetchingUser: false,
    refreshAttempts: 0,
    maxRefreshAttempts: 3,
    dateNow: Date.now(),
  }),
  getters: {
    isAuthenticated(state): boolean {
      return !!state.user && !!state.accessToken;
    },
    userHasAdminRole(state): boolean {
      return !!state.user?.roles?.includes(UserRoles.ADMIN);
    },
    getUser(state): AuthUser | null {
      return state.user;
    },
    userCredits(state): number {
      // @ts-ignore
      const amounts = state.user?.credit.map(c => c.amount) || [];
      // @ts-ignore
      return amounts.reduce((a, b) => a + b, 0);
    },
    onboardingIsComplete(state): boolean {
      return !!state.user?.onboardedAt;
    },
    hasAccessToken(state): boolean {
      return !!state.accessToken;
    },
    getAccessToken(state): string | null {
      return state.accessToken;
    },
    getAccessTokenExpiresAt(state): number | null {
      return state.accessTokenExpiresAt;
    },
    accessTokenExpired(state): boolean {
      return (
        !!state.accessTokenExpiresAt && state.accessTokenExpiresAt < Date.now()
      );
    },
    hasRefreshToken(): boolean {
      const token = useStorage('refreshToken', null, localStorage);
      return !!token.value;
    },
    getRefreshToken(): string | null {
      return localStorage.getItem('refreshToken');
    },
  },
  actions: {
    /**
     * Clears the current user.
     */
    clearUser(): void {
      this.user = null;
      this.accessToken = null;
    },
    /**
     * Clears the refresh token.
     */
    clearRefreshToken(): void {
      localStorage.removeItem('refreshToken');
    },
    /**
     * Logs in the user with provided credentials.
     * @param email User's email address.
     * @param password User's password.
     */
    async login({
      email,
      password,
    }: {
      email: string;
      password: string;
    }): Promise<void> {
      const { loginUser } = useAuthService();
      try {
        const { refreshToken, accessToken, accessTokenExpiresAt } =
          await loginUser({
            email,
            password,
          });
        this.setAccessToken(accessToken, accessTokenExpiresAt);
        this.setRefreshToken(refreshToken);
        await this.fetchUser();
      } catch (error) {
        this.clearUser();
        throw error;
      }
    },
    async register(payload: {
      name: string;
      email: string;
      password: string;
      termsAndConditions: boolean;
      invitationCode?: string;
    }): Promise<void> {
      const { registerUser } = useAuthService();

      try {
        const response = await registerUser({
          name: payload.name,
          email: payload.email,
          password: payload.password,
          termsAndConditions: payload.termsAndConditions,
          invitationCode: payload.invitationCode,
        });

        // auto login user and fetch user data
        await this.login({
          email: payload.email,
          password: payload.password,
        });
      } catch (error) {
      } finally {
      }
    },
    async socialGoogleLogin(query: {
      code: string | undefined;
    }): Promise<void> {
      if (!query.code) {
        throw new Error('No code provided');
      }
      const { googleAuth } = useAuthService();

      try {
        const data = await googleAuth({
          code: query.code,
          scope: undefined,
          authuser: undefined,
          prompt: undefined,
        });

        this.setAccessToken(data.accessToken, data.accessTokenExpiresAt);
        this.setRefreshToken(data.refreshToken);
        await this.fetchUser();
      } catch (error) {
        this.clearUser();
        throw error;
      }
    },
    /**
     * Logs out the current user.
     */
    async logout(): Promise<void> {
      const { logoutUser } = useAuthService();
      try {
        await logoutUser();
      } catch (error) {
        console.error('Logout failed:', error);
      } finally {
        this.clearUser();
        this.clearRefreshToken();
      }
    },
    /**
     * Refreshes the current session.
     */
    async refreshAuth(): Promise<void> {
      console.log('Refreshing token...', this.refreshAttempts);
      this.refreshAttempts++;
      if (this.refreshAttempts > this.maxRefreshAttempts) {
        this.clearUser();
        this.refreshAttempts = 0;
        return Promise.reject(new Error('Max refresh attempts reached'));
      }
      try {
        const { refreshTokens } = useAuthService();
        const { refreshToken, accessToken, accessTokenExpiresAt } =
          await refreshTokens();
        this.setAccessToken(accessToken, accessTokenExpiresAt);
        this.setRefreshToken(refreshToken);
        await this.fetchUser();
        this.refreshAttempts = 0;
      } catch (error) {
        this.clearUser();
        throw error;
      }
    },
    /**
     * Fetches the current authenticated user from the backend.
     */
    async fetchUser(): Promise<void> {
      const { fetchAccountData } = useAccountService();
      if (this.isFetchingUser) return;
      this.isFetchingUser = true;
      try {
        const data = await fetchAccountData();
        // @ts-ignore
        this.user = data;
        defineAbilityFor(this.user);
      } catch (error) {
        this.clearUser();
        throw error;
      } finally {
        this.isFetchingUser = false;
      }
    },
    /**
     * Get Session
     */
    async getSession(): Promise<void> {
      const { fetchSession } = useAuthService();
      try {
        const data = await fetchSession();
      } catch (error) {
        this.clearUser();
        throw error;
      }
    },
    /**
     * Sets the access token.
     * @param token Access token to set.
     */
    setAccessToken(token: string, expiresAt: number): void {
      this.accessToken = token;
      this.accessTokenExpiresAt = expiresAt * 1000;
    },
    /**
     * Sets the refresh token.
     * @param refreshToken Refresh token to set.
     */
    setRefreshToken(refreshToken: string): void {
      localStorage.setItem('refreshToken', refreshToken);
    },
  },
});
