export type PakeyStudioPlatform = 'macos' | 'windows' | 'linux';

export type PakeyStudioUrlKind = 'web' | 'local';

export type PakeyStudioBundleTarget =
  | 'app'
  | 'dmg'
  | 'msi'
  | 'deb'
  | 'appimage'
  | 'rpm';

export interface PakeyStudioWindowModel {
  url: string;
  urlKind: PakeyStudioUrlKind;
  title?: string;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  resizable: boolean;
  fullscreen: boolean;
  maximize: boolean;
  hideTitleBar: boolean;
  alwaysOnTop: boolean;
  hideOnClose?: boolean;
  startToTray: boolean;
  enableFind: boolean;
  enableDragDrop: boolean;
  newWindow: boolean;
  forceInternalNavigation: boolean;
  internalUrlRegex?: string;
  zoom: number;
}

export interface PakeyStudioIdentityModel {
  name: string;
  identifier: string;
  version: string;
  iconPath?: string;
  systemTrayIconPath?: string;
}

export interface PakeyStudioRuntimeModel {
  userAgent?: Partial<Record<PakeyStudioPlatform, string>>;
  proxyUrl?: string;
  incognito: boolean;
  wasm: boolean;
  multiInstance: boolean;
  multiWindow: boolean;
  showSystemTray: Partial<Record<PakeyStudioPlatform, boolean>>;
  disabledWebShortcuts: boolean;
  activationShortcut?: string;
  ignoreCertificateErrors: boolean;
}

export interface PakeyStudioBuildModel {
  platform?: PakeyStudioPlatform;
  targets: PakeyStudioBundleTarget[];
  debug: boolean;
  keepBinary: boolean;
  iterativeBuild: boolean;
  installerLanguage?: string;
  macos?: {
    multiArch: boolean;
    installAfterBuild: boolean;
    cameraEntitlement: boolean;
    microphoneEntitlement: boolean;
  };
}

export interface PakeyStudioInjectionModel {
  files: string[];
}

export interface PakeyStudioProjectModel {
  schemaVersion: 1;
  identity: PakeyStudioIdentityModel;
  window: PakeyStudioWindowModel;
  runtime: PakeyStudioRuntimeModel;
  build: PakeyStudioBuildModel;
  injection: PakeyStudioInjectionModel;
  metadata?: {
    createdBy?: string;
    notes?: string;
    tags?: string[];
  };
}

export const PAKEY_STUDIO_PROJECT_SCHEMA_VERSION = 1 as const;

export function createDefaultPakeyStudioProject(
  name: string,
  url: string,
): PakeyStudioProjectModel {
  return {
    schemaVersion: PAKEY_STUDIO_PROJECT_SCHEMA_VERSION,
    identity: {
      name,
      identifier: `com.pakey.${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      version: '1.0.0',
    },
    window: {
      url,
      urlKind: 'web',
      width: 1200,
      height: 780,
      resizable: true,
      fullscreen: false,
      maximize: false,
      hideTitleBar: false,
      alwaysOnTop: false,
      startToTray: false,
      enableFind: false,
      enableDragDrop: false,
      newWindow: false,
      forceInternalNavigation: false,
      zoom: 100,
    },
    runtime: {
      incognito: false,
      wasm: false,
      multiInstance: false,
      multiWindow: false,
      showSystemTray: {},
      disabledWebShortcuts: false,
      ignoreCertificateErrors: false,
    },
    build: {
      targets: [],
      debug: false,
      keepBinary: false,
      iterativeBuild: false,
      macos: {
        multiArch: false,
        installAfterBuild: false,
        cameraEntitlement: false,
        microphoneEntitlement: false,
      },
    },
    injection: {
      files: [],
    },
  };
}
