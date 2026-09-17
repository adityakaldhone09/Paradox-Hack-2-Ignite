export interface AuthorizedDevice {
  id: string;
  device_id: string;
  device_fingerprint: string;
  centre_id: string;
  device_name: string;
  os: string;
  ip_address: string;
  status: 'AUTHORIZED' | 'PENDING' | 'REVOKED';
  registered_at: string;
  last_seen?: string;
}

export interface DeviceRegisterInput {
  device_id: string;
  device_fingerprint: string;
  centre_id: string;
  device_name: string;
  os: string;
  ip_address: string;
}
