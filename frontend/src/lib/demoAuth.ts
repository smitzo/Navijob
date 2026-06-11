export type DemoRole = "candidate" | "recruiter";

export type DemoUserName = "demo" | "admin";

export type DemoSession = {
  username: DemoUserName;
  role: DemoRole;
  displayName: string;
  signedInAt: string;
};

export type DemoCredentials = {
  username: string;
  password: string;
  role: DemoRole;
};

const demoUsers: Record<DemoUserName, { password: string; displayName: string }> = {
  demo: {
    password: "demo",
    displayName: "Demo User",
  },
  admin: {
    password: "admin",
    displayName: "Admin User",
  },
};

export const demoSessionStorageKey = "navijob.demo_session";

export function authenticateDemoUser(credentials: DemoCredentials): DemoSession | null {
  const username = credentials.username.trim().toLowerCase() as DemoUserName;
  const demoUser = demoUsers[username];

  if (!demoUser || credentials.password !== demoUser.password) {
    return null;
  }

  return {
    username,
    role: credentials.role,
    displayName: demoUser.displayName,
    signedInAt: new Date().toISOString(),
  };
}

export function saveDemoSession(session: DemoSession) {
  window.localStorage.setItem(demoSessionStorageKey, JSON.stringify(session));
}

export function readDemoSession(): DemoSession | null {
  const rawSession = window.localStorage.getItem(demoSessionStorageKey);

  if (!rawSession) {
    return null;
  }

  try {
    const parsedSession = JSON.parse(rawSession) as DemoSession;

    if (
      (parsedSession.username === "demo" || parsedSession.username === "admin") &&
      (parsedSession.role === "candidate" || parsedSession.role === "recruiter")
    ) {
      return parsedSession;
    }
  } catch {
    return null;
  }

  return null;
}

export function clearDemoSession() {
  window.localStorage.removeItem(demoSessionStorageKey);
}
