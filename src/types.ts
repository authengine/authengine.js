// magic link client

export interface CreateMagicLinkData {
  email: string;
  customToken?: string;
  callbackUrl: string;
}

export interface CreateMagicLinkResponse {
  id: string;
  token: string;
}

export interface ValidateMagicLinkAttemptData {
  id: string;
  token: string;
  noNewSession?: boolean;
}

export interface ValidateMagicLinkAttemptResponse {
  token: string;
}

// session client

export interface Session {
  id: string;
  name: string;
  userAgent: string;
  ipAddress: string;
  createdAt: string;
}

export interface RevokeSessionData {
  id: string;
}

// user client

interface EmailAddress {
  id: string;
  address: string;
  md5: string;
}

export interface UserData {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: EmailAddress;
  sessions: Session[];
  createdAt: string;
}

export interface ResponseError {
  type: string;
  error: string;
  message: string;
}
