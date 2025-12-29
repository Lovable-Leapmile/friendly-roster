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
  created_at?: string;
  updated_at?: string;
}

export interface Location {
  id: number;
  name: string;
  address?: string;
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

export const api = {
  async getUsers(): Promise<User[]> {
    const response = await fetch(
      `${API_BASE}/users/?order_by_field=updated_at&order_by_type=DESC`,
      { headers }
    );
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  async getLocations(): Promise<Location[]> {
    const response = await fetch(
      `${API_BASE}/locations/?order_by_field=updated_at&order_by_type=DESC`,
      { headers }
    );
    if (!response.ok) throw new Error('Failed to fetch locations');
    return response.json();
  },

  async getPods(): Promise<Pod[]> {
    const response = await fetch(
      `${API_BASE}/pods/?order_by_field=updated_at&order_by_type=DESC`,
      { headers }
    );
    if (!response.ok) throw new Error('Failed to fetch pods');
    return response.json();
  },

  async getReservations(): Promise<Reservation[]> {
    const response = await fetch(
      `${API_BASE}/reservations/?order_by_field=updated_at&order_by_type=DESC`,
      { headers }
    );
    if (!response.ok) throw new Error('Failed to fetch reservations');
    return response.json();
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
    return response.json();
  },
};
