
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface IslamicResponse {
  answer: string;
  sources: string[];
  confidence: number;
  category: "quran" | "hadith" | "fiqh" | "dua" | "general";
}

class IslamicApiService {
  private baseUrl: string = "http://192.168.1.3:8000";
  private apiKey?: string;

  constructor() {}

  async initialize() {
    const endpoint = await AsyncStorage.getItem("irfan_swagger_endpoint");
    const key = await AsyncStorage.getItem("irfan_api_key");
    this.baseUrl = endpoint || this.baseUrl;
    this.apiKey = key || undefined;
  }

  private async makeRequest<T>(
    endpoint: string,
    method: "GET" | "POST" = "POST",
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      if (!this.baseUrl) throw new Error("Swagger endpoint not configured");

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (this.apiKey) headers["Authorization"] = `Bearer ${this.apiKey}`;

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error("API Request failed:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  async askQuestion(query: string, session_id: string): Promise<ApiResponse<IslamicResponse>> {
    return this.makeRequest<IslamicResponse>("/api/irfan/chat", "POST", {
      query,
      session_id,
      stream: false,
      language: "tr",
      temperature: 0.2,
      top_p: 0.95,
      max_tokens: 800,
    });
  }

  async getDemoResponse(question: string): Promise<IslamicResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      answer: `Bu bir demo yanıttır. "${question}" sorunuz için İslami kaynaklardan detaylı bilgi vereceğim.`,
      sources: ["Demo Kaynak 1", "Demo Kaynak 2"],
      confidence: 0.8,
      category: "general",
    };
  }

  async updateEndpoint(newEndpoint: string) {
    this.baseUrl = newEndpoint;
    await AsyncStorage.setItem("irfan_swagger_endpoint", newEndpoint);
  }

  async updateApiKey(newApiKey: string) {
    this.apiKey = newApiKey;
    await AsyncStorage.setItem("irfan_api_key", newApiKey);
  }

  getEndpoint(): string {
    return this.baseUrl;
  }

  isConfigured(): boolean {
    return !!this.baseUrl;
  }

  generateUUID(): string {
    return uuidv4();
  }
}

const islamicApiService = new IslamicApiService();
export { islamicApiService };
export type { ApiResponse, IslamicResponse };



/*
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface IslamicResponse {
  answer: string;
  sources: string[];
  confidence: number;
  category: "quran" | "hadith" | "fiqh" | "dua" | "general";
}

class IslamicApiService {
  private baseUrl: string = " "; // Gerçek backend URL
  private apiKey?: string;

  constructor() {}

  async initialize() {
    const key = await AsyncStorage.getItem("irfan_api_key");
    this.apiKey = key || undefined;
  }

  private async makeRequest<T>(
    endpoint: string,
    method: "GET" | "POST" = "POST",
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      if (!this.baseUrl) throw new Error("Swagger endpoint not configured");

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (this.apiKey) headers["Authorization"] = `Bearer ${this.apiKey}`;

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error("API Request failed:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  async askQuestion(query: string, session_id: string): Promise<ApiResponse<IslamicResponse>> {
    return this.makeRequest<IslamicResponse>("/api/irfan/chat", "POST", {
      query,
      session_id,
      stream: false,
      language: "tr",
      temperature: 0.2,
      top_p: 0.95,
      max_tokens: 800,
    });
  }

  async updateApiKey(ApiKey: string) {
    this.apiKey = ApiKey;
    await AsyncStorage.setItem("irfan_api_key", ApiKey);
  }

  getEndpoint(): string {
    return this.baseUrl;
  }

  isConfigured(): boolean {
    return !!this.baseUrl;
  }

  generateUUID(): string {
    return uuidv4();
  }
}

const islamicApiService = new IslamicApiService();
export { islamicApiService };
export type { ApiResponse, IslamicResponse };
*/