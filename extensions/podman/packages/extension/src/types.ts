export type MachineJSON = {
  Name: string;
  CPUs: number;
  Memory: string;
  DiskSize: string;
  Running: boolean;
  Starting: boolean;
  Default: boolean;
  VMType: string;
  UserModeNetworking?: boolean;
  Port: number;
  RemoteUsername: string;
  IdentityPath: string;
};

export type ConnectionJSON = {
  Name: string;
  URI: string;
  Identity: string;
  IsMachine: boolean;
  Default: boolean;
};

export type MachineInfo = {
  name: string;
  cpus: number;
  memory: number;
  diskSize: number;
  userModeNetworking: boolean;
  cpuUsage: number;
  diskUsage: number;
  memoryUsage: number;
  vmType: string;
  port: number;
  remoteUsername: string;
  identityPath: string;
};

export type MachineListOutput = {
  stdout: string;
  stderr: string;
};

export type MachineJSONListOutput = {
  list: MachineJSON[];
  error: string;
};
