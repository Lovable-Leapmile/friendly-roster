const API_BASE = 'https://testhostpod.leapmile.com/podcore';
const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2wiOiJhZG1pbiIsImV4cCI6MTkyMzkxMjExNn0.ucy2a-N7Yrkam91i9itaaPJHGgADI6KmwPc_-8s93BI';

const headers = {
  'accept': 'application/json',
  'Authorization': AUTH_TOKEN,
  'Content-Type': 'application/json',
};

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  user_name?: string;
  user_phone?: string;
  user_email?: string;
  user_otp?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Location {
  id: number;
  name: string;
  location_name?: string;
  address?: string;
  location_address?: string;
  city?: string;
  state?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Pod {
  id: number;
  pod_id: string;
  location_id?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Reservation {
  id: number;
  pod_id?: number;
  user_id?: number;
  status?: string;
  drop_otp?: string;
  pickup_otp?: string;
  drop_validated?: boolean;
  pickup_validated?: boolean;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OtpData {
  id: number;
  pod_id: number;
  drop_otp?: string;
  pickup_otp?: string;
  drop_validated?: boolean;
  pickup_validated?: boolean;
}

interface ApiResponse<T> {
  status: string;
  records: T[];
  count?: number;
}

export const api = {
  async getUsers(): Promise<User[]> {
    const response = await fetch(
      `${API_BASE}/users/?order_by_field=updated_at&order_by_type=DESC`,
      { headers }
    );
    if (!response.ok) throw new Error('Failed to fetch users');
    const data: ApiResponse<User> = await response.json();
    return data.records || [];
  },

  async getLocations(): Promise<Location[]> {
    const response = await fetch(
      `${API_BASE}/locations/?order_by_field=updated_at&order_by_type=DESC`,
      { headers }
    );
    if (!response.ok) throw new Error('Failed to fetch locations');
    const data: ApiResponse<Location> = await response.json();
    return data.records || [];
  },

  async getPods(): Promise<Pod[]> {
    const response = await fetch(
      `${API_BASE}/pods/?order_by_field=updated_at&order_by_type=DESC`,
      { headers }
    );
    if (!response.ok) throw new Error('Failed to fetch pods');
    const data: ApiResponse<Pod> = await response.json();
    return data.records || [];
  },

  async getReservations(): Promise<Reservation[]> {
    const response = await fetch(
      `${API_BASE}/reservations/?order_by_field=updated_at&order_by_type=DESC`,
      { headers }
    );
    if (!response.ok) throw new Error('Failed to fetch reservations');
    const data: ApiResponse<Reservation> = await response.json();
    return data.records || [];
  },

  async createReservation(data: Record<string, unknown>): Promise<Reservation> {
    const response = await fetch(`${API_BASE}/reservations/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create reservation');
    return response.json();
  },

  async getOtpList(podId: number): Promise<OtpData[]> {
    const response = await fetch(
      `${API_BASE}/reservations/otp_list/?pod_id=${podId}`,
      { headers }
    );
    if (!response.ok) throw new Error('Failed to fetch OTP list');
    const data: ApiResponse<OtpData> = await response.json();
    return data.records || [];
  },
};
