export interface AccountData {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  totalCredits: number;
  email: string;
  organisation: any;
  roles: any;
  teams: any;
  organisationId: string;
  firstTeamId: string;
  onboardedAt: string | null;
  hasOnboarded: boolean;
  hasEmailVerified: boolean;
}

export interface AccountDataResponse {
  account: AccountData;
}
