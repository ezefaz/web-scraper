declare global {
	namespace NodeJS {
		interface processEnv {
			NODE_ENV: "development" | "production";
		}
	}
}

export {};
