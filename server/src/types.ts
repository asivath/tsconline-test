export type AssetConfig = {
  activeJar: string,
  activeDatapacks: string[],
  decryptionJar: string,
  decryptionDirectory: string,
  datapacksDirectory: string
};

export function assertAssetConfig(o: any): asserts o is AssetConfig {
  if (typeof o !== 'object' || !o) throw 'AssetConfig must be an object';
  if (typeof o.activeJar !== 'string') throw 'AssetConfig must have an "activeJar" string';
  if (typeof o.decryptionJar !== 'string') throw 'AssetConfig must have a "decryptionJar" string';
  if (typeof o.decryptionDirectory !== 'string') throw 'AssetConfig must have a "decryptionDirectory" string';
  if (typeof o.datapacksDirectory !== 'string') throw 'AssetConfig must have a "datapackDirectory" string';
  if (!o.activeDatapacks || !Array.isArray(o.activeDatapacks)) throw 'AssetConfig must have an "activeJar" string';
  for (const [index, ad] of o.activeDatapacks.entries()) {
    if (typeof ad !== 'string') throw 'AssetConfig activeDatapacks item '+index+' must be a string';
  }
}
