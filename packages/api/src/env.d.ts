declare namespace NodeJS {
  export interface ProcessEnv {
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    ACCESS_TOKEN_SECRET: string;
    SERVER_URL: string;
    SLACK_REPORT_URL: string;
    SLACK_SIGNING_SECRET: string;
    APPLE_KEY_ID: string;
    APPLE_SERVICE_ID: string;
    APPLE_TEAM_ID: string;
    APPLE_EMAIL: string;
    APPLE_PASSWORD: string;
  }
}
